import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { TopicMeta, NoteMeta, TopicNote } from "@/types";

const TOPICS_DIR = path.join(process.cwd(), "topics");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function listTopics(): Promise<TopicMeta[]> {
  await ensureDir(TOPICS_DIR);
  const entries = await fs.readdir(TOPICS_DIR, { withFileTypes: true });
  const topics: TopicMeta[] = [];
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      try {
        const raw = await fs.readFile(
          path.join(TOPICS_DIR, entry.name, "topic.json"),
          "utf-8",
        );
        topics.push(JSON.parse(raw));
      } catch {
        /* skip */
      }
    }
  }
  return topics.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getTopic(slug: string): Promise<TopicMeta | null> {
  try {
    const raw = await fs.readFile(
      path.join(TOPICS_DIR, slug, "topic.json"),
      "utf-8",
    );
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function createTopic(
  data: Partial<TopicMeta>,
): Promise<TopicMeta> {
  const slug = (data.name || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const topicDir = path.join(TOPICS_DIR, slug);
  await ensureDir(topicDir);
  const topic: TopicMeta = {
    name: data.name || "Untitled Topic",
    slug,
    description: data.description || "",
    level: data.level || "exploring",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: data.tags || [],
    color: data.color || "#10B981",
  };
  await fs.writeFile(
    path.join(topicDir, "topic.json"),
    JSON.stringify(topic, null, 2),
  );
  return topic;
}

export async function updateTopic(
  slug: string,
  data: Partial<TopicMeta>,
): Promise<TopicMeta | null> {
  const existing = await getTopic(slug);
  if (!existing) return null;
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  await fs.writeFile(
    path.join(TOPICS_DIR, slug, "topic.json"),
    JSON.stringify(updated, null, 2),
  );
  return updated;
}

export async function deleteTopic(slug: string): Promise<boolean> {
  try {
    await fs.rm(path.join(TOPICS_DIR, slug), {
      recursive: true,
      force: true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function listNotes(slug: string): Promise<NoteMeta[]> {
  const topicDir = path.join(TOPICS_DIR, slug);
  await ensureDir(topicDir);
  const entries = await fs.readdir(topicDir);
  const notes: NoteMeta[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".md")) continue;
    const raw = await fs.readFile(path.join(topicDir, entry), "utf-8");
    const { data } = matter(raw);
    notes.push({
      id: entry.replace(".md", ""),
      title: (data.title as string) || entry.replace(".md", ""),
      type: (data.type as NoteMeta["type"]) || "general",
      createdAt: (data.createdAt as string) || new Date().toISOString(),
      updatedAt: (data.updatedAt as string) || new Date().toISOString(),
      tags: (data.tags as string[]) || [],
      pinned: (data.pinned as boolean) || false,
      order: (data.order as number) || 0,
      folder: (data.folder as string) || undefined,
    });
  }
  return notes.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.order - b.order;
  });
}

export async function getNote(
  slug: string,
  noteId: string,
): Promise<TopicNote | null> {
  try {
    const raw = await fs.readFile(
      path.join(TOPICS_DIR, slug, `${noteId}.md`),
      "utf-8",
    );
    const { data, content } = matter(raw);
    return {
      meta: {
        id: noteId,
        title: (data.title as string) || noteId,
        type: (data.type as NoteMeta["type"]) || "general",
        createdAt: (data.createdAt as string) || new Date().toISOString(),
        updatedAt: (data.updatedAt as string) || new Date().toISOString(),
        tags: (data.tags as string[]) || [],
        pinned: (data.pinned as boolean) || false,
        order: (data.order as number) || 0,
        folder: (data.folder as string) || undefined,
      },
      content,
      format: (data.format as "markdown" | "blocknote") || "markdown",
    };
  } catch {
    return null;
  }
}

export async function saveNote(
  slug: string,
  noteId: string,
  data: {
    title?: string;
    content?: string;
    type?: NoteMeta["type"];
    tags?: string[];
    pinned?: boolean;
    format?: string;
    folder?: string;
  },
): Promise<NoteMeta> {
  const topicDir = path.join(TOPICS_DIR, slug);
  await ensureDir(topicDir);
  const filePath = path.join(topicDir, `${noteId}.md`);

  let existingData: Record<string, unknown> = {};
  let existingContent = "";
  try {
    const parsed = matter(await fs.readFile(filePath, "utf-8"));
    existingData = parsed.data as Record<string, unknown>;
    existingContent = parsed.content;
  } catch {
    /* new file */
  }

  const front = {
    title: data.title ?? (existingData.title as string) ?? noteId,
    type: data.type ?? (existingData.type as string) ?? "general",
    createdAt: (existingData.createdAt as string) ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: data.tags ?? (existingData.tags as string[]) ?? [],
    pinned: data.pinned ?? (existingData.pinned as boolean) ?? false,
    order: (existingData.order as number) ?? 0,
    format: data.format ?? (existingData.format as string) ?? "markdown",
    folder: data.folder ?? (existingData.folder as string) ?? "",
  };

  await fs.writeFile(
    filePath,
    matter.stringify(data.content ?? existingContent, front),
  );
  await updateTopic(slug, {});

  return {
    id: noteId,
    title: front.title,
    type: front.type as NoteMeta["type"],
    createdAt: front.createdAt,
    updatedAt: front.updatedAt,
    tags: front.tags,
    pinned: front.pinned,
    order: front.order,
    folder: front.folder || undefined,
  };
}

export async function deleteNote(
  slug: string,
  noteId: string,
): Promise<boolean> {
  try {
    await fs.rm(path.join(TOPICS_DIR, slug, `${noteId}.md`));
    return true;
  } catch {
    return false;
  }
}
