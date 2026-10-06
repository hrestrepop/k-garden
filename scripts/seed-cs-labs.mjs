// Seeds the "Algorithms & Data Structures" topic, imported and organized from
// a personal cs-labs practice repo. Safe to re-run — overwrites this topic
// only. Most note bodies are plain markdown drafted into scripts/cs-labs-notes/
// (see group-*.json manifests + <id>.md files); the math note is hand-authored
// here as BlockNote JSON so its formulas render as real KaTeX, like the
// AI/ML topic's math note.
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPICS_DIR = path.join(__dirname, "..", "topics");
const NOTES_DIR = path.join(__dirname, "cs-labs-notes");
const SLUG = "algorithms-data-structures";
const TOPIC_DIR = path.join(TOPICS_DIR, SLUG);

const now = new Date().toISOString();

const topic = {
  name: "Algorithms & Data Structures",
  slug: SLUG,
  description:
    "Classic algorithms, data structures from scratch, and JS language patterns — imported and cleaned up from years of coding-interview practice.",
  level: "comfortable",
  createdAt: now,
  updatedAt: now,
  tags: ["algorithms", "data-structures", "javascript", "interview-prep"],
  color: "#6366F1",
};

function text(t, styles = {}) {
  return { type: "text", text: t, styles };
}

function writeNote(id, { title, type, order = 0, pinned = false, format, content }) {
  const front = {
    title,
    type,
    createdAt: now,
    updatedAt: now,
    tags: [],
    pinned,
    order,
    format,
  };
  const body = format === "blocknote" ? JSON.stringify(content) : content;
  writeFileSync(path.join(TOPIC_DIR, `${id}.md`), matter.stringify(body, front));
}

mkdirSync(TOPIC_DIR, { recursive: true });
writeFileSync(path.join(TOPIC_DIR, "topic.json"), JSON.stringify(topic, null, 2));

// ---------------------------------------------------------------------------
// Math Foundations for Algorithms (math-notes, hand-authored w/ real mathBlocks)
// ---------------------------------------------------------------------------

