/**
 * Converts a LEGO Robot Inventor / SPIKE "word-blocks" project (the Scratch
 * 3.0-derived block graph stored in project.json inside a .lms/.sb3 file)
 * into readable TypeScript that calls into `RobotInventorRuntime`
 * (see runtime.ts).
 *
 * Block opcodes come from LEGO's own extensions — internally codenamed
 * "flipper" for the Robot Inventor / SPIKE Prime hub:
 *   flipperevents, flippermotor, flippermoremotor, flippermove,
 *   flipperdisplay, flippersound, flippermodelspecific,
 *   flippervirtualremote, flipperxboxgamepad
 * plus a handful of stock Scratch blocks (control_*, operator_*,
 * data_setvariableto, event_broadcast*).
 */

// ---------------------------------------------------------------------------
// Raw project.json shapes
// ---------------------------------------------------------------------------

/** `[inputType, blockId]` (shadow-only), `[inputType, [litType, value, id?]]` (literal),
 *  or `[inputType, blockId, shadowId]` (reporter block obscuring a shadow). */
type ScratchInputEntry = [number, string | [number, string, string?]] | [number, string, string];

export interface ScratchBlock {
  opcode: string;
  next: string | null;
  parent: string | null;
  inputs: Record<string, ScratchInputEntry>;
  fields: Record<string, [string, string | null]>;
  shadow: boolean;
  topLevel: boolean;
}

export interface ScratchTarget {
  isStage: boolean;
  name: string;
  blocks: Record<string, ScratchBlock | unknown>;
  variables?: Record<string, [string, unknown]>;
}

export interface ScratchProject {
  targets: ScratchTarget[];
  extensions: string[];
}

// ---------------------------------------------------------------------------
// Value resolution: turn a block's input/field into a TypeScript expression
// ---------------------------------------------------------------------------

type BlockMap = Record<string, ScratchBlock>;

function isBlock(b: unknown): b is ScratchBlock {
  return !!b && typeof b === "object" && "opcode" in (b as object);
}

function toTsLiteral(raw: string | number): string {
  if (typeof raw === "number") return String(raw);
  if (raw.trim() !== "" && !Number.isNaN(Number(raw))) return raw.trim();
  return JSON.stringify(raw);
}

/** Selector/menu "shadow" blocks whose sole job is to hold a chosen value in a field. */
function resolveShadowField(block: ScratchBlock): string {
  const [fieldName, fieldValue] = Object.entries(block.fields)[0] ?? [undefined, ["", null] as [string, null]];
  const raw = (fieldValue?.[0] as string | number | undefined) ?? "";
  void fieldName;

  if (typeof raw === "string" && raw.trim().startsWith("{")) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (typeof parsed.name === "string") return toTsLiteral(parsed.name); // sound ref
      if (typeof parsed.text === "string") return JSON.stringify(parsed.text); // remote button label, always a string
      return JSON.stringify(parsed);
    } catch {
      // fall through to raw string handling
    }
  }
  return toTsLiteral(raw);
}

function resolveExpr(entry: ScratchInputEntry | undefined, blocks: BlockMap): string {
  if (!entry) return "undefined";
  const second = entry[1];
  if (Array.isArray(second)) {
    // [litType, value, id?]. litType 12 is Scratch's shorthand for "this slot holds a
    // variable reporter" (embedded inline instead of a separate block reference).
    const [litType, value] = second;
    if (litType === 12) return `vars.${sanitizeIdentifier(String(value))}`;
    return toTsLiteral(value);
  }
  return resolveBlockExpr(second, blocks);
}

