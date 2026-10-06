// Copies the runtime assets pyodide needs (wasm binary, stdlib zip, loader)
// out of node_modules into public/pyodide so they can be served statically
// and fetched client-side via loadPyodide({ indexURL: "/pyodide/" }).
import { existsSync, mkdirSync, copyFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FILES = [
  "pyodide.mjs",
  "pyodide.mjs.map",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "pyodide-lock.json",
  "python_stdlib.zip",
];

function main() {
  let pyodidePkgDir;
  try {
    pyodidePkgDir = path.dirname(require.resolve("pyodide/package.json"));
  } catch {
    console.warn("[copy-pyodide] pyodide package not found, skipping.");
    return;
  }

  const destDir = path.join(__dirname, "..", "public", "pyodide");
  mkdirSync(destDir, { recursive: true });

  for (const file of FILES) {
    const src = path.join(pyodidePkgDir, file);
    if (!existsSync(src)) {
      console.warn(`[copy-pyodide] missing ${file}, skipping.`);
      continue;
    }
    copyFileSync(src, path.join(destDir, file));
  }

  console.log(`[copy-pyodide] synced runtime assets to public/pyodide`);
}

main();
