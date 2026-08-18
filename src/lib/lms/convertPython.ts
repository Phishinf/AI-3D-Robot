/**
 * Node-only bridge: shells out to `python3` to parse a "python mode" .lms
 * program's source into a JSON AST (via scripts/lib/py_ast_dump.py), then
 * hands that AST to pythonEmit.ts to produce TypeScript.
 *
 * This deliberately reuses Python's own parser instead of a hand-written
 * one in TypeScript. The tradeoff: this conversion path requires a `python3`
 * on PATH and only runs in Node (e.g. the local-agent / build tooling
 * described in architecture.md), not in-browser like the block-based
 * converter in scratchBlocks.ts.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { emitPythonModule, type PyNode } from "./pythonEmit";

function pyAstDumpScriptPath(): string {
  return fileURLToPath(new URL("../../../scripts/lib/py_ast_dump.py", import.meta.url));
}

function runPythonAstDump(source: string): Promise<PyNode> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", [pyAstDumpScriptPath()]);
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (chunk) => (stdout += chunk));
    proc.stderr.on("data", (chunk) => (stderr += chunk));
    proc.on("error", (err) => reject(new Error(`Failed to launch python3 (required to parse python-mode .lms files): ${err.message}`)));
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`py_ast_dump.py exited with code ${code}: ${stderr}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout) as PyNode);
      } catch (err) {
        reject(new Error(`Failed to parse AST JSON from py_ast_dump.py: ${(err as Error).message}`));
      }
    });
    proc.stdin.write(source);
    proc.stdin.end();
  });
}

export async function convertPythonSource(source: string, projectName: string): Promise<string> {
  const ast = await runPythonAstDump(source);
  return emitPythonModule(ast, projectName);
}
