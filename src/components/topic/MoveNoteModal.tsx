"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export default function MoveNoteModal() {
  const params = useParams();
  const { movingNote, setMovingNote, currentTopic, notes, setNotes } =
    useAppStore();
  const [folder, setFolder] = useState("");
  const [loading, setLoading] = useState(false);

  const slug = currentTopic?.slug || (params?.slug as string);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (movingNote) setFolder(movingNote.folder || "");
  }, [movingNote]);

  const close = () => setMovingNote(null);

  if (!movingNote || !slug) return null;

  const folderOptions = Array.from(
    new Set(
      notes
        .filter((n) => n.id !== movingNote.id)
        .map((n) => n.folder)
        .filter((f): f is string => !!f),
    ),
  ).sort();

  const handleMove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/topics/${slug}/notes/${movingNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: folder.trim() }),
      });
      const updated = await res.json();
      setNotes(
        notes.map((n) =>
          n.id === movingNote.id ? { ...n, folder: updated.folder } : n,
        ),
      );
      close();
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
        maxW="420px"
        mx="4"
        p="6"
        boxShadow="0 25px 60px rgba(0,0,0,0.25)"
      >
        <Flex justify="space-between" align="center" mb="5">
          <Box minW="0">
            <Text fontSize="lg" fontWeight="700" color="fg.default">
              Move Note
            </Text>
            <Text fontSize="xs" color="fg.muted" truncate>
              {movingNote.title}
            </Text>
          </Box>
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
              Folder
            </Text>
            <Input
              list="kg-move-folder-suggestions"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="e.g. Algorithms/Sorting — leave empty for topic root"
              bg="bg.muted"
              border="1px solid"
              borderColor="border.default"
              color="fg.default"
              fontSize="sm"
              _placeholder={{ color: "fg.subtle" }}
              onKeyDown={(e) => e.key === "Enter" && handleMove()}
              autoFocus
            />
            <datalist id="kg-move-folder-suggestions">
              {folderOptions.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
            <Text fontSize="10px" color="fg.subtle" mt="1.5">
              Use a slash to nest — e.g. &quot;Algorithms/Sorting&quot; creates
              Sorting inside Algorithms.
            </Text>
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
            opacity={loading ? 0.5 : 1}
            _hover={{ bg: "green.500" }}
            transition="all 0.15s"
            onClick={handleMove}
          >
            {loading ? "Moving..." : "Move Note"}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
