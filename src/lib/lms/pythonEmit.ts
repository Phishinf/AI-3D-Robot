/**
 * Emits TypeScript from the JSON AST produced by scripts/lib/py_ast_dump.py.
 *
 * Scope note: this is a best-effort transpiler for the *specific* subset of
 * Python used by LEGO's "Anton's Mindstorms Hacks"-style hub scripts found
 * in this repo's Tars-program-files — classes with __init__/@staticmethod/
 * @property accessors, closures, list comprehensions, for/while/if, and the
 * `hub`/`utime`/`random` MicroPython APIs. It is not a general Python
 * compiler: unhandled constructs are emitted as a commented placeholder
 * rather than guessed at.
 */

export interface PyNode {
  _type: string;
  [key: string]: unknown;
}

const RESERVED = new Set([
  "function", "class", "in", "of", "new", "delete", "void", "typeof", "instanceof",
  "this", "super", "extends", "import", "export", "default", "case", "switch",
  "let", "const", "var", "return", "if", "else", "for", "while", "do", "break",
  "continue", "try", "catch", "finally", "throw", "yield", "async", "await",
  "static", "get", "set", "public", "private", "protected", "readonly",
  "interface", "type", "enum", "implements", "package", "with", "debugger",
  "null", "true", "false", "arguments", "eval",
]);

function sanitizeId(name: string): string {
  return RESERVED.has(name) ? `${name}_` : name;
}

function ind(depth: number): string {
  return "  ".repeat(depth);
}

// ---------------------------------------------------------------------------
// Generic tree walk
// ---------------------------------------------------------------------------

function walkAny(node: unknown, visit: (n: PyNode) => void, stopAtDefs: boolean): void {
  if (Array.isArray(node)) {
    for (const item of node) walkAny(item, visit, stopAtDefs);
    return;
  }
  if (node && typeof node === "object" && typeof (node as PyNode)._type === "string") {
    const n = node as PyNode;
    if (stopAtDefs && (n._type === "FunctionDef" || n._type === "ClassDef" || n._type === "Lambda")) {
      return;
    }
    visit(n);
    for (const key of Object.keys(n)) {
      if (key === "_type") continue;
      walkAny(n[key], visit, stopAtDefs);
    }
  }
}

function containsYield(stmts: PyNode[]): boolean {
  let found = false;
  walkAny(stmts, (n) => {
    if (n._type === "Yield" || n._type === "YieldFrom") found = true;
  }, true);
  return found;
}

function collectNamesFromTarget(target: PyNode, names: Set<string>): void {
  if (target._type === "Name") {
    names.add(sanitizeId(target.id as string));
  } else if (target._type === "Tuple" || target._type === "List") {
    for (const e of target.elts as PyNode[]) collectNamesFromTarget(e, names);
  }
}

/**
 * Python scoping is function-wide: a name first assigned inside a nested
 * `if`/`while`/`for` block is still visible after that block ends. JS `let`
 * is block-scoped, so a name declared with `let` *inside* a nested `{ }`
 * would disappear once that block closes. To match Python's semantics we
 * hoist every name this scope assigns to a single `let` line at the top of
 * the function/module, then every actual assignment becomes a plain `=`.
 */
function collectAssignedNames(stmts: PyNode[]): string[] {
  const names = new Set<string>();
  walkAny(
    stmts,
    (n) => {
      if (n._type === "Assign") {
        collectNamesFromTarget((n.targets as PyNode[])[0], names);
      } else if (n._type === "AugAssign") {
        collectNamesFromTarget(n.target as PyNode, names);
      }
    },
    true,
  );
  return [...names];
}

function collectSelfAssignedAttrs(classBody: PyNode[]): string[] {
  const attrs = new Set<string>();
  walkAny(classBody, (n) => {
    if (
      n._type === "Attribute" &&
      (n.ctx as PyNode | undefined)?._type === "Store" &&
      (n.value as PyNode | undefined)?._type === "Name" &&
      (n.value as PyNode).id === "self"
    ) {
      attrs.add(n.attr as string);
    }
  }, false);
  return [...attrs];
}

// ---------------------------------------------------------------------------
// Function/class signature table (for resolving keyword arguments at call sites)
// ---------------------------------------------------------------------------

