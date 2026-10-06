"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Flex,
  Text,
  IconButton,
  VStack,
  HStack,
  Input,
  Skeleton,
} from "@chakra-ui/react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  ChevronDown,
  Pin,
  Home,
  Folder,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { NOTE_TYPE_CONFIG } from "@/types";
import type { NoteMeta, TopicMeta } from "@/types";
import { buildNoteTree, type NoteTreeFolder } from "@/lib/note-tree";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import KGardenMark from "@/components/ui/KGardenMark";

export default function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const {
    sidebarOpen,
    toggleSidebar,
    sidebarWidth,
    setSidebarWidth,
    topics,
    setTopics,
    topicsLoading,
    setTopicsLoading,
    setNewTopicModalOpen,
    setNewNoteModalOpen,
    setNewNoteFolder,
    setNotes,
    setCurrentTopic,
  } = useAppStore();

  const isDragging = useRef(false);

  const startResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const max = Math.round(window.innerWidth * 0.3);
        const next = Math.min(Math.max(ev.clientX, 280), max);
        setSidebarWidth(next);
      };

      const onUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [setSidebarWidth],
  );

  // Explicit open/closed override per topic slug, set only once the user has
  // clicked it. Absent = use the natural default (open iff it's the current
  // topic) — but an explicit click always wins, so even the current topic
  // can be collapsed.
  const [topicOverrides, setTopicOverrides] = useState<Record<string, boolean>>(
    {},
  );
  const [topicNotes, setTopicNotes] = useState<Record<string, NoteMeta[]>>({});
  const [notesLoading, setNotesLoading] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const currentSlug = params?.slug as string | undefined;
  const currentNoteId = params?.noteId as string | undefined;

  const isTopicOpen = (slug: string) =>
    topicOverrides[slug] ?? slug === currentSlug;

  useEffect(() => {
    setTopicsLoading(true);
    fetch("/api/topics")
      .then((r) => r.json())
      .then((data) => {
        setTopics(data);
        setTopicsLoading(false);
      })
      .catch(() => setTopicsLoading(false));
  }, [setTopics, setTopicsLoading]);

  const loadNotes = useCallback(
    async (slug: string) => {
      setNotesLoading((prev) => new Set(prev).add(slug));
      const notes = await fetch(`/api/topics/${slug}/notes`).then((r) =>
        r.json(),
      );
      setTopicNotes((prev) => ({ ...prev, [slug]: notes }));
      setNotesLoading((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
      if (slug === currentSlug) setNotes(notes);
    },
    [currentSlug, setNotes],
  );

  // Load notes for whichever topic the route is currently on.
  useEffect(() => {
    if (!currentSlug) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotes(currentSlug);
  }, [currentSlug, loadNotes]);

  const toggle = (slug: string) => {
    const next = !isTopicOpen(slug);
    setTopicOverrides((prev) => ({ ...prev, [slug]: next }));
    if (next && !topicNotes[slug]) loadNotes(slug);
  };

  const filtered = topics.filter(
    (t) => !search || t.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Folders default closed; track only manually-opened ones (keyed by
  // "<topicSlug>::<folderPath>" so state doesn't collide across topics).
  // The folder containing the currently open note is open by default too,
  // the same way the current topic forces itself open above — but same deal,
  // an explicit click always wins and can close it.
  const [folderOverrides, setFolderOverrides] = useState<
    Record<string, boolean>
  >({});
  const isFolderOpen = (key: string, naturalDefault: boolean) =>
    folderOverrides[key] ?? naturalDefault;
  const toggleFolder = (key: string, naturalDefault: boolean) => {
    setFolderOverrides((prev) => ({
      ...prev,
      [key]: !isFolderOpen(key, naturalDefault),
    }));
  };

  const getActiveFolderAncestors = (notes: NoteMeta[]) => {
    const ancestors = new Set<string>();
    const active = notes.find((n) => n.id === currentNoteId);
    if (!active?.folder) return ancestors;
    const segments = active.folder
      .split("/")
      .map((s) => s.trim())
      .filter(Boolean);
    let path = "";
    for (const seg of segments) {
      path = path ? `${path}/${seg}` : seg;
      ancestors.add(path);
    }
    return ancestors;
  };

  const renderNoteRow = (topic: TopicMeta, note: NoteMeta, depth: number) => {
    const cfg = NOTE_TYPE_CONFIG[note.type];
    const NoteIcon = cfg.icon;
    const active = currentNoteId === note.id;
    return (
      <Flex
        key={note.id}
        px="2"
        py="1"
        mx="1"
        pl={`${8 + depth * 14}px`}
        borderRadius="md"
        align="center"
        gap="1.5"
        cursor="pointer"
        bg={active ? "bg.muted" : "transparent"}
        _hover={{ bg: "bg.muted" }}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/topic/${topic.slug}/${note.id}`);
        }}
      >
        {note.pinned && <Pin size={9} color="#F59E0B" />}
        <NoteIcon size={11} color={cfg.color} />
        <Text
          fontSize="xs"
          color={active ? "fg.default" : "fg.muted"}
          flex="1"
          truncate
        >
          {note.title}
        </Text>
      </Flex>
    );
  };

  const renderNewNoteRow = (
    topic: TopicMeta,
    depth: number,
    folderPath: string,
  ) => (
    <Flex
      key="__new_note__"
      px="2"
      py="1"
      mx="1"
      pl={`${8 + depth * 14}px`}
      borderRadius="md"
      align="center"
      gap="1.5"
      cursor="pointer"
      _hover={{ bg: "bg.muted" }}
      onClick={(e) => {
        e.stopPropagation();
        setCurrentTopic(topic);
        setNewNoteFolder(folderPath);
        setNewNoteModalOpen(true);
      }}
    >
      <Plus size={11} color="currentColor" style={{ opacity: 0.5 }} />
      <Text fontSize="xs" color="fg.subtle">
        New note
      </Text>
    </Flex>
  );

  const renderFolderNode = (
    topic: TopicMeta,
    folder: NoteTreeFolder,
    depth: number,
    activeAncestors: Set<string>,
  ): React.ReactNode => {
    const key = `${topic.slug}::${folder.path}`;
    const naturalDefault = activeAncestors.has(folder.path);
    const isOpen = isFolderOpen(key, naturalDefault);
    return (
      <Box key={folder.path || "__root__"}>
        <Flex
          px="2"
          py="1"
          mx="1"
          pl={`${8 + depth * 14}px`}
          borderRadius="md"
          align="center"
          gap="1.5"
          cursor="pointer"
          _hover={{ bg: "bg.muted" }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFolder(key, naturalDefault);
          }}
        >
          <Box
            color="fg.subtle"
            transition="transform 0.15s"
            transform={isOpen ? "rotate(0deg)" : "rotate(-90deg)"}
          >
            <ChevronDown size={11} />
          </Box>
          <Folder size={13} color="currentColor" style={{ opacity: 0.8 }} />
          <Text
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.04em"
            color="fg.muted"
            flex="1"
            truncate
          >
            {folder.name}
          </Text>
        </Flex>
        {isOpen && (
          <VStack gap="0" align="stretch">
            {folder.notes.map((n) => renderNoteRow(topic, n, depth + 1))}
            {folder.folders.map((f) =>
              renderFolderNode(topic, f, depth + 1, activeAncestors),
            )}
            {renderNewNoteRow(topic, depth + 1, folder.path)}
          </VStack>
        )}
      </Box>
    );
  };

  const renderTopicNotes = (topic: TopicMeta, notes: NoteMeta[]) => {
    const tree = buildNoteTree(notes);
    const activeAncestors = getActiveFolderAncestors(notes);
    return (
      <>
        {tree.notes.map((n) => renderNoteRow(topic, n, 0))}
        {tree.folders.map((f) =>
          renderFolderNode(topic, f, 0, activeAncestors),
        )}
        {renderNewNoteRow(topic, 0, "")}
      </>
    );
  };

  if (!sidebarOpen) {
    return (
      <Flex
        position="fixed"
        left="0"
        top="0"
        bottom="0"
        width="48px"
        bg="bg.surface"
        _dark={{ bg: "gray.800" }}
        borderRight="1px solid"
        borderColor="border.default"
        direction="column"
        align="center"
        pt="3"
        gap="2"
        zIndex="50"
      >
        <IconButton
          aria-label="open"
          size="sm"
          variant="ghost"
          color="fg.muted"
          onClick={toggleSidebar}
        >
          <PanelLeftOpen size={18} />
        </IconButton>
        <IconButton
          aria-label="home"
          size="sm"
          variant="ghost"
          color="fg.muted"
          onClick={() => router.push("/")}
        >
          <Home size={18} />
        </IconButton>
      </Flex>
    );
  }

  return (
    <Flex
      position="fixed"
      left="0"
      top="0"
      bottom="0"
      width={`${sidebarWidth}px`}
      bg="bg.surface"
      _dark={{ bg: "gray.800" }}
      borderRight="1px solid"
      borderColor="border.default"
      direction="column"
      zIndex="50"
    >
      {/* Header */}
      <Flex
        px="3"
        py="3"
        align="center"
        justify="space-between"
        borderBottom="1px solid"
        borderColor="border.default"
      >
        <HStack gap="2" cursor="pointer" onClick={() => router.push("/")}>
          <KGardenMark size={26} />
          <Text fontWeight="700" fontSize="sm" color="fg.default">
            K-Garden
          </Text>
        </HStack>
        <HStack gap="0">
          <IconButton
            aria-label="new topic"
            size="xs"
            variant="ghost"
            color="fg.muted"
            onClick={() => setNewTopicModalOpen(true)}
          >
            <Plus size={16} />
          </IconButton>
          <IconButton
            aria-label="close"
            size="xs"
            variant="ghost"
            color="fg.muted"
            onClick={toggleSidebar}
          >
            <PanelLeftClose size={16} />
          </IconButton>
        </HStack>
      </Flex>

      {/* Search */}
      <Box px="3" py="2">
        <Box position="relative">
          <Box
            position="absolute"
            left="8px"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            color="fg.subtle"
          >
            <Search size={13} />
          </Box>
          <Input
            placeholder="Search topics & notes..."
            size="sm"
            pl="28px"
            bg="bg.muted"
            border="1px solid"
            borderColor="border.default"
            color="fg.default"
            fontSize="xs"
            _placeholder={{ color: "fg.subtle" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>

      {/* Topics */}
      <VStack flex="1" overflowY="auto" gap="0" px="1" py="1" align="stretch">
        {topicsLoading && (
          <VStack gap="1" px="1" py="1" align="stretch">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="28px" borderRadius="md" />
            ))}
          </VStack>
        )}

        {!topicsLoading &&
          filtered.map((topic, idx) => {
            const isExpanded = isTopicOpen(topic.slug);
            const isActive = currentSlug === topic.slug && !currentNoteId;
            const notes = topicNotes[topic.slug];
            const isNotesLoading = notesLoading.has(topic.slug);

            return (
              <Box
                key={topic.slug}
                mt={idx > 0 ? "2" : "0"}
                pt={idx > 0 ? "2" : "0"}
                borderTop={idx > 0 ? "1px solid" : undefined}
                borderColor="border.default"
              >
                <Flex
                  px="2"
                  py="2"
                  mx="1"
                  borderRadius="lg"
                  align="center"
                  gap="2"
                  cursor="pointer"
                  bg={isActive ? "bg.muted" : "transparent"}
                  _hover={{ bg: "bg.muted" }}
                  onClick={() => {
                    toggle(topic.slug);
                    router.push(`/topic/${topic.slug}`);
                  }}
                >
                  <Box
                    color="fg.subtle"
                    transition="transform 0.15s"
                    transform={isExpanded ? "rotate(0deg)" : "rotate(-90deg)"}
                  >
                    <ChevronDown size={14} />
                  </Box>
                  <Box
                    w="2.5"
                    h="2.5"
                    borderRadius="full"
                    bg={topic.color}
                    flexShrink={0}
                  />
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    letterSpacing="-0.01em"
                    color="fg.default"
                    flex="1"
                    truncate
                  >
                    {topic.name}
                  </Text>
                </Flex>

                {isExpanded && (
                  <VStack gap="0" pl="6" align="stretch">
                    {isNotesLoading && (
                      <VStack gap="1" px="1" py="0.5" align="stretch">
                        {[1, 2].map((i) => (
                          <Skeleton key={i} height="22px" borderRadius="md" />
                        ))}
                      </VStack>
                    )}

                    {!isNotesLoading && notes && renderTopicNotes(topic, notes)}
                  </VStack>
                )}
              </Box>
            );
          })}
      </VStack>

      {/* Resize handle */}
      <Box
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        width="2px"
        cursor="col-resize"
        zIndex="10"
        _hover={{ bg: "green.500", opacity: 0.4 }}
        transition="background 0.15s"
        onMouseDown={startResize}
      />

      {/* Footer */}
      <Flex
        px="3"
        py="2"
        borderTop="1px solid"
        borderColor="border.default"
        align="center"
        justify="space-between"
      >
        <Text fontSize="xs" color="fg.subtle">
          {topicsLoading ? "Loading..." : `${topics.length} topics`}
        </Text>
        <ThemeToggle />
      </Flex>
    </Flex>
  );
}
