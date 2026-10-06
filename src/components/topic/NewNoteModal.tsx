"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { NOTE_TYPE_CONFIG } from "@/types";
import type { NoteType } from "@/types";

export default function NewNoteModal() {
  const router = useRouter();
  const params = useParams();
  const {
    newNoteModalOpen,
    setNewNoteModalOpen,
    newNoteFolder,
    setNewNoteFolder,
    currentTopic,
    notes,
    setNotes,
  } = useAppStore();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<NoteType>("general");
  const [folder, setFolder] = useState("");
  const [loading, setLoading] = useState(false);

  const slug = currentTopic?.slug || (params?.slug as string);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (newNoteModalOpen) setFolder(newNoteFolder);
  }, [newNoteModalOpen, newNoteFolder]);

  const close = () => {
    setNewNoteModalOpen(false);
    setNewNoteFolder("");
  };

  if (!newNoteModalOpen || !slug) return null;

  const folderOptions = Array.from(
    new Set(notes.map((n) => n.folder).filter((f): f is string => !!f)),
  ).sort();

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/topics/${slug}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          folder: folder.trim(),
          content: "",
          format: "blocknote",
        }),
      });
      const note = await res.json();
      setNotes([...notes, note]);
      setTitle("");
      setType("general");
      close();
      router.push(`/topic/${slug}/${note.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex="200"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="absolute"
        inset="0"
        bg="blackAlpha.700"
        backdropFilter="blur(4px)"
        onClick={close}
      />
      <Box
        position="relative"
        bg="bg.surface"
        border="1px solid"
        borderColor="border.muted"
        borderRadius="xl"
        w="full"
        maxW="460px"
        mx="4"
        p="6"
        boxShadow="0 25px 60px rgba(0,0,0,0.25)"
      >
        <Flex justify="space-between" align="center" mb="5">
          <Text fontSize="lg" fontWeight="700" color="fg.default">
            New Note
          </Text>
          <IconButton
            aria-label="close"
            size="sm"
            variant="ghost"
            color="fg.muted"
            onClick={close}
          >
            <X size={18} />
          </IconButton>
        </Flex>

        <VStack gap="4" align="stretch">
          <Box>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" mb="1.5">
              Title *
            </Text>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gradient Descent"
              bg="bg.muted"
              border="1px solid"
              borderColor="border.default"
              color="fg.default"
              fontSize="sm"
              _placeholder={{ color: "fg.subtle" }}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" mb="2">
              Type
            </Text>
            <HStack gap="1.5" flexWrap="wrap">
              {Object.entries(NOTE_TYPE_CONFIG).map(([key, cfg]) => {
                const TypeIcon = cfg.icon;
                return (
                  <Box
                    key={key}
                    as="button"
                    px="2.5"
                    py="1.5"
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="500"
                    cursor="pointer"
                    transition="all 0.15s"
                    bg={type === key ? `${cfg.color}18` : "bg.muted"}
                    color={type === key ? cfg.color : "fg.muted"}
                    border="1px solid"
                    borderColor={type === key ? cfg.color : "border.default"}
                    display="flex"
                    alignItems="center"
                    gap="1.5"
                    onClick={() => setType(key as NoteType)}
                  >
                    <TypeIcon size={12} />
                    {cfg.label}
                  </Box>
                );
              })}
            </HStack>
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" mb="1.5">
              Folder (optional)
            </Text>
            <Input
              list="kg-folder-suggestions"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="e.g. Data Structures, or Data Structures/Trees"
              bg="bg.muted"
              border="1px solid"
              borderColor="border.default"
              color="fg.default"
              fontSize="sm"
              _placeholder={{ color: "fg.subtle" }}
            />
            <datalist id="kg-folder-suggestions">
              {folderOptions.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </Box>

          <Box
            as="button"
            w="full"
            py="2.5"
            borderRadius="lg"
            bg="green.600"
            color="white"
            fontWeight="600"
            fontSize="sm"
            cursor="pointer"
            opacity={loading || !title.trim() ? 0.5 : 1}
            _hover={{ bg: "green.500" }}
            transition="all 0.15s"
            onClick={handleCreate}
          >
            {loading ? "Creating..." : "Create Note"}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
