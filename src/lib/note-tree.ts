import type { NoteMeta } from "@/types";

export interface NoteTreeFolder {
  name: string;
  path: string;
  folders: NoteTreeFolder[];
  notes: NoteMeta[];
}

/** Groups a flat (already-sorted) note list into a folder tree based on each
 * note's slash-delimited `folder` path. Notes with no folder land in the
 * returned root's own `notes` array. */
export function buildNoteTree(notes: NoteMeta[]): NoteTreeFolder {
  const root: NoteTreeFolder = { name: "", path: "", folders: [], notes: [] };

  function getOrCreate(
    parent: NoteTreeFolder,
    segments: string[],
    index: number,
  ): NoteTreeFolder {
    if (index >= segments.length) return parent;
    const name = segments[index];
    const path = segments.slice(0, index + 1).join("/");
    let child = parent.folders.find((f) => f.name === name);
    if (!child) {
      child = { name, path, folders: [], notes: [] };
      parent.folders.push(child);
    }
    return getOrCreate(child, segments, index + 1);
  }

  for (const note of notes) {
    const segments = (note.folder || "")
      .split("/")
      .map((s) => s.trim())
      .filter(Boolean);
    getOrCreate(root, segments, 0).notes.push(note);
  }

  (function sortTree(folder: NoteTreeFolder) {
    folder.folders.sort((a, b) => a.name.localeCompare(b.name));
    folder.folders.forEach(sortTree);
  })(root);

  return root;
}
