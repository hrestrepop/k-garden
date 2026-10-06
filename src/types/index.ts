import {
  FileText,
  NotebookPen,
  Terminal,
  Sigma,
  BookOpen,
  CircleQuestionMark,
  File,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TopicLevel = "exploring" | "learning" | "comfortable" | "mastered";

export type NoteType =
  | "concept"
  | "cheatsheet"
  | "notebook"
  | "math-notes"
  | "reference"
  | "questions"
  | "general";

export interface TopicMeta {
  name: string;
  slug: string;
  description: string;
  level: TopicLevel;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  color: string;
}

export interface NoteMeta {
  id: string;
  title: string;
  type: NoteType;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  pinned: boolean;
  order: number;
  /** Slash-delimited folder path within the topic, e.g. "Data Structures" or
   * "Data Structures/Trees". Absent/empty means the note sits at the topic root. */
  folder?: string;
}

export interface TopicNote {
  meta: NoteMeta;
  content: string;
  format: "markdown" | "blocknote";
}

export const LEVEL_CONFIG: Record<
  TopicLevel,
  { label: string; color: string; icon: string }
> = {
  exploring: { label: "Exploring", color: "#F59E0B", icon: "🌱" },
  learning: { label: "Learning", color: "#3B82F6", icon: "🌿" },
  comfortable: { label: "Comfortable", color: "#10B981", icon: "🌳" },
  mastered: { label: "Mastered", color: "#8B5CF6", icon: "🏔️" },
};

export const NOTE_TYPE_CONFIG: Record<
  NoteType,
  { label: string; icon: LucideIcon; color: string }
> = {
  concept: { label: "Concept", icon: FileText, color: "#3B82F6" },
  cheatsheet: { label: "Cheatsheet", icon: NotebookPen, color: "#10B981" },
  notebook: { label: "Notebook", icon: Terminal, color: "#F59E0B" },
  "math-notes": { label: "Math Notes", icon: Sigma, color: "#8B5CF6" },
  reference: { label: "Reference", icon: BookOpen, color: "#06B6D4" },
  questions: { label: "Questions", icon: CircleQuestionMark, color: "#EC4899" },
  general: { label: "General", icon: File, color: "#6B7280" },
};