writeNote("math-foundations-for-algorithms", {
  title: "Math Foundations for Algorithms",
  type: "math-notes",
  order: 2,
  format: "blocknote",
  content: [
    {
      type: "paragraph",
      content: [
        text(
          "The recurring math vocabulary behind algorithm analysis — primes, logs, combinatorics, and the one topic that was left mid-formula in the original notes (geometric progressions), finished properly below.",
        ),
      ],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("Prime Numbers")],
    },
    {
      type: "paragraph",
      content: [
        text(
          "A whole number that cannot be made by multiplying two smaller whole numbers. 2 is prime, 3 is prime, 4 is composite (2×2), 5 is prime, and so on. Primes up to 71:",
        ),
      ],
    },
    {
      type: "paragraph",
      content: [text("2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71")],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("Square & Square Root")],
    },
    {
      type: "paragraph",
      content: [text("The square of a number is that number times itself; the square root is the inverse operation.")],
    },
    { type: "mathBlock", props: { code: "n^2 = n \\times n \\qquad \\sqrt{n^2} = n" } },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("Logarithms")],
    },
    {
      type: "paragraph",
      content: [
        text(
          "A logarithm is the power a base must be raised to in order to get a given number. Base matters — base-10 and base-2 are the two you'll see constantly in algorithm analysis (binary search, balanced trees, divide-and-conquer):",
        ),
      ],
    },
    { type: "mathBlock", props: { code: "\\log_{10} 100 = 2 \\quad \\text{because} \\quad 10^2 = 100" } },
    { type: "mathBlock", props: { code: "\\log_{2} 8 = 3 \\quad \\text{because} \\quad 2^3 = 8" } },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("Combinations & Permutations")],
    },
    {
      type: "paragraph",
      content: [
        text(
          "When order matters, it's a permutation. When order doesn't matter, it's a combination — a permutation is just an ordered combination. n is the pool size, r is how many you're choosing.",
        ),
      ],
    },
    {
      type: "paragraph",
      content: [text("Permutation, with repetition:")],
    },
    { type: "mathBlock", props: { code: "n^r" } },
    {
      type: "paragraph",
      content: [text("Permutation, without repetition:")],
    },
    { type: "mathBlock", props: { code: "\\dfrac{n!}{(n-r)!}" } },
    {
      type: "paragraph",
      content: [text("Combination, with repetition:")],
    },
    { type: "mathBlock", props: { code: "\\dfrac{(r+n-1)!}{r! \\,(n-1)!}" } },
    {
      type: "paragraph",
      content: [text("Combination, without repetition:")],
    },
    { type: "mathBlock", props: { code: "\\dfrac{n!}{r! \\,(n-r)!}" } },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("Factorial")],
    },
    {
      type: "paragraph",
      content: [
        text(
          "Multiply a descending series of natural numbers. 4! = 4×3×2×1 = 24, 7! = 5,040, 1! = 1. By convention 0! = 1 — it simplifies a lot of formulas (including the ones just above).",
        ),
      ],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("Median")],
    },
    {
      type: "paragraph",
      content: [
        text(
          "The middle value of a sorted list. Odd-length list [1, 3, 3, 6, 7, 8, 9] → median is the 4th value, 6. Even-length list [1, 2, 3, 4, 5, 6, 8, 9] → median is the mean of the two middle values, (4+5)/2 = 4.5.",
        ),
      ],
    },
    {
      type: "heading",
      props: { level: 2 },
      content: [text("Geometric Progression")],
    },
    {
      type: "paragraph",
      content: [
        text(
          "A sequence where each term after the first is the previous term times a fixed common ratio r. 2, 6, 18, 54, ... is geometric with r = 3. 10, 5, 2.5, 1.25, ... is geometric with r = 1/2. General form:",
        ),
      ],
    },
    { type: "mathBlock", props: { code: "a,\\ ar,\\ ar^{2},\\ ar^{3},\\ ar^{4},\\ \\ldots" } },
    {
      type: "paragraph",
      content: [
        text(
          "The sum of the first n terms (for r ≠ 1) and the sum to infinity (for |r| < 1) — this is where it was left unfinished in the original notes:",
        ),
      ],
    },
    { type: "mathBlock", props: { code: "S_n = \\dfrac{a(r^{n}-1)}{r-1} \\qquad (r \\neq 1)" } },
    { type: "mathBlock", props: { code: "S_\\infty = \\dfrac{a}{1-r} \\qquad (|r| < 1)" } },
    {
      type: "paragraph",
      content: [
        text(
          "Worked example using the sequence from above (a = 2, r = 3): the sum of the first 4 terms (2 + 6 + 18 + 54) checks out at 80.",
        ),
      ],
    },
    { type: "mathBlock", props: { code: "S_4 = \\dfrac{2(3^{4}-1)}{3-1} = \\dfrac{2 \\times 80}{2} = 80" } },
    {
      type: "paragraph",
      content: [
        text(
          "This matters for algorithm analysis anywhere work shrinks (or grows) by a constant factor each step — e.g. summing the work across every level of a balanced recursion tree.",
        ),
      ],
    },
  ],
});

// ---------------------------------------------------------------------------
// Pull in every drafted group: read each group-*.json manifest + its <id>.md
// ---------------------------------------------------------------------------

const manifestFiles = readdirSync(NOTES_DIR).filter((f) => /^group-[a-z]\.json$/.test(f));
let imported = 0;
for (const manifestFile of manifestFiles.sort()) {
  const entries = JSON.parse(readFileSync(path.join(NOTES_DIR, manifestFile), "utf-8"));
  for (const entry of entries) {
    const mdPath = path.join(NOTES_DIR, `${entry.id}.md`);
    if (!existsSync(mdPath)) {
      console.warn(`[seed-cs-labs] MISSING content file for "${entry.id}" (from ${manifestFile}), skipping.`);
      continue;
    }
    const content = readFileSync(mdPath, "utf-8");
    writeNote(entry.id, {
      title: entry.title,
      type: entry.type,
      order: entry.order,
      pinned: !!entry.pinned,
      format: "markdown",
      content,
    });
    imported++;
  }
}

console.log(`[seed-cs-labs] wrote topic "${SLUG}" with 1 hand-authored math note + ${imported} drafted notes`);