function resolveBlockExpr(blockId: string, blocks: BlockMap): string {
  const block = blocks[blockId];
  if (!block) return "undefined";

  switch (block.opcode) {
    case "operator_multiply":
      return `(${resolveExpr(block.inputs.NUM1, blocks)} * ${resolveExpr(block.inputs.NUM2, blocks)})`;
    case "operator_subtract":
      return `(${resolveExpr(block.inputs.NUM1, blocks)} - ${resolveExpr(block.inputs.NUM2, blocks)})`;
    case "operator_or":
      return `(${resolveExpr(block.inputs.OPERAND1, blocks)} || ${resolveExpr(block.inputs.OPERAND2, blocks)})`;
    case "flipperoperator_isInBetween":
      return `isInBetween(${resolveExpr(block.inputs.VALUE, blocks)}, ${resolveExpr(
        block.inputs.LOW,
        blocks,
      )}, ${resolveExpr(block.inputs.HIGH, blocks)})`;
    case "flipperxboxgamepad_gamepadAxis":
      return `robot.input.gamepadAxis(${toTsLiteral(fieldValue(block, "STICK") ?? "0")}, ${toTsLiteral(
        fieldValue(block, "OPTION") ?? "0",
      )})`;
    case "flipperxboxgamepad_gamepadButtonPressure":
      return `robot.input.gamepadButtonPressure(${toTsLiteral(fieldValue(block, "BUTTON") ?? "0")})`;
    case "flipperxboxgamepad_xboxDpadButtonIsPressed":
      return `robot.input.xboxDpadPressed(${toTsLiteral(fieldValue(block, "BUTTON") ?? "0")})`;
    case "flipperxboxgamepad_xboxGamepadButtonIsPressed":
      return `robot.input.xboxButtonPressed(${toTsLiteral(fieldValue(block, "BUTTON") ?? "0")})`;
    default:
      // Every LEGO selector/menu/dial widget (port picker, direction icon, angle dial,
      // rotation wheel, orientation menu, ...) is a shadow block holding its chosen
      // value in a single field -- detect that structurally rather than by opcode name.
      if (block.shadow) {
        return resolveShadowField(block);
      }
      return `undefined /* unsupported reporter: ${block.opcode} */`;
  }
}

function fieldValue(block: ScratchBlock, name: string): string | undefined {
  return block.fields[name]?.[0];
}

// ---------------------------------------------------------------------------
// Statement emission (recursive walk over the block linked-list/substacks)
// ---------------------------------------------------------------------------

const STACK_OPCODES = new Set([
  "control_forever",
  "control_if_else",
  "control_repeat",
  "control_wait",
  "control_wait_until",
  "data_setvariableto",
  "event_broadcast",
  "flippercontrol_stop",
  "flipperdisplay_ledAnimation",
  "flipperdisplay_ledRotateOrientation",
  "flipperdisplay_ultrasonicLightUp",
  "flippermodelspecific_dogBotSetSpeed",
  "flippermodelspecific_dogBotWalkForSeconds",
  "flippermoremotor_motorStartPower",
  "flippermotor_motorGoDirectionToPosition",
  "flippermotor_motorSetSpeed",
  "flippermotor_motorStartDirection",
  "flippermotor_motorStop",
  "flippermotor_motorTurnForDirection",
  "flippermove_move",
  "flippermove_movementSpeed",
  "flippermove_setMovementPair",
  "flippermove_startSteer",
  "flippermove_steer",
  "flippersound_playSoundUntilDone",
]);

function indentLines(lines: string[], indent: string): string[] {
  return lines.map((l) => (l.trim() === "" ? l : indent + l));
}

/** Walk a `next`-linked chain of stack blocks starting at `startId`, emitting one or more TS statements per block. */
function emitStack(startId: string | null, blocks: BlockMap): string[] {
  const out: string[] = [];
  let id = startId;
  while (id) {
    const block = blocks[id];
    if (!block) break;
    out.push(...emitOneStatement(block, blocks));
    id = block.next;
  }
  return out;
}

