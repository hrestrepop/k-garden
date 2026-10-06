"use client";

/* eslint-disable react-hooks/rules-of-hooks -- each `render` function below is
   a component per BlockNote's createReactBlockSpec/createReactInlineContentSpec
   API; the property name "render" just defeats eslint's PascalCase/"use"
   naming heuristic for recognizing components and hooks. */

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Play, Loader2, Sigma } from "lucide-react";
import { createReactBlockSpec, createReactInlineContentSpec } from "@blocknote/react";
import { insertOrUpdateBlockForSlashMenu } from "@blocknote/core/extensions";
import type {
  BlockNoteEditor,
  BlockSchema,
  InlineContentSchema,
  StyleSchema,
} from "@blocknote/core";
import { runPython } from "@/lib/pyodide-runtime";
import { codeToHtml } from "@/shiki.bundle";
import { useColorMode } from "@/components/ui/color-mode";

// ---------------------------------------------------------------------------
// Small syntax-highlighted code editor (textarea + Shiki overlay)
// ---------------------------------------------------------------------------

function HighlightedCodeEditor({
  code,
  onChange,
  readOnly,
  lang,
}: {
  code: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  lang: string;
}) {
  const { colorMode } = useColorMode();
  const [html, setHtml] = useState("");
  const preRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code.length ? code : " ", {
      lang,
      theme: colorMode === "dark" ? "github-dark" : "github-light",
    }).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [code, colorMode, lang]);

  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  return (
    <div className="kg-code-editor">
      <div
        ref={preRef}
        className="kg-code-editor-highlight"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <textarea
        ref={taRef}
        className="kg-code-editor-input"
        rows={Math.max(3, code.split("\n").length)}
        value={code}
        spellCheck={false}
        readOnly={readOnly}
        onScroll={syncScroll}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const el = e.currentTarget;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            onChange(code.slice(0, start) + "    " + code.slice(end));
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = start + 4;
            });
          }
        }}
      />
    </div>
  );
}

function renderLatex(src: string, displayMode: boolean): string {
  if (!src.trim()) return "";
  try {
    return katex.renderToString(src, {
      throwOnError: false,
      displayMode,
    });
  } catch {
    return "";
  }
}

// ---------------------------------------------------------------------------
// Math block (display equation)
// ---------------------------------------------------------------------------

export const mathBlockSpec = createReactBlockSpec(
  {
    type: "mathBlock",
    propSchema: {
      code: { default: "" },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const code = block.props.code;
      const html = useMemo(() => renderLatex(code, true), [code]);

      return (
        <div style={{ width: "100%" }} contentEditable={false}>
          <div className="kg-math-block">
            {html ? (
              <span dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <span
                style={{
                  color: "var(--pp-fg-muted)",
                  fontSize: 13,
                  fontStyle: "italic",
                }}
              >
                Empty equation
              </span>
            )}
          </div>
          {editor.isEditable && (
            <textarea
              className="kg-math-block-source"
              rows={2}
              placeholder="LaTeX, e.g. \tanh(w \cdot x + b)"
              defaultValue={code}
              onChange={(e) =>
                editor.updateBlock(block, {
                  props: { code: e.target.value },
                })
              }
            />
          )}
        </div>
      );
    },
  },
);

// ---------------------------------------------------------------------------
// Inline math ($...$-style)
// ---------------------------------------------------------------------------