interface ParamSig {
  name: string;
  defaultExpr: PyNode | null;
}

interface EmitCtx {
  classNames: Set<string>;
  funcTable: Map<string, ParamSig[]>;
  declared: Set<string>;
  /** Set while emitting a class's method bodies, so `self.<staticMethod>(...)` can be
   *  qualified as `ClassName.<staticMethod>(...)` -- static members aren't reachable via
   *  `this` in JS/TS the way Python allows via `self`. */
  currentClass?: { name: string; staticMethods: Set<string> };
}

/** Resolve a `<receiver>.<attr>` access, redirecting `this.<attr>` to `ClassName.<attr>`
 *  when `<attr>` is a static method of the class currently being emitted. */
function qualifyReceiver(receiver: PyNode, attr: string, ctx: EmitCtx): string {
  const base = emitExpr(receiver, ctx);
  if (base === "this" && ctx.currentClass?.staticMethods.has(attr)) {
    return ctx.currentClass.name;
  }
  return base;
}

function paramSigsFromArguments(argsNode: PyNode, skipFirst: boolean): ParamSig[] {
  const args = (argsNode.args as PyNode[]) ?? [];
  const defaults = (argsNode.defaults as PyNode[]) ?? [];
  const offset = args.length - defaults.length;
  const start = skipFirst ? 1 : 0;
  const sigs: ParamSig[] = [];
  for (let i = start; i < args.length; i++) {
    const defIdx = i - offset;
    sigs.push({ name: args[i].arg as string, defaultExpr: defIdx >= 0 ? defaults[defIdx] : null });
  }
  return sigs;
}

function collectSignatures(body: PyNode[]): Map<string, ParamSig[]> {
  const table = new Map<string, ParamSig[]>();
  for (const node of body) {
    if (node._type === "FunctionDef") {
      table.set(node.name as string, paramSigsFromArguments(node.args as PyNode, false));
    } else if (node._type === "ClassDef") {
      const init = (node.body as PyNode[]).find((m) => m._type === "FunctionDef" && m.name === "__init__");
      if (init) table.set(node.name as string, paramSigsFromArguments(init.args as PyNode, true));
    }
  }
  return table;
}

function collectClassNames(body: PyNode[]): Set<string> {
  return new Set(body.filter((n) => n._type === "ClassDef").map((n) => n.name as string));
}

// ---------------------------------------------------------------------------
// Expressions
// ---------------------------------------------------------------------------

const BINOP: Record<string, string> = { Add: "+", Sub: "-", Mult: "*", Div: "/" };
const CMPOP: Record<string, string> = { Gt: ">", GtE: ">=", Lt: "<", LtE: "<=", NotEq: "!==", Eq: "===", Is: "===", IsNot: "!==" };

