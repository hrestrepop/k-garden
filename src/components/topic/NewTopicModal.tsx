"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Flex,
  Text,
  Input,
  Textarea,
  IconButton,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { LEVEL_CONFIG } from "@/types";
import type { TopicLevel } from "@/types";

const COLORS = [
  "#10B981",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#06B6D4",
  "#3B82F6",
];

export default function NewTopicModal() {
  const router = useRouter();
  const {
    newTopicModalOpen,
    setNewTopicModalOpen,
    editTopicModalOpen,
    setEditTopicModalOpen,
    currentTopic,
    setCurrentTopic,
    topics,
    setTopics,
  } = useAppStore();

  const isEdit = editTopicModalOpen;
  const open = newTopicModalOpen || editTopicModalOpen;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<TopicLevel>("exploring");
  const [color, setColor] = useState("#10B981");
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName("");
    setDescription("");
    setLevel("exploring");
    setColor("#10B981");
    setTagsInput("");
  };

  const close = () => {
    if (isEdit) {
      setEditTopicModalOpen(false);
    } else {
      setNewTopicModalOpen(false);
    }
  };

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- syncing form fields
       to the topic being edited when the modal opens is the intended effect */
    if (isEdit && currentTopic) {
      setName(currentTopic.name);
      setDescription(currentTopic.description);
      setLevel(currentTopic.level);
      setColor(currentTopic.color);
      setTagsInput(currentTopic.tags.join(", "));
    } else if (!isEdit) {
      reset();
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, open]);

  if (!open) return null;

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const body = { name, description, level, color, tags };

      if (isEdit && currentTopic) {
        const res = await fetch(`/api/topics/${currentTopic.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const updated = await res.json();
        setTopics(topics.map((t) => (t.slug === updated.slug ? updated : t)));
        setCurrentTopic(updated);
        setEditTopicModalOpen(false);
      } else {
        const res = await fetch("/api/topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const topic = await res.json();
        setTopics([topic, ...topics]);
        setNewTopicModalOpen(false);
        reset();
        router.push(`/topic/${topic.slug}`);
      }
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
        maxW="520px"
        mx="4"
        p="6"
        boxShadow="0 25px 60px rgba(0,0,0,0.25)"
      >
        <Flex justify="space-between" align="center" mb="5">
          <Text fontSize="lg" fontWeight="700" color="fg.default">
            {isEdit ? "Edit Topic" : "New Topic"}
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
              Topic Name *
            </Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Linear Algebra"
              bg="bg.muted"
              border="1px solid"
              borderColor="border.default"
              color="fg.default"
              fontSize="sm"
              _placeholder={{ color: "fg.subtle" }}
              autoFocus
            />
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" mb="1.5">
              Description
            </Text>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              rows={2}
              bg="bg.muted"
              border="1px solid"
              borderColor="border.default"
              color="fg.default"
              fontSize="sm"
              _placeholder={{ color: "fg.subtle" }}
            />
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" mb="2">
              How well do you know it?
            </Text>
            <HStack gap="1" flexWrap="wrap">
              {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => (
                <Box
                  key={key}
                  as="button"
                  px="2.5"
                  py="1"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="500"
                  cursor="pointer"
                  transition="all 0.15s"
                  bg={level === key ? cfg.color : "bg.muted"}
                  color={level === key ? "white" : "fg.muted"}
                  border="1px solid"
                  borderColor={level === key ? cfg.color : "border.default"}
                  onClick={() => setLevel(key as TopicLevel)}
                >
                  {cfg.icon} {cfg.label}
                </Box>
              ))}
            </HStack>
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" mb="2">
              Color
            </Text>
            <HStack gap="2">
              {COLORS.map((c) => (
                <Box
                  key={c}
                  w="6"
                  h="6"
                  borderRadius="full"
                  bg={c}
                  cursor="pointer"
                  border="2px solid"
                  borderColor={color === c ? "fg.default" : "transparent"}
                  transition="all 0.15s"
                  _hover={{ transform: "scale(1.2)" }}
                  onClick={() => setColor(c)}
                />
              ))}
            </HStack>
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="600" color="fg.muted" mb="1.5">
              Tags (comma separated)
            </Text>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="math, ml, foundations"
              bg="bg.muted"
              border="1px solid"
              borderColor="border.default"
              color="fg.default"
              fontSize="sm"
              _placeholder={{ color: "fg.subtle" }}
            />
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
            opacity={loading || !name.trim() ? 0.5 : 1}
            _hover={{ bg: "green.500" }}
            transition="all 0.15s"
            onClick={handleSave}
          >
            {loading ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save Changes" : "Create Topic"}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
