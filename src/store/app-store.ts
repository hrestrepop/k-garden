import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TopicMeta, NoteMeta } from "@/types";

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  sidebarWidth: number;
  setSidebarWidth: (w: number) => void;

  topics: TopicMeta[];
  setTopics: (t: TopicMeta[]) => void;
  topicsLoading: boolean;
  setTopicsLoading: (loading: boolean) => void;

  currentTopic: TopicMeta | null;
  setCurrentTopic: (t: TopicMeta | null) => void;

  notes: NoteMeta[];
  setNotes: (n: NoteMeta[]) => void;

  newTopicModalOpen: boolean;
  setNewTopicModalOpen: (open: boolean) => void;

  editTopicModalOpen: boolean;
  setEditTopicModalOpen: (open: boolean) => void;

  newNoteModalOpen: boolean;
  setNewNoteModalOpen: (open: boolean) => void;

  /** Folder path to pre-fill when opening the New Note modal from a
   * folder's own "+ New note" affordance (Sidebar / TopicView). */
  newNoteFolder: string;
  setNewNoteFolder: (folder: string) => void;

  /** Note currently targeted by the Move-to-folder modal, if open. */
  movingNote: NoteMeta | null;
  setMovingNote: (note: NoteMeta | null) => void;

  lectureMode: boolean;
  setLectureMode: (on: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      sidebarWidth: 280,
      setSidebarWidth: (sidebarWidth) => set({ sidebarWidth }),

      topics: [],
      setTopics: (topics) => set({ topics }),
      topicsLoading: true,
      setTopicsLoading: (topicsLoading) => set({ topicsLoading }),

      currentTopic: null,
      setCurrentTopic: (currentTopic) => set({ currentTopic }),

      notes: [],
      setNotes: (notes) => set({ notes }),

      newTopicModalOpen: false,
      setNewTopicModalOpen: (open) => set({ newTopicModalOpen: open }),

      editTopicModalOpen: false,
      setEditTopicModalOpen: (open) => set({ editTopicModalOpen: open }),

      newNoteModalOpen: false,
      setNewNoteModalOpen: (open) => set({ newNoteModalOpen: open }),

      newNoteFolder: "",
      setNewNoteFolder: (newNoteFolder) => set({ newNoteFolder }),

      movingNote: null,
      setMovingNote: (movingNote) => set({ movingNote }),

      lectureMode: false,
      setLectureMode: (lectureMode) => set({ lectureMode }),
    }),
    {
      name: "kgarden-ui-prefs",
      // Only persist lightweight UI preferences — everything else (topics,
      // notes, modal state) is either fetched fresh or purely ephemeral.
      partialize: (state) => ({
        sidebarWidth: state.sidebarWidth,
        sidebarOpen: state.sidebarOpen,
      }),
    },
  ),
);