function emitExpr(node: PyNode | null | undefined, ctx: EmitCtx): string {
  if (!node) return "undefined";
  switch (node._type) {
    case "Constant": {
      const value = node.value as string | number | boolean | null;
      if (value === null) return "null";
      if (typeof value === "string") return JSON.stringify(value);
      return String(value);
    }
    case "Name": {
      const id = node.id as string;
      return id === "self" ? "this" : sanitizeId(id);
    }
    case "Attribute":
      return `${qualifyReceiver(node.value as PyNode, node.attr as string, ctx)}.${node.attr as string}`;
    case "Subscript":
      return `${emitExpr(node.value as PyNode, ctx)}.at(${emitExpr(node.slice as PyNode, ctx)})`;
    case "Tuple":
    case "List":
      return `[${(node.elts as PyNode[]).map((e) => emitExpr(e, ctx)).join(", ")}]`;
    case "UnaryOp": {
      const operand = emitExpr(node.operand as PyNode, ctx);
      const op = (node.op as PyNode)._type;
      if (op === "USub") return `(-${operand})`;
      if (op === "Not") return `(!${operand})`;
      return operand;
    }
    case "BinOp": {
      const left = emitExpr(node.left as PyNode, ctx);
      const right = emitExpr(node.right as PyNode, ctx);
      const op = (node.op as PyNode)._type;
      if (op === "Pow") return `(${left} ** ${right})`;
      if (op === "Mod") return `pyMod(${left}, ${right})`;
      if (op === "FloorDiv") return `Math.floor(${left} / ${right})`;
      return `(${left} ${BINOP[op] ?? "+"} ${right})`;
    }
    case "BoolOp": {
      const op = (node.op as PyNode)._type === "And" ? "&&" : "||";
      return `(${(node.values as PyNode[]).map((v) => emitExpr(v, ctx)).join(` ${op} `)})`;
    }
    case "Compare": {
      const left = node.left as PyNode;
      const ops = node.ops as PyNode[];
      const comparators = node.comparators as PyNode[];
      const parts: string[] = [];
      let prev = left;
      for (let i = 0; i < ops.length; i++) {
        const opType = ops[i]._type;
        const right = comparators[i];
        if (opType === "In" || opType === "NotIn") {
          const negate = opType === "NotIn" ? "!" : "";
          if (right._type === "Call" && (right.func as PyNode)._type === "Name" && (right.func as PyNode).id === "dir") {
            const target = (right.args as PyNode[])[0];
            parts.push(`${negate}pyHasAttr(${emitExpr(target, ctx)}, ${emitExpr(prev, ctx)})`);
          } else {
            parts.push(`${negate}${emitExpr(right, ctx)}.includes(${emitExpr(prev, ctx)})`);
          }
        } else {
          parts.push(`(${emitExpr(prev, ctx)} ${CMPOP[opType] ?? "==="} ${emitExpr(right, ctx)})`);
        }
        prev = right;
      }
      return parts.length === 1 ? parts[0] : `(${parts.join(" && ")})`;
    }
    case "IfExp":
      return `(${emitExpr(node.test as PyNode, ctx)} ? ${emitExpr(node.body as PyNode, ctx)} : ${emitExpr(
        node.orelse as PyNode,
        ctx,
      )})`;
    case "Lambda": {
      const params = ((node.args as PyNode).args as PyNode[]).map((a) => sanitizeId(a.arg as string)).join(", ");
      return `((${params}) => ${emitExpr(node.body as PyNode, ctx)})`;
    }
    case "Yield":
      return node.value ? `yield ${emitExpr(node.value as PyNode, ctx)}` : "yield undefined";
    case "ListComp":
      return emitListComp(node, ctx);
    case "Call":
      return emitCall(node, ctx);
    default:
      return `undefined /* unsupported expr: ${node._type} */`;
  }
}

function emitComprehensionTarget(target: PyNode): string {
  if (target._type === "Tuple" || target._type === "List") {
    return `[${(target.elts as PyNode[]).map((e) => sanitizeId(e.id as string)).join(", ")}]`;
  }
  return sanitizeId(target.id as string);
}

function emitListComp(node: PyNode, ctx: EmitCtx): string {
  const generators = node.generators as PyNode[];
  const gen = generators[0]; // only single-generator comprehensions appear in source
  const target = emitComprehensionTarget(gen.target as PyNode);
  const iter = emitExpr(gen.iter as PyNode, ctx);
  const ifs = (gen.ifs as PyNode[]) ?? [];
  const elt = emitExpr(node.elt as PyNode, ctx);
  let expr = iter;
  if (ifs.length > 0) {
    expr = `${expr}.filter((${target}) => ${ifs.map((i) => emitExpr(i, ctx)).join(" && ")})`;
  }
  return `${expr}.map((${target}) => ${elt})`;
}