function emitOneStatement(block: ScratchBlock, blocks: BlockMap): string[] {
  const arg = (name: string) => resolveExpr(block.inputs[name], blocks);

  switch (block.opcode) {
    case "control_forever": {
      const body = emitStack(
        block.inputs.SUBSTACK && !Array.isArray(block.inputs.SUBSTACK[1]) ? (block.inputs.SUBSTACK[1] as string) : null,
        blocks,
      );
      return [`while (true) {`, ...indentLines(body.length ? body : ["// (empty)"], "  "), `}`];
    }
    case "control_if_else": {
      const condition = arg("CONDITION");
      const thenBody = emitStack(
        block.inputs.SUBSTACK && !Array.isArray(block.inputs.SUBSTACK[1]) ? (block.inputs.SUBSTACK[1] as string) : null,
        blocks,
      );
      const elseBody = emitStack(
        block.inputs.SUBSTACK2 && !Array.isArray(block.inputs.SUBSTACK2[1]) ? (block.inputs.SUBSTACK2[1] as string) : null,
        blocks,
      );
      return [
        `if (${condition}) {`,
        ...indentLines(thenBody.length ? thenBody : ["// (empty)"], "  "),
        `} else {`,
        ...indentLines(elseBody.length ? elseBody : ["// (empty)"], "  "),
        `}`,
      ];
    }
    case "control_repeat": {
      const times = arg("TIMES");
      const body = emitStack(
        block.inputs.SUBSTACK && !Array.isArray(block.inputs.SUBSTACK[1]) ? (block.inputs.SUBSTACK[1] as string) : null,
        blocks,
      );
      return [`for (let i = 0; i < ${times}; i++) {`, ...indentLines(body.length ? body : ["// (empty)"], "  "), `}`];
    }
    case "control_wait":
      return [`await robot.control.wait(${arg("DURATION")} * 1000);`];
    case "control_wait_until":
      return [`await robot.control.waitUntil(() => ${arg("CONDITION")});`];
    case "data_setvariableto": {
      const varName = fieldValue(block, "VARIABLE") ?? "value";
      return [`vars.${sanitizeIdentifier(varName)} = ${arg("VALUE")};`];
    }
    case "event_broadcast":
      return [`await robot.events.broadcast(${arg("BROADCAST_INPUT")});`];
    case "flippercontrol_stop":
      return [`robot.control.stopProgram();`, `return;`];
    case "flipperdisplay_ledAnimation":
      return [`await robot.display.ledAnimation(${arg("MATRIX")});`];
    case "flipperdisplay_ledRotateOrientation":
      return [`await robot.display.ledRotateOrientation(${arg("ORIENTATION")});`];
    case "flipperdisplay_ultrasonicLightUp":
      return [`await robot.display.ultrasonicLightUp(${arg("PORT")}, ${arg("VALUE")});`];
    case "flippermodelspecific_dogBotSetSpeed":
      return [`await robot.modelSpecific.dogBotSetSpeed(${arg("SPEED")});`];
    case "flippermodelspecific_dogBotWalkForSeconds": {
      const directionField = fieldValue(block, "DIRECTION");
      const directionExpr = directionField !== undefined ? toTsLiteral(directionField) : arg("DIRECTION");
      return [`await robot.modelSpecific.dogBotWalkForSeconds(${directionExpr}, ${arg("TIME")});`];
    }
    case "flippermoremotor_motorStartPower":
      return [`await robot.motor.startPower(${arg("PORT")}, ${arg("POWER")});`];
    case "flippermotor_motorGoDirectionToPosition": {
      const direction = fieldValue(block, "DIRECTION") ?? "shortest";
      return [`await robot.motor.goToPosition(${arg("PORT")}, ${arg("POSITION")}, ${toTsLiteral(direction)});`];
    }
    case "flippermotor_motorSetSpeed":
      return [`await robot.motor.setSpeed(${arg("PORT")}, ${arg("SPEED")});`];
    case "flippermotor_motorStartDirection":
      return [`await robot.motor.startDirection(${arg("PORT")}, ${arg("DIRECTION")});`];
    case "flippermotor_motorStop":
      return [`await robot.motor.stop(${arg("PORT")});`];
    case "flippermotor_motorTurnForDirection": {
      const unit = fieldValue(block, "UNIT") ?? "rotations";
      return [
        `await robot.motor.turnForDirection(${arg("PORT")}, ${arg("DIRECTION")}, ${arg("VALUE")}, ${toTsLiteral(unit)});`,
      ];
    }
    case "flippermove_move": {
      const unit = fieldValue(block, "UNIT") ?? "cm";
      return [`await robot.move.move(${arg("DIRECTION")}, ${arg("VALUE")}, ${toTsLiteral(unit)});`];
    }
    case "flippermove_movementSpeed":
      return [`await robot.move.setSpeed(${arg("SPEED")});`];
    case "flippermove_setMovementPair":
      return [`await robot.move.setPair(${arg("PAIR")});`];
    case "flippermove_startSteer":
      return [`await robot.move.startSteer(${arg("STEERING")});`];
    case "flippermove_steer": {
      const unit = fieldValue(block, "UNIT") ?? "rotations";
      return [`await robot.move.steer(${arg("STEERING")}, ${arg("VALUE")}, ${toTsLiteral(unit)});`];
    }
    case "flippersound_playSoundUntilDone":
      return [`await robot.sound.playUntilDone(${arg("SOUND")});`];
    default:
      return [`// unsupported block: ${block.opcode}`];
  }
}

