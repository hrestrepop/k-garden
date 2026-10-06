"use client";

import type { PyodideInterface } from "pyodide";

let pyodidePromise: Promise<PyodideInterface> | null = null;

function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      // Loaded as a real native browser ES module from the static asset
      // copied to public/pyodide (see scripts/copy-pyodide.mjs), not through
      // webpack — pyodide.mjs does its own further dynamic imports (e.g. the
      // wasm binary) relative to its own URL, which only resolve correctly
      // when it runs unbundled. `webpackIgnore` keeps webpack from touching
      // this import (and the node:-scheme imports inside pyodide.mjs) at all.
      // A non-literal specifier keeps TS from trying (and failing) to
      // resolve this as a real module path — it's a runtime browser URL.
      const pyodideModuleUrl = "/pyodide/pyodide.mjs";
      const pyodideModule = (await import(
        /* webpackIgnore: true */ pyodideModuleUrl
      )) as unknown as {
        loadPyodide: (opts: { indexURL: string }) => Promise<PyodideInterface>;
      };
      return pyodideModule.loadPyodide({ indexURL: "/pyodide/" });
    })();
  }
  return pyodidePromise;
}

export interface PyRunResult {
  output: string;
  error: string | null;
}

export async function runPython(code: string): Promise<PyRunResult> {
  const pyodide = await getPyodide();

  let stdout = "";
  let stderr = "";
  pyodide.setStdout({ batched: (s: string) => (stdout += s + "\n") });
  pyodide.setStderr({ batched: (s: string) => (stderr += s + "\n") });

  try {
    try {
      // Best-effort: fetch any imported packages (numpy, etc.) from the
      // pyodide CDN. No-ops for stdlib-only code, and fails silently offline
      // — the subsequent run will surface a normal ImportError instead.
      await pyodide.loadPackagesFromImports(code);
    } catch {
      /* ignore — offline or package unavailable */
    }

    const result = await pyodide.runPythonAsync(code);
    let resultStr = "";
    if (result !== undefined) {
      try {
        resultStr =
          typeof (result as { toString?: () => string })?.toString ===
          "function"
            ? (result as { toString: () => string }).toString()
            : String(result);
      } finally {
        const maybeProxy = result as { destroy?: () => void };
        if (typeof maybeProxy?.destroy === "function") maybeProxy.destroy();
      }
    }

    const parts = [stdout.trim(), resultStr].filter(Boolean);
    return { output: parts.join("\n"), error: stderr.trim() || null };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    const parts = [stdout.trim()].filter(Boolean);
    return { output: parts.join("\n"), error: stderr.trim() || message };
  } finally {
    pyodide.setStdout({});
    pyodide.setStderr({});
  }
}