function emitCall(node: PyNode, ctx: EmitCtx): string {
  const func = node.func as PyNode;
  const args = (node.args as PyNode[]) ?? [];
  const keywords = (node.keywords as PyNode[]) ?? [];

  if (func._type === "Name") {
    const name = func.id as string;
    switch (name) {
      case "len":
        return `${emitExpr(args[0], ctx)}.length`;
      case "min":
        return `Math.min(${args.map((a) => emitExpr(a, ctx)).join(", ")})`;
      case "max":
        return `Math.max(${args.map((a) => emitExpr(a, ctx)).join(", ")})`;
      case "abs":
        return `Math.abs(${emitExpr(args[0], ctx)})`;
      case "any":
        return `${emitExpr(args[0], ctx)}.some(Boolean)`;
      case "all":
        return `${emitExpr(args[0], ctx)}.every(Boolean)`;
      case "int":
        return `Math.trunc(${emitExpr(args[0], ctx)})`;
      case "str":
        return `String(${emitExpr(args[0], ctx)})`;
      case "range":
        return `pyRange(${args.map((a) => emitExpr(a, ctx)).join(", ")})`;
      case "zip":
        return `zipArrays(${args.map((a) => emitExpr(a, ctx)).join(", ")})`;
      case "dir":
        return `[] /* dir(${emitExpr(args[0], ctx)}) has no TS equivalent */`;
      case "next":
        // Python's next(generator) -> JS generator.next().value
        return `${emitExpr(args[0], ctx)}.next().value`;
      default: {
        const callee = sanitizeId(name);
        const argsText =
          keywords.length > 0 ? resolveKeywordArgs(name, args, keywords, ctx) : args.map((a) => emitExpr(a, ctx)).join(", ");
        return ctx.classNames.has(name) ? `new ${callee}(${argsText})` : `${callee}(${argsText})`;
      }
    }
  }

  if (func._type === "Attribute") {
    const attr = func.attr as string;
    const receiver = func.value as PyNode;

    if (attr === "sort" && keywords.some((k) => k.arg === "key")) {
      const keyNode = keywords.find((k) => k.arg === "key")!.value as PyNode;
      const key = emitExpr(keyNode, ctx);
      const recv = emitExpr(receiver, ctx);
      return `${recv}.sort((a, b) => (${key})(a) - (${key})(b))`;
    }
    if (attr === "pop") {
      const recv = emitExpr(receiver, ctx);
      if (args.length === 0) return `${recv}.pop()`;
      const idx = emitExpr(args[0], ctx);
      return idx === "0" ? `${recv}.shift()` : `${recv}.splice(${idx}, 1)[0]`;
    }
    if (attr === "join") {
      // Python: "sep".join(iterable) -> JS: iterable.join(sep)
      const sep = emitExpr(receiver, ctx);
      const iterable = emitExpr(args[0], ctx);
      return `${iterable}.join(${sep})`;
    }
    if (attr === "append") {
      return `${emitExpr(receiver, ctx)}.push(${args.map((a) => emitExpr(a, ctx)).join(", ")})`;
    }

    const argsText = args.map((a) => emitExpr(a, ctx)).join(", ");
    return `${qualifyReceiver(receiver, attr, ctx)}.${attr}(${argsText})`;
  }

  return `${emitExpr(func, ctx)}(${args.map((a) => emitExpr(a, ctx)).join(", ")})`;
}

function resolveKeywordArgs(funcName: string, args: PyNode[], keywords: PyNode[], ctx: EmitCtx): string {
  const sig = ctx.funcTable.get(funcName);
  if (!sig) {
    return [...args.map((a) => emitExpr(a, ctx)), ...keywords.map((k) => emitExpr(k.value as PyNode, ctx))].join(", ");
  }
  const values: (string | undefined)[] = sig.map((_, i) => (i < args.length ? emitExpr(args[i], ctx) : undefined));
  for (const kw of keywords) {
    const idx = sig.findIndex((p) => p.name === kw.arg);
    if (idx >= 0) values[idx] = emitExpr(kw.value as PyNode, ctx);
  }
  return values.map((v, i) => v ?? (sig[i].defaultExpr ? emitExpr(sig[i].defaultExpr, ctx) : "undefined")).join(", ");
}

// ---------------------------------------------------------------------------
// Assignment targets
// ---------------------------------------------------------------------------

function renderTargetForRead(target: PyNode, ctx: EmitCtx): string {
  // Subscript store targets use plain bracket access, not `.at()`.
  if (target._type === "Subscript") {
    return `${emitExpr(target.value as PyNode, ctx)}[${emitExpr(target.slice as PyNode, ctx)}]`;
  }
  return emitExpr(target, ctx);
}

