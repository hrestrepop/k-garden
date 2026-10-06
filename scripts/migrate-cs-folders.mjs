// One-off migration: renames the "Algorithms & Data Structures" topic to
// "Computer Science" and splits its notes into "Data Structures" and
// "Algorithms" folders (a few general/reference notes stay unfoldered at the
// topic root). Safe to re-run.
import { readFileSync, writeFileSync, renameSync, existsSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPICS_DIR = path.join(__dirname, "..", "topics");
const OLD_SLUG = "algorithms-data-structures";
const NEW_SLUG = "computer-science";
const OLD_DIR = path.join(TOPICS_DIR, OLD_SLUG);
const NEW_DIR = path.join(TOPICS_DIR, NEW_SLUG);

if (existsSync(OLD_DIR) && !existsSync(NEW_DIR)) {
  renameSync(OLD_DIR, NEW_DIR);
  console.log(`[migrate-cs-folders] renamed ${OLD_SLUG} -> ${NEW_SLUG}`);
} else if (!existsSync(NEW_DIR)) {
  console.error(`[migrate-cs-folders] neither ${OLD_SLUG} nor ${NEW_SLUG} exists, aborting.`);
  process.exit(1);
}

const topicJsonPath = path.join(NEW_DIR, "topic.json");
const topic = JSON.parse(readFileSync(topicJsonPath, "utf-8"));
topic.name = "Computer Science";
topic.slug = NEW_SLUG;
topic.description =
  "Core CS, data structures, and algorithms — imported and cleaned up from years of coding-interview practice.";
topic.updatedAt = new Date().toISOString();
writeFileSync(topicJsonPath, JSON.stringify(topic, null, 2));

const FOLDER_MAP = {
  "Data Structures": [
    "arrays",
    "strings",
    "linked-lists",
    "stacks-and-queues",
    "hashmaps-and-frequency-tricks",
    "trees",
    "graphs",
    "matrix-operations",
    "custom-data-structures",
  ],
  Algorithms: [
    "sorting-algorithms",
    "searching",
    "recursion",
    "dynamic-programming",
    "greedy-algorithms",
    "applied-coding-challenges",
  ],
  // everything else (big-o-and-complexity, core-cs-concepts,
  // math-foundations-for-algorithms, personal-learnings-and-retro,
  // functional-programming-patterns, oop-in-javascript,
  // js-builtin-reimplementations) stays unfoldered at the topic root.
};

const idToFolder = {};
for (const [folder, ids] of Object.entries(FOLDER_MAP)) {
  for (const id of ids) idToFolder[id] = folder;
}

let updated = 0;
for (const file of readdirSync(NEW_DIR)) {
  if (!file.endsWith(".md")) continue;
  const id = file.replace(/\.md$/, "");
  const folder = idToFolder[id];
  if (!folder) continue;
  const filePath = path.join(NEW_DIR, file);
  const parsed = matter(readFileSync(filePath, "utf-8"));
  parsed.data.folder = folder;
  writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
  updated++;
}

console.log(`[migrate-cs-folders] set folder on ${updated} notes in topics/${NEW_SLUG}`);