export const mathInlineSpec = createReactInlineContentSpec(
  {
    type: "mathInline",
    propSchema: {
      code: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => {
      const { inlineContent, updateInlineContent, editor, contentRef } = props;
      const [editing, setEditing] = useState(!inlineContent.props.code);
      const code = inlineContent.props.code;
      const html = useMemo(() => renderLatex(code, false), [code]);

      return (
        <span ref={contentRef} className="kg-math-inline" contentEditable={false}>
          {editing && editor.isEditable ? (
            <input
              autoFocus
              defaultValue={code}
              className="kg-math-inline-placeholder"
              style={{ border: "none", outline: "none", minWidth: 40 }}
              onBlur={(e) => {
                updateInlineContent({
                  type: "mathInline",
                  props: { code: e.target.value },
                });
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          ) : (
            <span
              onClick={() => editor.isEditable && setEditing(true)}
              style={{ cursor: editor.isEditable ? "pointer" : "default" }}
            >
              {html ? (
                <span dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <span className="kg-math-inline-placeholder">
                  <Sigma size={11} style={{ display: "inline", verticalAlign: -1 }} />{" "}
                  math
                </span>
              )}
            </span>
          )}
        </span>
      );
    },
  },
);

// ---------------------------------------------------------------------------
// Python notebook cell (Pyodide)
// ---------------------------------------------------------------------------

export const pythonCellSpec = createReactBlockSpec(
  {
    type: "pythonCell",
    propSchema: {
      code: { default: "print('hello, k-garden!')" },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const [running, setRunning] = useState(false);
      const [output, setOutput] = useState<string | null>(null);
      const [error, setError] = useState<string | null>(null);

      const run = useCallback(async () => {
        setRunning(true);
        setError(null);
        try {
          const result = await runPython(block.props.code);
          setOutput(result.output);
          setError(result.error);
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e));
        } finally {
          setRunning(false);
        }
      }, [block.props.code]);

      return (
        <div className="kg-py-cell" style={{ width: "100%" }} contentEditable={false}>
          <div className="kg-py-cell-header">
            <span className="kg-py-cell-label">Python</span>
            <button
              className="kg-py-run-btn"
              disabled={running}
              onClick={run}
              type="button"
            >
              {running ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Play size={12} />
              )}
              {running ? "Running..." : "Run"}
            </button>
          </div>
          <HighlightedCodeEditor
            lang="python"
            code={block.props.code}
            readOnly={!editor.isEditable}
            onChange={(value) =>
              editor.updateBlock(block, { props: { code: value } })
            }
          />
          {(output !== null || error !== null) && (
            <div
              className={`kg-py-cell-output${error ? " kg-py-error" : ""}`}
            >
              {error || output || (
                <span className="kg-py-cell-output-empty">
                  (no output)
                </span>
              )}
            </div>
          )}
        </div>
      );
    },
  },
);

/* eslint-enable react-hooks/rules-of-hooks */

// ---------------------------------------------------------------------------
// Slash menu items
// ---------------------------------------------------------------------------

export function getCustomSlashMenuItems<
  BSchema extends BlockSchema,
  ISchema extends InlineContentSchema,
  SSchema extends StyleSchema,
>(editor: BlockNoteEditor<BSchema, ISchema, SSchema>) {
  return [
    {
      title: "Math Equation",
      subtext: "Display equation rendered with KaTeX",
      aliases: ["math", "equation", "latex", "katex"],
      group: "Knowledge",
      icon: <Sigma size={18} />,
      onItemClick: () => {
        insertOrUpdateBlockForSlashMenu(editor, {
          type: "mathBlock",
          props: { code: "" },
        } as never);
      },
    },
    {
      title: "Inline Math",
      subtext: "Insert an inline LaTeX expression",
      aliases: ["imath", "inline math"],
      group: "Knowledge",
      icon: <Sigma size={14} />,
      onItemClick: () => {
        editor.insertInlineContent([
          { type: "mathInline", props: { code: "" } } as never,
        ]);
      },
    },
    {
      title: "Python Cell",
      subtext: "Runnable Python cell (Pyodide, in-browser)",
      aliases: ["python", "code runner", "notebook", "pyodide"],
      group: "Knowledge",
      icon: <Play size={18} />,
      onItemClick: () => {
        insertOrUpdateBlockForSlashMenu(editor, {
          type: "pythonCell",
          props: { code: "print('hello, k-garden!')" },
        } as never);
      },
    },
  ];
}