function emitAssign(node: PyNode, ctx: EmitCtx, depth: number): string[] {
  const target = (node.targets as PyNode[])[0];
  const valueExpr = emitExpr(node.value as PyNode, ctx);

  if (target._type === "Tuple" || target._type === "List") {
    const names = (target.elts as PyNode[]).map((e) => sanitizeId(e.id as string));
    const allDeclared = names.every((n) => ctx.declared.has(n));
    names.forEach((n) => ctx.declared.add(n));
    const prefix = allDeclared ? "" : "let ";
    return [`${ind(depth)}${prefix}[${names.join(", ")}] = ${valueExpr};`];
  }

  if (target._type === "Name") {
    const name = sanitizeId(target.id as string);
    const isNew = !ctx.declared.has(name);
    ctx.declared.add(name);
    return [`${ind(depth)}${isNew ? "let " : ""}${name} = ${valueExpr};`];
  }

  return [`${ind(depth)}${renderTargetForRead(target, ctx)} = ${valueExpr};`];
}

// ---------------------------------------------------------------------------
// Statements
// ---------------------------------------------------------------------------

function emitBlock(stmts: PyNode[], ctx: EmitCtx, depth: number): string[] {
  const out: string[] = [];
  for (const stmt of stmts) {
    out.push(...emitStmt(stmt, ctx, depth));
  }
  return out.length > 0 ? out : [`${ind(depth)}// (empty)`];
}

function forIterTarget(target: PyNode): string {
  if (target._type === "Tuple" || target._type === "List") {
    return `[${(target.elts as PyNode[]).map((e) => sanitizeId(e.id as string)).join(", ")}]`;
  }
  return sanitizeId(target.id as string);
}

function emitStmt(node: PyNode, ctx: EmitCtx, depth: number): string[] {
  switch (node._type) {
    case "Import":
    case "ImportFrom":
      return []; // provided by the fixed runtime shim import instead
    case "Expr": {
      const value = node.value as PyNode;
      if (value._type === "Constant" && typeof value.value === "string") {
        const text = (value.value as string).trim();
        if (text.includes("\n")) {
          return [`${ind(depth)}/**`, ...text.split("\n").map((l) => `${ind(depth)} * ${l.trim()}`), `${ind(depth)} */`];
        }
        return [`${ind(depth)}// ${text}`];
      }
      return [`${ind(depth)}${emitExpr(value, ctx)};`];
    }
    case "Assign":
      return emitAssign(node, ctx, depth);
    case "AugAssign": {
      const target = node.target as PyNode;
      const value = node.value as PyNode;
      const op = (node.op as PyNode)._type;
      const targetExpr = renderTargetForRead(target, ctx);
      if (op === "Add" && value._type === "List") {
        return [`${ind(depth)}${targetExpr}.push(${(value.elts as PyNode[]).map((e) => emitExpr(e, ctx)).join(", ")});`];
      }
      const symbol = BINOP[op] ?? "+";
      return [`${ind(depth)}${targetExpr} ${symbol}= ${emitExpr(value, ctx)};`];
    }
    case "Return":
      return [`${ind(depth)}return${node.value ? ` ${emitExpr(node.value as PyNode, ctx)}` : ""};`];
    case "Break":
      return [`${ind(depth)}break;`];
    case "Continue":
      return [`${ind(depth)}continue;`];
    case "Pass":
      return [];
    case "Raise": {
      const exc = node.exc as PyNode | undefined;
      const isSystemExit =
        !exc || (exc._type === "Name" && exc.id === "SystemExit") || (exc._type === "Call" && (exc.func as PyNode)?.id === "SystemExit");
      if (isSystemExit) return [`${ind(depth)}throw new PyProgramExit();`];
      return [`${ind(depth)}throw new Error(${emitExpr(exc, ctx)});`];
    }
    case "If": {
      const lines: string[] = [`${ind(depth)}if (${emitExpr(node.test as PyNode, ctx)}) {`];
      lines.push(...emitBlock(node.body as PyNode[], ctx, depth + 1));
      let orelse = node.orelse as PyNode[];
      while (orelse.length === 1 && orelse[0]._type === "If") {
        const elifNode = orelse[0];
        lines.push(`${ind(depth)}} else if (${emitExpr(elifNode.test as PyNode, ctx)}) {`);
        lines.push(...emitBlock(elifNode.body as PyNode[], ctx, depth + 1));
        orelse = elifNode.orelse as PyNode[];
      }
      if (orelse.length > 0) {
        lines.push(`${ind(depth)}} else {`);
        lines.push(...emitBlock(orelse, ctx, depth + 1));
      }
      lines.push(`${ind(depth)}}`);
      return lines;
    }
    case "While": {
      const lines: string[] = [`${ind(depth)}while (${emitExpr(node.test as PyNode, ctx)}) {`];
      lines.push(...emitBlock(node.body as PyNode[], ctx, depth + 1));
      lines.push(`${ind(depth)}}`);
      return lines;
    }
    case "For": {
      const iter = node.iter as PyNode;
      const target = node.target as PyNode;
      if (iter._type === "Call" && (iter.func as PyNode)._type === "Name" && (iter.func as PyNode).id === "range") {
        const rangeArgs = iter.args as PyNode[];
        const varName = forIterTarget(target);
        const stop = emitExpr(rangeArgs[rangeArgs.length - 1], ctx);
        const start = rangeArgs.length > 1 ? emitExpr(rangeArgs[0], ctx) : "0";
        const lines: string[] = [`${ind(depth)}for (let ${varName} = ${start}; ${varName} < ${stop}; ${varName}++) {`];
        lines.push(...emitBlock(node.body as PyNode[], ctx, depth + 1));
        lines.push(`${ind(depth)}}`);
        return lines;
      }
      const varName = forIterTarget(target);
      const lines: string[] = [`${ind(depth)}for (const ${varName} of ${emitExpr(iter, ctx)}) {`];
      lines.push(...emitBlock(node.body as PyNode[], ctx, depth + 1));
      lines.push(`${ind(depth)}}`);
      return lines;
    }
    case "FunctionDef":
      return emitFunctionDef(node, ctx, depth);
    case "ClassDef":
      return emitClassDef(node, ctx, depth);
    default:
      return [`${ind(depth)}// unsupported statement: ${node._type}`];
  }
}

