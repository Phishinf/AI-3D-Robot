/**
 * Top-level entry point: convert a LEGO Robot Inventor / SPIKE .lms project
 * file into TypeScript.
 *
 * .lms is a ZIP container. Two project types show up in this repo:
 *  - "word-blocks": contains scratch.sb3 (itself a ZIP) with project.json,
 *    the Scratch 3.0-derived block graph. Pure TS/browser-safe — see
 *    scratchBlocks.ts.
 *  - "python": contains projectbody.json with the raw MicroPython source
 *    under a "main" or "program" key. Requires python3 on PATH — see
 *    convertPython.ts.
 */
import JSZip from "jszip";
import { convertScratchProject, type ConvertedTarget, type ScratchProject } from "./scratchBlocks";
import { convertPythonSource } from "./convertPython";

export interface LmsManifest {
  type: string;
  name?: string;
  extensions?: string[];
  [key: string]: unknown;
}

export type LmsConversionResult =
  | { format: "word-blocks"; manifest: LmsManifest; targets: ConvertedTarget[] }
  | { format: "python"; manifest: LmsManifest; code: string };

export async function convertLmsFile(data: ArrayBuffer | Uint8Array, projectName: string): Promise<LmsConversionResult> {
  const outer = await JSZip.loadAsync(data);

  const manifestFile = outer.file("manifest.json");
  if (!manifestFile) throw new Error(`"${projectName}" is not a valid .lms file (missing manifest.json)`);
  const manifest = JSON.parse(await manifestFile.async("text")) as LmsManifest;

  if (manifest.type === "word-blocks") {
    const sb3File = outer.file("scratch.sb3");
    if (!sb3File) throw new Error(`"${projectName}" is a word-blocks project but is missing scratch.sb3`);
    const inner = await JSZip.loadAsync(await sb3File.async("uint8array"));
    const projectFile = inner.file("project.json");
    if (!projectFile) throw new Error(`"${projectName}" scratch.sb3 is missing project.json`);
    const project = JSON.parse(await projectFile.async("text")) as ScratchProject;
    const targets = convertScratchProject(project, projectName);
    return { format: "word-blocks", manifest, targets };
  }

  if (manifest.type === "python") {
    const bodyFile = outer.file("projectbody.json");
    if (!bodyFile) throw new Error(`"${projectName}" is a python project but is missing projectbody.json`);
    const body = JSON.parse(await bodyFile.async("text")) as { main?: string; program?: string };
    const source = body.main ?? body.program ?? "";
    const code = await convertPythonSource(source, projectName);
    return { format: "python", manifest, code };
  }

  throw new Error(`"${projectName}" has unsupported manifest type "${manifest.type}"`);
}
