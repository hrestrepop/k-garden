// One-off: splits the flat "Algorithms" folder in the Computer Science topic
// into per-technique subfolders (Algorithms/Sorting, Algorithms/Searching,
// etc). Safe to re-run.
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPIC_DIR = path.join(__dirname, "..", "topics", "computer-science");

const SUBFOLDER_MAP = {
  "sorting-algorithms": "Algorithms/Sorting",
  searching: "Algorithms/Searching",
  recursion: "Algorithms/Recursion",
  "dynamic-programming": "Algorithms/Dynamic Programming",
  "greedy-algorithms": "Algorithms/Greedy",
  "applied-coding-challenges": "Algorithms/Applied Challenges",
};

let updated = 0;
for (const [id, folder] of Object.entries(SUBFOLDER_MAP)) {
  const filePath = path.join(TOPIC_DIR, `${id}.md`);
  if (!existsSync(filePath)) {
    console.warn(`[migrate-algorithms-subfolders] missing ${id}.md, skipping.`);
    continue;
  }
  const parsed = matter(readFileSync(filePath, "utf-8"));
  parsed.data.folder = folder;
  writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
  updated++;
}

console.log(`[migrate-algorithms-subfolders] updated ${updated} notes`);
