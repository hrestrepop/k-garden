/* Generate by @shikijs/codegen */
import type {
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
  HighlighterGeneric,
} from '@shikijs/types'
import {
  createBundledHighlighter,
  createSingletonShorthands,
} from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'

type BundledLanguage =
  | 'javascript'
  | 'js'
  | 'cjs'
  | 'mjs'
  | 'jsx'
  | 'typescript'
  | 'ts'
  | 'cts'
  | 'mts'
  | 'tsx'
  | 'python'
  | 'py'
  | 'shellscript'
  | 'bash'
  | 'sh'
  | 'shell'
  | 'zsh'
  | 'json'
  | 'java'
  | 'kotlin'
  | 'kt'
  | 'kts'
  | 'sql'
  | 'yaml'
  | 'yml'
  | 'toml'
  | 'markdown'
  | 'md'
  | 'latex'
  | 'tex'
  | 'r'
  | 'julia'
  | 'jl'
  | 'dockerfile'
  | 'docker'
  | 'go'
  | 'rust'
  | 'rs'
  | 'c'
  | 'cpp'
  | 'html'
  | 'css'
  | 'diff'
  | 'ini'
  | 'csv'
  | 'matlab'
type BundledTheme = 'github-light' | 'github-dark'
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

const bundledLanguages = {
  javascript: () => import('@shikijs/langs-precompiled/javascript'),
  js: () => import('@shikijs/langs-precompiled/javascript'),
  cjs: () => import('@shikijs/langs-precompiled/javascript'),
  mjs: () => import('@shikijs/langs-precompiled/javascript'),
  jsx: () => import('@shikijs/langs-precompiled/jsx'),
  typescript: () => import('@shikijs/langs-precompiled/typescript'),
  ts: () => import('@shikijs/langs-precompiled/typescript'),
  cts: () => import('@shikijs/langs-precompiled/typescript'),
  mts: () => import('@shikijs/langs-precompiled/typescript'),
  tsx: () => import('@shikijs/langs-precompiled/tsx'),
  python: () => import('@shikijs/langs-precompiled/python'),
  py: () => import('@shikijs/langs-precompiled/python'),
  shellscript: () => import('@shikijs/langs-precompiled/shellscript'),
  bash: () => import('@shikijs/langs-precompiled/shellscript'),
  sh: () => import('@shikijs/langs-precompiled/shellscript'),
  shell: () => import('@shikijs/langs-precompiled/shellscript'),
  zsh: () => import('@shikijs/langs-precompiled/shellscript'),
  json: () => import('@shikijs/langs-precompiled/json'),
  java: () => import('@shikijs/langs-precompiled/java'),
  kotlin: () => import('@shikijs/langs-precompiled/kotlin'),
  kt: () => import('@shikijs/langs-precompiled/kotlin'),
  kts: () => import('@shikijs/langs-precompiled/kotlin'),
  sql: () => import('@shikijs/langs-precompiled/sql'),
  yaml: () => import('@shikijs/langs-precompiled/yaml'),
  yml: () => import('@shikijs/langs-precompiled/yaml'),
  toml: () => import('@shikijs/langs-precompiled/toml'),
  markdown: () => import('@shikijs/langs-precompiled/markdown'),
  md: () => import('@shikijs/langs-precompiled/markdown'),
  latex: () => import('@shikijs/langs-precompiled/latex'),
  tex: () => import('@shikijs/langs-precompiled/tex'),
  r: () => import('@shikijs/langs-precompiled/r'),
  julia: () => import('@shikijs/langs-precompiled/julia'),
  jl: () => import('@shikijs/langs-precompiled/julia'),
  dockerfile: () => import('@shikijs/langs-precompiled/dockerfile'),
  docker: () => import('@shikijs/langs-precompiled/docker'),
  go: () => import('@shikijs/langs-precompiled/go'),
  rust: () => import('@shikijs/langs-precompiled/rust'),
  rs: () => import('@shikijs/langs-precompiled/rust'),
  c: () => import('@shikijs/langs-precompiled/c'),
  cpp: () => import('@shikijs/langs-precompiled/cpp'),
  html: () => import('@shikijs/langs-precompiled/html'),
  css: () => import('@shikijs/langs-precompiled/css'),
  diff: () => import('@shikijs/langs-precompiled/diff'),
  ini: () => import('@shikijs/langs-precompiled/ini'),
  csv: () => import('@shikijs/langs-precompiled/csv'),
  matlab: () => import('@shikijs/langs-precompiled/matlab'),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>

const bundledThemes = {
  'github-light': () => import('@shikijs/themes/github-light'),
  'github-dark': () => import('@shikijs/themes/github-dark'),
} as Record<BundledTheme, DynamicImportThemeRegistration>

const createHighlighter = /* @__PURE__ */ createBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine(),
})

const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(
  createHighlighter,
)

export {
  bundledLanguages,
  bundledThemes,
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  createHighlighter,
  getLastGrammarState,
  getSingletonHighlighter,
}
export type { BundledLanguage, BundledTheme, Highlighter }
