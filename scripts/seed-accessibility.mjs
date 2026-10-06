// Imports the "Core Techniques" accessibility notes into the existing
// Accessibility topic. Safe to re-run.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import matter from "gray-matter";

const SRC_DIR =
  "/Users/harrisson/Downloads/Private & Shared/Core Techniques";
const TOPIC_DIR = path.join(
  "/Users/harrisson/Projects/k-garden",
  "topics",
  "accessibility",
);
const now = new Date().toISOString();

mkdirSync(TOPIC_DIR, { recursive: true });

// Converts Notion's `<aside>...</aside>` callout export into a markdown
// blockquote, since BlockNote's markdown importer doesn't know raw HTML.
function convertAsides(md) {
  return md.replace(/<aside>\n([\s\S]*?)\n<\/aside>/g, (_, inner) => {
    const lines = inner
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.map((l) => `> ${l}`).join("\n> \n");
  });
}

const NOTES = [
  {
    src: "The Big Concepts of Accessibility 2e9322eae518800cbcc2f839a924b36d.md",
    id: "big-concepts-of-accessibility",
    title: "The Big Concepts of Accessibility",
    type: "concept",
    order: 0,
    pinned: true,
  },
  {
    src: "Who is Accessibility For 2ef322eae51880aca688dadcd149829d.md",
    id: "who-is-accessibility-for",
    title: "Who is Accessibility For?",
    type: "concept",
    order: 1,
    pinned: true,
  },
  {
    src: "Key Concepts 32d322eae518808cbfc0d678de97e2b1.md",
    id: "key-concepts",
    title: "Key Concepts",
    type: "cheatsheet",
    order: 2,
    pinned: false,
  },
  {
    src: "Keyboard Accessibility 2f1322eae51880ad8084d276b9388961.md",
    id: "keyboard-accessibility",
    title: "Keyboard Accessibility",
    type: "concept",
    order: 3,
    pinned: false,
  },
  {
    src: "Testing with NVDA 318322eae51880b0b5fdfb15708aaa44.md",
    id: "testing-with-nvda",
    title: "Testing with NVDA",
    type: "cheatsheet",
    order: 4,
    pinned: false,
  },
];

for (const n of NOTES) {
  const raw = readFileSync(path.join(SRC_DIR, n.src), "utf-8");
  const content = convertAsides(raw);
  const front = {
    title: n.title,
    type: n.type,
    createdAt: now,
    updatedAt: now,
    tags: [],
    pinned: n.pinned,
    order: n.order,
    format: "markdown",
  };
  writeFileSync(
    path.join(TOPIC_DIR, `${n.id}.md`),
    matter.stringify(content, front),
  );
}

console.log(`[seed-accessibility] wrote ${NOTES.length} notes to topics/accessibility`);