function decoratorNames(node: PyNode): string[] {
  return ((node.decorator_list as PyNode[]) ?? []).map((d) => {
    if (d._type === "Name") return d.id as string;
    if (d._type === "Attribute") return d.attr as string; // e.g. `time.setter` -> "setter"
    return "";
  });
}

function buildParamList(argsNode: PyNode, ctx: EmitCtx, skipFirst: boolean): string {
  const args = (argsNode.args as PyNode[]) ?? [];
  const defaults = (argsNode.defaults as PyNode[]) ?? [];
  const offset = args.length - defaults.length;
  const start = skipFirst ? 1 : 0;
  const parts: string[] = [];
  for (let i = start; i < args.length; i++) {
    const name = sanitizeId(args[i].arg as string);
    const defIdx = i - offset;
    parts.push(defIdx >= 0 ? `${name}: any = ${emitExpr(defaults[defIdx], ctx)}` : `${name}: any`);
  }
  return parts.join(", ");
}

/** Seeds `ctx.declared` with every name this scope's body assigns, and returns the
 *  `let a, b, c;` hoist line to emit at the top of that scope (or null if none needed). */
function hoistedDeclLine(bodyStmts: PyNode[], ctx: EmitCtx, depth: number): string | null {
  const toHoist = collectAssignedNames(bodyStmts).filter((n) => !ctx.declared.has(n));
  toHoist.forEach((n) => ctx.declared.add(n));
  return toHoist.length > 0 ? `${ind(depth)}let ${toHoist.join(", ")};` : null;
}

function emitFunctionDef(node: PyNode, outerCtx: EmitCtx, depth: number): string[] {
  const name = sanitizeId(node.name as string);
  const bodyCtx: EmitCtx = { classNames: outerCtx.classNames, funcTable: outerCtx.funcTable, declared: new Set() };
  for (const a of (node.args as PyNode).args as PyNode[]) bodyCtx.declared.add(sanitizeId(a.arg as string));
  const params = buildParamList(node.args as PyNode, bodyCtx, false);
  const isGenerator = containsYield(node.body as PyNode[]);
  const hoist = hoistedDeclLine(node.body as PyNode[], bodyCtx, depth + 1);
  const lines: string[] = [`${ind(depth)}function${isGenerator ? "*" : ""} ${name}(${params}) {`];
  if (hoist) lines.push(hoist);
  lines.push(...emitBlock(node.body as PyNode[], bodyCtx, depth + 1));
  lines.push(`${ind(depth)}}`);
  return lines;
}

