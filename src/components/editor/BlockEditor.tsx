"use client";

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import {
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  BlockNoteSchema,
  createCodeBlockSpec,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
} from "@blocknote/core";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import { codeBlockOptions } from "@blocknote/code-block";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useColorMode } from "@/components/ui/color-mode";
import { createHighlighter } from "@/shiki.bundle";
import {
  mathBlockSpec,
  mathInlineSpec,
  pythonCellSpec,
  getCustomSlashMenuItems,
} from "./custom-blocks";

interface Props {
  initialContent?: string;
  initialFormat?: "blocknote" | "markdown";
  onSave?: (content: string) => void;
  editable?: boolean;
}

export interface BlockEditorHandle {
  exportMarkdown: () => string;
  exportText: () => string;
}

const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    codeBlock: createCodeBlockSpec({
      ...codeBlockOptions,
      indentLineWithTab: true,
      defaultLanguage: "python",
      supportedLanguages: {
        python: { name: "Python", aliases: ["py"] },
        javascript: { name: "JavaScript", aliases: ["js", "jsx"] },
        typescript: { name: "TypeScript", aliases: ["ts", "tsx"] },
        bash: { name: "Bash", aliases: ["sh", "shell", "zsh"] },
        json: { name: "JSON" },
        yaml: { name: "YAML", aliases: ["yml"] },
        toml: { name: "TOML" },
        markdown: { name: "Markdown", aliases: ["md"] },
        latex: { name: "LaTeX", aliases: ["tex"] },
        r: { name: "R" },
        julia: { name: "Julia", aliases: ["jl"] },
        sql: { name: "SQL" },
        dockerfile: { name: "Dockerfile", aliases: ["docker"] },
        go: { name: "Go" },
        rust: { name: "Rust", aliases: ["rs"] },
        c: { name: "C" },
        cpp: { name: "C++" },
        java: { name: "Java" },
        html: { name: "HTML" },
        css: { name: "CSS" },
        diff: { name: "Diff" },
        ini: { name: "INI" },
        csv: { name: "CSV" },
        matlab: { name: "MATLAB" },
      },
      createHighlighter: () =>
        createHighlighter({
          themes: ["github-light", "github-dark"],
          langs: [],
        }),
    }),
    mathBlock: mathBlockSpec(),
    pythonCell: pythonCellSpec(),
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mathInline: mathInlineSpec,
  },
});

const BlockEditor = forwardRef<BlockEditorHandle, Props>(function BlockEditor({
  initialContent,
  initialFormat = "markdown",
  onSave,
  editable = true,
}: Props, ref: React.Ref<BlockEditorHandle>) {
  const { colorMode } = useColorMode();
  const hasLoaded = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useCreateBlockNote({
    schema,
    uploadFile: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/files", { method: "POST", body: fd });
      const data = await res.json();
      return data.url;
    },
  });

  useEffect(() => {
    if (!editor || hasLoaded.current) return;
    hasLoaded.current = true;
    (async () => {
      if (!initialContent?.trim()) return;
      if (initialFormat === "blocknote") {
        let blocks: unknown;
        try {
          blocks = JSON.parse(initialContent);
        } catch {
          // format tag says blocknote but content is markdown — fall through
          blocks = undefined;
        }
        if (blocks !== undefined) {
          // Not wrapped in try/catch: a malformed block here is a real bug
          // (e.g. an invalid seed document) and should surface in the
          // console, not be silently swallowed and misinterpreted as
          // "actually markdown".
          editor.replaceBlocks(editor.document, blocks as never);
          return;
        }
      }
      try {
        const blocks = await editor.tryParseMarkdownToBlocks(initialContent);
        editor.replaceBlocks(editor.document, blocks);
      } catch (e) {
        console.error("BlockNote parse error:", e);
      }
    })();
  }, [initialContent, initialFormat, editor]);

  const absolutify = (md: string) =>
    md.replace(/\]\((\/[^)]+)\)/g, `](${window.location.origin}$1)`);

  useImperativeHandle(ref, () => ({
    exportMarkdown: () => absolutify(editor.blocksToMarkdownLossy(editor.document)),
    exportText: () => {
      const md = absolutify(editor.blocksToMarkdownLossy(editor.document));
      return md.replace(/[#*`_~\[\]>-]/g, "").replace(/\n{3,}/g, "\n\n").trim();
    },
  }));

  const handleChange = useCallback(() => {
    if (!onSave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSave(JSON.stringify(editor.document));
    }, 1500);
  }, [editor, onSave]);

  return (
    <div ref={containerRef} style={{ flex: 1, overflow: "auto" }}>
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={handleChange}
        theme={colorMode}
        slashMenu={false}
      >
        <SuggestionMenuController
          triggerCharacter="/"
          getItems={async (query) =>
            filterSuggestionItems(
              [...getDefaultReactSlashMenuItems(editor), ...getCustomSlashMenuItems(editor)],
              query,
            )
          }
        />
      </BlockNoteView>
    </div>
  );
});

export default BlockEditor;
