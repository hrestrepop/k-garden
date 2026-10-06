"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Text,
  HStack,
  Badge,
  Input,
  IconButton,
  Menu,
  Portal,
} from "@chakra-ui/react";
import {
  ArrowLeft,
  CheckCircle,
  Loader,
  Pin,
  Trash2,
  Download,
  BookOpen,
  FolderInput,
  X,
} from "lucide-react";
import { NOTE_TYPE_CONFIG } from "@/types";
import type { TopicNote } from "@/types";
import DynamicEditor, { type BlockEditorHandle } from "./DynamicEditor";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAppStore } from "@/store/app-store";

interface Props {
  slug: string;
  noteId: string;
}

export default function NotePage({ slug, noteId }: Props) {
  const router = useRouter();
  const { lectureMode, setLectureMode, setMovingNote } = useAppStore();
  const [note, setNote] = useState<TopicNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<BlockEditorHandle>(null);

  useEffect(() => {
    fetch(`/api/topics/${slug}/notes/${noteId}`)
      .then((r) => {
        if (!r.ok) {
          router.replace(`/topic/${slug}`);
          return null;
        }
        return r.json();
      })
      .then((n: TopicNote | null) => {
        if (!n) return;
        setNote(n);
        setTitle(n.meta.title);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.replace(`/topic/${slug}`);
      });
  }, [slug, noteId, router]);

  // Leave lecture mode when navigating away from the note
  useEffect(() => {
    return () => setLectureMode(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lectureMode) setLectureMode(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lectureMode, setLectureMode]);

  const handleSave = useCallback(
    async (content: string) => {
      setSaving(true);
      setSaved(false);
      try {
        await fetch(`/api/topics/${slug}/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, format: "blocknote" }),
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } finally {
        setSaving(false);
      }
    },
    [slug, noteId],
  );

  const handleTitleBlur = async () => {
    setEditingTitle(false);
    if (!title.trim() || title === note?.meta.title) return;
    await fetch(`/api/topics/${slug}/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  };

  const handleDelete = async () => {
    await fetch(`/api/topics/${slug}/notes/${noteId}`, { method: "DELETE" });
    router.push(`/topic/${slug}`);
  };

  const handleExport = (format: "md" | "txt") => {
    if (!editorRef.current) return;
    const content =
      format === "md"
        ? editorRef.current.exportMarkdown()
        : editorRef.current.exportText();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTogglePin = async () => {
    if (!note) return;
    const pinned = !note.meta.pinned;
    await fetch(`/api/topics/${slug}/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned }),
    });
    setNote({ ...note, meta: { ...note.meta, pinned } });
  };

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="bg.canvas">
        <Text color="fg.muted">Loading...</Text>
      </Flex>
    );
  }

  if (!note) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="bg.canvas">
        <Text color="fg.muted">Note not found.</Text>
      </Flex>
    );
  }

  const cfg = NOTE_TYPE_CONFIG[note.meta.type];
  const NoteIcon = cfg.icon;

  if (lectureMode) {
    return (
      <Flex
        direction="column"
        minH="100vh"
        bg="bg.canva"
        maxW="1200px"
        mx="auto"
        _dark={{ bg: "gray.900" }}
      >
        <Flex
          px="6"
          py="3"
          align="center"
          justify="center"
          position="sticky"
          top="0"
          zIndex="40"
        >
          <Box
            as="button"
            position="fixed"
            top="4"
            right="6"
            display="flex"
            alignItems="center"
            gap="1.5"
            px="3"
            py="1.5"
            borderRadius="lg"
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
            color="fg.muted"
            fontSize="xs"
            boxShadow="0 4px 14px rgba(15,23,42,0.08)"
            _hover={{ color: "fg.default" }}
            transition="color 0.15s"
            onClick={() => setLectureMode(false)}
          >
            <X size={13} /> Exit Lecture Mode
          </Box>
        </Flex>
        <Box
          flex="1"
          w="full"
          mx="auto"
          px={{ base: "5", md: "8" }}
          py="16"
        >
          <Text
            fontSize="2xl"
            fontWeight="800"
            color="fg.default"
            mb="8"
            letterSpacing="-0.02em"
          >
            {title}
          </Text>
          <Box className="lecture-mode-content">
            <DynamicEditor
              initialContent={note.content}
              initialFormat={note.format}
              editable={false}
            />
          </Box>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      minH="100vh"

    >
      {/* Topbar */}
      <Flex
        px="6"
        py="3"
        borderBottom="1px solid"
        borderColor="border.default"
        align="center"
        gap="3"
        bg="bg.surface"
        _dark={{ bg: "gray.800" }}
        position="sticky"
        top="0"
        zIndex="40"
      >
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap="1.5"
          color="fg.muted"
          _hover={{ color: "fg.default" }}
          transition="color 0.15s"
          onClick={() => router.push(`/topic/${slug}`)}
        >
          <ArrowLeft size={14} />
          <Text fontSize="xs">Back</Text>
        </Box>

        <Box w="1px" h="4" bg="border.default" />

        <HStack gap="2" flex="1" minW="0">
          <NoteIcon size={14} color={cfg.color} />
          {editingTitle ? (
            <Input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleBlur();
              }}
              size="sm"
              bg="transparent"
              border="none"
              borderBottom="1px solid"
              borderColor="green.500"
              borderRadius="0"
              color="fg.default"
              fontWeight="600"
              px="0"
              _focus={{ boxShadow: "none" }}
              autoFocus
            />
          ) : (
            <Text
              fontSize="sm"
              fontWeight="600"
              color="fg.default"
              cursor="text"
              _hover={{ color: "green.500" }}
              transition="color 0.15s"
              truncate
              onClick={() => setEditingTitle(true)}
            >
              {title}
            </Text>
          )}
        </HStack>

        <HStack gap="2">
          {saving && (
            <HStack gap="1" color="fg.muted">
              <Loader size={12} className="animate-spin" />
              <Text fontSize="xs">Saving...</Text>
            </HStack>
          )}
          {saved && !saving && (
            <HStack gap="1" color="green.500">
              <CheckCircle size={12} />
              <Text fontSize="xs">Saved</Text>
            </HStack>
          )}
          <Badge
            px="2"
            py="0.5"
            borderRadius="full"
            fontSize="10px"
            bg={`${cfg.color}18`}
            color={cfg.color}
            fontWeight="600"
          >
            {cfg.label}
          </Badge>
          <IconButton
            aria-label="lecture mode"
            size="xs"
            variant="ghost"
            color="fg.subtle"
            _hover={{ color: "green.500" }}
            onClick={() => setLectureMode(true)}
            title="Lecture mode — distraction-free reading"
          >
            <BookOpen size={14} />
          </IconButton>
          <IconButton
            aria-label="pin"
            size="xs"
            variant="ghost"
            color={note.meta.pinned ? "yellow.400" : "fg.subtle"}
            _hover={{ color: "yellow.400" }}
            onClick={handleTogglePin}
          >
            <Pin size={14} />
          </IconButton>
          <IconButton
            aria-label="move"
            size="xs"
            variant="ghost"
            color="fg.subtle"
            _hover={{ color: "fg.default" }}
            onClick={() => setMovingNote(note.meta)}
            title="Move to folder"
          >
            <FolderInput size={14} />
          </IconButton>
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                aria-label="export"
                size="xs"
                variant="ghost"
                color="fg.subtle"
                _hover={{ color: "fg.default" }}
              >
                <Download size={14} />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="md" onClick={() => handleExport("md")}>
                    Download as Markdown
                  </Menu.Item>
                  <Menu.Item value="txt" onClick={() => handleExport("txt")}>
                    Download as Plain Text
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <IconButton
            aria-label="delete"
            size="xs"
            variant="ghost"
            color="fg.subtle"
            _hover={{ color: "red.400" }}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={14} />
          </IconButton>
        </HStack>
      </Flex>

      {/* Editor */}
      <Box
        maxW="1200px"
        w="full"
        mx="auto"
        px={{ base: "5", md: "10" }}
        py="8"
      >
        <DynamicEditor
          ref={editorRef}
          initialContent={note.content}
          initialFormat={note.format}
          onSave={handleSave}
          editable={true}
        />
      </Box>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete note"
        description={`"${title}" will be permanently deleted.`}
        confirmLabel="Delete note"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </Flex>
  );
}