function emitClassDef(node: PyNode, ctx: EmitCtx, depth: number): string[] {
  const className = sanitizeId(node.name as string);
  const members = (node.body as PyNode[]).filter((m) => m._type === "FunctionDef") as PyNode[];
  const accessorNames = new Set(
    members
      .filter((m) => decoratorNames(m).includes("property") || decoratorNames(m).includes("setter"))
      .map((m) => m.name as string),
  );
  const fieldNames = collectSelfAssignedAttrs(node.body as PyNode[]).filter((n) => !accessorNames.has(n));
  const staticMethodNames = new Set(
    members.filter((m) => decoratorNames(m).includes("staticmethod")).map((m) => sanitizeId(m.name as string)),
  );
  const currentClass = { name: className, staticMethods: staticMethodNames };

  const lines: string[] = [`${ind(depth)}class ${className} {`];
  for (const field of fieldNames) {
    lines.push(`${ind(depth + 1)}${sanitizeId(field)}: any;`);
  }

  for (const member of members) {
    const decorators = decoratorNames(member);
    const isStatic = decorators.includes("staticmethod");
    const isGetter = decorators.includes("property");
    const isSetter = decorators.includes("setter");
    const skipFirst = !isStatic; // instance methods/accessors drop `self`

    const bodyCtx: EmitCtx = { classNames: ctx.classNames, funcTable: ctx.funcTable, declared: new Set(), currentClass };
    for (const a of ((member.args as PyNode).args as PyNode[]).slice(skipFirst ? 1 : 0)) {
      bodyCtx.declared.add(sanitizeId(a.arg as string));
    }
    const params = buildParamList(member.args as PyNode, bodyCtx, skipFirst);

    if (member.name === "__init__") {
      lines.push(`${ind(depth + 1)}constructor(${params}) {`);
    } else if (isGetter) {
      lines.push(`${ind(depth + 1)}get ${sanitizeId(member.name as string)}() {`);
    } else if (isSetter) {
      lines.push(`${ind(depth + 1)}set ${sanitizeId(member.name as string)}(${params}) {`);
    } else if (isStatic) {
      lines.push(`${ind(depth + 1)}static ${sanitizeId(member.name as string)}(${params}) {`);
    } else {
      lines.push(`${ind(depth + 1)}${sanitizeId(member.name as string)}(${params}) {`);
    }
    const hoist = hoistedDeclLine(member.body as PyNode[], bodyCtx, depth + 2);
    if (hoist) lines.push(hoist);
    lines.push(...emitBlock(member.body as PyNode[], bodyCtx, depth + 2));
    lines.push(`${ind(depth + 1)}}`);
  }

  lines.push(`${ind(depth)}}`);
  return lines;
}

// ---------------------------------------------------------------------------
// Module entry point
// ---------------------------------------------------------------------------

export function emitPythonModule(mod: PyNode, projectName: string): string {
  const body = mod.body as PyNode[];
  const ctx: EmitCtx = {
    classNames: collectClassNames(body),
    funcTable: collectSignatures(body),
    declared: new Set(),
  };

  const lines: string[] = [
    `// Auto-generated from "${projectName}" (LEGO Robot Inventor python-mode project).`,
    `// Source: .lms -> projectbody.json ("main"/"program" field), transpiled from MicroPython.`,
    `// Best-effort transpile: hub/utime/random are simulated stubs (see hubRuntime.ts), and this`,
    `// module runs its top-level control loop immediately on import, exactly like the original`,
    `// program does when flashed to a hub. Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.`,
    `import {`,
    `  createHub,`,
    `  createUtime,`,
    `  randrange,`,
    `  pyMod,`,
    `  pyHasAttr,`,
    `  zipArrays,`,
    `  pyRange,`,
    `  PyProgramExit,`,
    `} from "../../lib/lms/hubRuntime";`,
    ``,
    `const hub = createHub();`,
    `const utime = createUtime();`,
    ``,
  ];

  const hoist = hoistedDeclLine(body, ctx, 0);
  if (hoist) lines.push(hoist);
  lines.push(...emitBlock(body, ctx, 0));
  lines.push("");
  return lines.join("\n");
}