function sanitizeIdentifier(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9_$]/g, "_");
  return /^[0-9]/.test(cleaned) ? `_${cleaned}` : cleaned || "_var";
}

// ---------------------------------------------------------------------------
// Script (hat block) discovery + top-level module emission
// ---------------------------------------------------------------------------

interface ScriptEntry {
  registration: string; // e.g. `robot.events.onProgramStart(async () => {`
  bodyStartId: string | null;
}

function findScripts(blocks: BlockMap): ScriptEntry[] {
  const scripts: ScriptEntry[] = [];
  for (const block of Object.values(blocks)) {
    if (!block.topLevel || block.shadow) continue;
    switch (block.opcode) {
      case "flipperevents_whenProgramStarts":
        scripts.push({ registration: "robot.events.onProgramStart(async () => {", bodyStartId: block.next });
        break;
      case "event_whenbroadcastreceived": {
        const message = fieldValue(block, "BROADCAST_OPTION") ?? "";
        scripts.push({
          registration: `robot.events.onBroadcastReceived(${toTsLiteral(message)}, async () => {`,
          bodyStartId: block.next,
        });
        break;
      }
      case "flippervirtualremote_remoteControlWhenButtonHat": {
        const action = (fieldValue(block, "ACTION") ?? "pressed") as "pressed" | "released";
        const widgetEntry = block.inputs.WIDGET;
        const label =
          widgetEntry && !Array.isArray(widgetEntry[1]) ? resolveBlockExpr(widgetEntry[1] as string, blocks) : '""';
        scripts.push({
          registration: `robot.events.onRemoteButton(${label}, ${toTsLiteral(action)}, async () => {`,
          bodyStartId: block.next,
        });
        break;
      }
      case "flipperxboxgamepad_xboxJoystickWhenButton": {
        const stick = fieldValue(block, "STICK") ?? "0";
        const option = fieldValue(block, "OPTION") ?? "";
        scripts.push({
          registration: `robot.events.onXboxJoystick(${stick}, ${toTsLiteral(option)}, async () => {`,
          bodyStartId: block.next,
        });
        break;
      }
      default:
        break;
    }
  }
  return scripts;
}

function collectVariableNames(blocks: BlockMap): string[] {
  const names = new Set<string>();
  for (const block of Object.values(blocks)) {
    if (block.opcode === "data_setvariableto") {
      const name = fieldValue(block, "VARIABLE");
      if (name) names.add(sanitizeIdentifier(name));
    }
  }
  return [...names];
}

export interface ConvertedTarget {
  name: string;
  code: string;
}

/** Convert one non-stage Scratch target (the robot model/sprite) into a TypeScript module. */
function convertTarget(target: ScratchTarget, projectName: string): ConvertedTarget | null {
  const blocks: BlockMap = {};
  for (const [id, raw] of Object.entries(target.blocks)) {
    if (isBlock(raw)) blocks[id] = raw;
  }

  const scripts = findScripts(blocks);
  if (scripts.length === 0) return null;

  const variableNames = collectVariableNames(blocks);
  const lines: string[] = [];

  lines.push(`// Auto-generated from "${projectName}" (LEGO Robot Inventor word-blocks project).`);
  lines.push(`// Source: .lms -> scratch.sb3 -> project.json, target "${target.name}".`);
  lines.push(`// Do not hand-edit; regenerate via scripts/convert-lms-samples.ts.`);
  lines.push(`import { isInBetween, type RobotInventorRuntime } from "../../lib/lms/runtime";`);
  lines.push("");
  lines.push(`export function registerProgram(robot: RobotInventorRuntime): void {`);
  if (variableNames.length > 0) {
    lines.push(`  const vars: Record<string, any> = {`);
    for (const v of variableNames) lines.push(`    ${v}: 0,`);
    lines.push(`  };`);
  }

  for (const script of scripts) {
    const body = emitStack(script.bodyStartId, blocks);
    lines.push(`  ${script.registration}`);
    lines.push(...indentLines(body.length ? body : ["// (empty)"], "    "));
    lines.push(`  });`);
  }

  lines.push(`}`);
  lines.push("");

  return { name: target.name, code: lines.join("\n") };
}

export function convertScratchProject(project: ScratchProject, projectName: string): ConvertedTarget[] {
  const results: ConvertedTarget[] = [];
  for (const target of project.targets) {
    if (target.isStage) continue;
    const converted = convertTarget(target, projectName);
    if (converted) results.push(converted);
  }
  return results;
}
