"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Badge,
  IconButton,
  Skeleton,
} from "@chakra-ui/react";
import {
  Plus,
  ArrowLeft,
  Pin,
  Trash2,
  Clock,
  Tag,
  FileStack,
  Pencil,
  Folder,
  FolderInput,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { LEVEL_CONFIG, NOTE_TYPE_CONFIG } from "@/types";
import type { NoteMeta } from "@/types";
import { buildNoteTree, type NoteTreeFolder } from "@/lib/note-tree";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function TopicView({ slug }: { slug: string }) {
  const router = useRouter();
  const {
    currentTopic,
    setCurrentTopic,
    notes,
    setNotes,
    setNewNoteModalOpen,
    setNewNoteFolder,
    setMovingNote,
    setEditTopicModalOpen,
    topics,
    setTopics,
  } = useAppStore();

  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [confirmDeleteTopic, setConfirmDeleteTopic] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/topics/${slug}`),
      fetch(`/api/topics/${slug}/notes`),
    ])
      .then(async ([topicRes, notesRes]) => {
        if (!topicRes.ok) {
          router.replace("/");
          return;
        }
        const [topic, notesData] = await Promise.all([
          topicRes.json(),
          notesRes.json(),
        ]);
        setCurrentTopic(topic);
        setNotes(notesData);
      })
      .catch(() => router.replace("/"));
  }, [slug, router, setCurrentTopic, setNotes]);

  const handleDeleteNote = async () => {
    if (!deletingNoteId) return;
    await fetch(`/api/topics/${slug}/notes/${deletingNoteId}`, {
      method: "DELETE",
    });
    setNotes(notes.filter((n) => n.id !== deletingNoteId));
    setDeletingNoteId(null);
  };

  const handleTogglePin = async (note: NoteMeta) => {
    const pinned = !note.pinned;
    await fetch(`/api/topics/${slug}/notes/${note.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned }),
    });
    setNotes(notes.map((n) => (n.id === note.id ? { ...n, pinned } : n)));
  };

  const handleDeleteTopic = async () => {
    await fetch(`/api/topics/${slug}`, { method: "DELETE" });
    setTopics(topics.filter((t) => t.slug !== slug));
    setCurrentTopic(null);
    router.push("/");
  };

  const handleEditTopic = () => {
    if (currentTopic) setEditTopicModalOpen(true);
  };

  const openNewNoteModal = (folder: string) => {
    setNewNoteFolder(folder);
    setNewNoteModalOpen(true);
  };

  if (!currentTopic) {
    return (
      <Box minH="100vh" bg="bg.canvas">
        <Flex
          px="8"
          py="4"
          borderBottom="1px solid"
          borderColor="border.default"
          bg="bg.surface"
          _dark={{ bg: "gray.900" }}
          align="center"
          gap="4"
        >
          <Skeleton height="20px" width="80px" borderRadius="md" />
          <Box w="1px" h="4" bg="border.default" />
          <HStack gap="3" flex="1">
            <Skeleton w="8" h="8" borderRadius="lg" />
            <Skeleton height="16px" width="160px" borderRadius="md" />
          </HStack>
        </Flex>
        <Box px="8" py="6" maxW="960px" mx="auto">
          <HStack gap="4" mb="8" flexWrap="wrap">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="36px" width="120px" borderRadius="lg" />
            ))}
          </HStack>
          <VStack gap="2" align="stretch">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="60px" borderRadius="xl" />
            ))}
          </VStack>
        </Box>
      </Box>
    );
  }

  const levelCfg = LEVEL_CONFIG[currentTopic.level];
  const pinned = notes.filter((n) => n.pinned);
  const unpinned = notes.filter((n) => !n.pinned);

  return (
    <Box minH="100vh">
      {/* Header */}
      <Flex
        px="8"
        py="4"
        borderBottom="1px solid"
        borderColor="border.default"
        bg="bg.canvas"
        _dark={{ bg: "gray.800" }}
        align="center"
        gap="4"
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
          cursor="pointer"
          _hover={{ color: "fg.default" }}
          transition="color 0.15s"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={14} />
          <Text fontSize="xs">All Topics</Text>
        </Box>

        <Box w="1px" h="4" bg="border.default" />

        <HStack gap="3" flex="1">
          <Box
            w="2.5"
            h="2.5"
            borderRadius="full"
            bg={currentTopic.color}
            flexShrink={0}
          />
          <Box>
            <Text fontSize="sm" fontWeight="700" color="fg.default">
              {currentTopic.name}
            </Text>
            {currentTopic.description && (
              <Text fontSize="xs" color="fg.muted" truncate maxW="400px">
                {currentTopic.description}
              </Text>
            )}
          </Box>
          <Badge
            px="2.5"
            py="0.5"
            borderRadius="full"
            fontSize="10px"
            fontWeight="600"
            bg={`${levelCfg.color}20`}
            color={levelCfg.color}
          >
            {levelCfg.label}
          </Badge>
        </HStack>

        <HStack gap="2">
          <IconButton
            aria-label="edit topic"
            size="sm"
            variant="ghost"
            color="fg.muted"
            _hover={{ color: "fg.default" }}
            onClick={handleEditTopic}
          >
            <Pencil size={15} />
          </IconButton>
          <IconButton
            aria-label="delete topic"
            size="sm"
            variant="ghost"
            color="fg.muted"
            _hover={{ color: "red.400" }}
            onClick={() => setConfirmDeleteTopic(true)}
          >
            <Trash2 size={15} />
          </IconButton>
          <Box
            as="button"
            px="3"
            py="1.5"
            borderRadius="lg"
            bg="green.600"
            color="white"
            fontWeight="600"
            fontSize="xs"
            display="flex"
            alignItems="center"
            gap="1.5"
            _hover={{ bg: "green.500" }}
            transition="all 0.15s"
            onClick={() => openNewNoteModal("")}
          >
            <Plus size={14} /> New Note
          </Box>
        </HStack>
      </Flex>

      <Box px="8" py="6" maxW="1200px" mx="auto">
        {/* Topic meta */}
        <HStack gap="4" mb="8" flexWrap="wrap">
          <HStack
            gap="2"
            px="3"
            py="2"
            borderRadius="lg"
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
          >
            <FileStack
              size={13}
              color="currentColor"
              style={{ opacity: 0.5 }}
            />
            <Text fontSize="xs" color="fg.muted">
              {notes.length} note{notes.length === 1 ? "" : "s"}
            </Text>
          </HStack>
          {currentTopic.tags.length > 0 && (
            <HStack
              gap="2"
              px="3"
              py="2"
              borderRadius="lg"
              bg="bg.surface"
              border="1px solid"
              borderColor="border.default"
            >
              <Tag size={13} color="currentColor" style={{ opacity: 0.5 }} />
              <HStack gap="1.5">
                {currentTopic.tags.map((tag) => (
                  <Badge
                    key={tag}
                    fontSize="9px"
                    px="1.5"
                    py="0"
                    borderRadius="md"
                    bg="bg.muted"
                    color="fg.muted"
                    fontWeight="500"
                  >
                    {tag}
                  </Badge>
                ))}
              </HStack>
            </HStack>
          )}
          <HStack
            gap="2"
            px="3"
            py="2"
            borderRadius="lg"
            bg="bg.surface"
            border="1px solid"
            borderColor="border.default"
          >
            <Clock size={13} color="currentColor" style={{ opacity: 0.5 }} />
            <Text fontSize="xs" color="fg.muted">
              Updated{" "}
              {new Date(currentTopic.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </HStack>
        </HStack>

        {/* Pinned notes */}
        {pinned.length > 0 && (
          <Box mb="6">
            <Text
              fontSize="xs"
              fontWeight="700"
              color="fg.subtle"
              mb="3"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              Pinned
            </Text>
            <VStack gap="2" align="stretch">
              {pinned.map((note) => (
                <NoteRow
                  key={note.id}
                  note={note}
                  slug={slug}
                  onPin={() => handleTogglePin(note)}
                  onDelete={() => setDeletingNoteId(note.id)}
                  onMove={() => setMovingNote(note)}
                  onClick={() => router.push(`/topic/${slug}/${note.id}`)}
                />
              ))}
            </VStack>
          </Box>
        )}

        {/* All notes, grouped by folder */}
        <Box>
          {unpinned.length === 0 && pinned.length === 0 ? (
            <Flex
              direction="column"
              align="center"
              py="16"
              gap="3"
              border="1px dashed"
              borderColor="border.default"
              borderRadius="xl"
            >
              <Text fontSize="sm" color="fg.muted">
                No notes yet
              </Text>
              <Box
                as="button"
                px="3"
                py="1.5"
                borderRadius="lg"
                bg="bg.muted"
                color="fg.muted"
                fontSize="xs"
                fontWeight="500"
                display="flex"
                alignItems="center"
                gap="1.5"
                _hover={{ bg: "bg.subtle" }}
                transition="all 0.15s"
                onClick={() => openNewNoteModal("")}
              >
                <Plus size={13} /> Create first note
              </Box>
            </Flex>
          ) : (
            (() => {
              const tree = buildNoteTree(unpinned);
              return (
                <>
                  {(tree.notes.length > 0 || tree.folders.length === 0) && (
                    <Box mb="6">
                      <Text
                        fontSize="xs"
                        fontWeight="700"
                        color="fg.subtle"
                        mb="3"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                      >
                        Notes ({tree.notes.length})
                      </Text>
                      <VStack gap="2" align="stretch">
                        {tree.notes.map((note) => (
                          <NoteRow
                            key={note.id}
                            note={note}
                            slug={slug}
                            onPin={() => handleTogglePin(note)}
                            onDelete={() => setDeletingNoteId(note.id)}
                            onMove={() => setMovingNote(note)}
                            onClick={() =>
                              router.push(`/topic/${slug}/${note.id}`)
                            }
                          />
                        ))}
                        <AddNoteRow onClick={() => openNewNoteModal("")} />
                      </VStack>
                    </Box>
                  )}
                  {tree.folders.map((folder) => (
                    <FolderSection
                      key={folder.path}
                      folder={folder}
                      slug={slug}
                      depth={0}
                      onPin={handleTogglePin}
                      onDelete={(id) => setDeletingNoteId(id)}
                      onMove={setMovingNote}
                      onOpen={(id) => router.push(`/topic/${slug}/${id}`)}
                      onAddNote={openNewNoteModal}
                    />
                  ))}
                </>
              );
            })()
          )}
        </Box>
      </Box>

      <ConfirmDialog
        open={!!deletingNoteId}
        title="Delete note"
        description="This note will be permanently deleted."
        confirmLabel="Delete note"
        onConfirm={handleDeleteNote}
        onCancel={() => setDeletingNoteId(null)}
      />

      <ConfirmDialog
        open={confirmDeleteTopic}
        title="Delete topic"
        description={`"${currentTopic.name}" and all its notes will be permanently deleted.`}
        confirmLabel="Delete topic"
        onConfirm={handleDeleteTopic}
        onCancel={() => setConfirmDeleteTopic(false)}
      />
    </Box>
  );
}

function NoteRow({
  note,
  // slug: _slug,
  onPin,
  onDelete,
  onMove,
  onClick,
}: {
  note: NoteMeta;
  slug: string;
  onPin: () => void;
  onDelete: () => void;
  onMove: () => void;
  onClick: () => void;
}) {
  const cfg = NOTE_TYPE_CONFIG[note.type];
  const NoteIcon = cfg.icon;
  const date = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Flex
      p="3.5"
      borderRadius="xl"
      bg="bg.surface"
      border="1px solid"
      borderColor="border.default"
      align="center"
      gap="3"
      cursor="pointer"
      role="group"
      _hover={{ borderColor: "border.muted", bg: "bg.muted" }}
      transition="all 0.15s"
      onClick={onClick}
    >
      <Box
        w="8"
        h="8"
        borderRadius="md"
        flexShrink={0}
        bg={`${cfg.color}18`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <NoteIcon size={15} color={cfg.color} />
      </Box>

      <Box flex="1" minW="0">
        <HStack gap="2">
          <Text fontSize="sm" fontWeight="500" color="fg.default" truncate>
            {note.title}
          </Text>
          {note.pinned && <Pin size={11} color="#F59E0B" />}
        </HStack>
        <HStack gap="2" mt="0.5">
          <Badge
            fontSize="9px"
            px="1.5"
            py="0"
            borderRadius="full"
            fontWeight="600"
            bg={`${cfg.color}18`}
            color={cfg.color}
          >
            {cfg.label}
          </Badge>
          {note.tags.map((tag) => (
            <Badge
              key={tag}
              fontSize="9px"
              px="1.5"
              py="0"
              borderRadius="full"
              bg="bg.muted"
              color="fg.subtle"
              fontWeight="500"
            >
              {tag}
            </Badge>
          ))}
        </HStack>
      </Box>

      <HStack gap="1" color="fg.subtle">
        <Clock size={11} />
        <Text fontSize="xs">{date}</Text>
      </HStack>

      <HStack
        gap="1"
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.15s"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          aria-label="pin"
          size="xs"
          variant="ghost"
          color={note.pinned ? "yellow.400" : "fg.subtle"}
          _hover={{ color: "yellow.400" }}
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
        >
          <Pin size={13} />
        </IconButton>
        <IconButton
          aria-label="move"
          size="xs"
          variant="ghost"
          color="fg.subtle"
          _hover={{ color: "fg.default" }}
          onClick={(e) => {
            e.stopPropagation();
            onMove();
          }}
        >
          <FolderInput size={13} />
        </IconButton>
        <IconButton
          aria-label="delete"
          size="xs"
          variant="ghost"
          color="fg.subtle"
          _hover={{ color: "red.400" }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 size={13} />
        </IconButton>
      </HStack>
    </Flex>
  );
}

function AddNoteRow({ onClick }: { onClick: () => void }) {
  return (
    <Flex
      p="2.5"
      borderRadius="lg"
      border="1px dashed"
      borderColor="border.default"
      align="center"
      gap="2"
      cursor="pointer"
      color="fg.subtle"
      _hover={{ borderColor: "border.muted", color: "fg.muted" }}
      transition="all 0.15s"
      onClick={onClick}
    >
      <Plus size={13} />
      <Text fontSize="xs">New note</Text>
    </Flex>
  );
}

function FolderSection({
  folder,
  slug,
  depth,
  onPin,
  onDelete,
  onMove,
  onOpen,
  onAddNote,
}: {
  folder: NoteTreeFolder;
  slug: string;
  depth: number;
  onPin: (note: NoteMeta) => void;
  onDelete: (id: string) => void;
  onMove: (note: NoteMeta) => void;
  onOpen: (id: string) => void;
  onAddNote: (folder: string) => void;
}) {
  return (
    <Box
      mb="6"
      pl={depth > 0 ? "5" : "0"}
      borderLeft={depth > 0 ? "2px solid" : undefined}
      borderColor={depth > 0 ? "border.default" : undefined}
    >
      <HStack mb="3" gap="1.5">
        <Folder size={13} color="currentColor" style={{ opacity: 0.6 }} />
        <Text
          fontSize="xs"
          fontWeight="700"
          color="fg.subtle"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          {folder.name} ({folder.notes.length})
        </Text>
      </HStack>
      <VStack gap="2" align="stretch" mb="3">
        {folder.notes.map((note) => (
          <NoteRow
            key={note.id}
            note={note}
            slug={slug}
            onPin={() => onPin(note)}
            onDelete={() => onDelete(note.id)}
            onMove={() => onMove(note)}
            onClick={() => onOpen(note.id)}
          />
        ))}
        <AddNoteRow onClick={() => onAddNote(folder.path)} />
      </VStack>
      {folder.folders.map((f) => (
        <FolderSection
          key={f.path}
          folder={f}
          slug={slug}
          depth={depth + 1}
          onPin={onPin}
          onDelete={onDelete}
          onMove={onMove}
          onOpen={onOpen}
          onAddNote={onAddNote}
        />
      ))}
    </Box>
  );
}
