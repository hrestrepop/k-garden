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
  Sprout,
  ArrowRight,
  Clock,
  Tag,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { LEVEL_CONFIG } from "@/types";
import type { TopicMeta, TopicLevel } from "@/types";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import KGardenMark from "@/components/ui/KGardenMark";

export default function Dashboard() {
  const router = useRouter();
  const {
    topics,
    setTopics,
    setNewTopicModalOpen,
    setEditTopicModalOpen,
    setCurrentTopic,
    topicsLoading,
    setTopicsLoading,
  } = useAppStore();

  const [deletingTopic, setDeletingTopic] = useState<TopicMeta | null>(null);
  const [levelFilter, setLevelFilter] = useState<TopicLevel | null>(null);

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

  const handleEdit = (e: React.MouseEvent, topic: TopicMeta) => {
    e.stopPropagation();
    setCurrentTopic(topic);
    setEditTopicModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTopic) return;
    await fetch(`/api/topics/${deletingTopic.slug}`, { method: "DELETE" });
    setTopics(topics.filter((t) => t.slug !== deletingTopic.slug));
    setDeletingTopic(null);
  };

  const visible = levelFilter
    ? topics.filter((t) => t.level === levelFilter)
    : topics;

  return (
    <Box minH="100vh" maxW="1200px" px="8" py="8" mx="auto">
      {/* Header */}
      <Flex justify="space-between" align="flex-start" mb="10">
        <HStack gap="3" align="center">
          <KGardenMark size={36} />
          <Box>
            <Text
              fontSize="3xl"
              fontWeight="800"
              color="fg.default"
              letterSpacing="-0.03em"
            >
              K-Garden
            </Text>
            <Text fontSize="sm" color="fg.muted" mt="1">
              Cultivate what you know.
            </Text>
          </Box>
        </HStack>
        <Box
          as="button"
          px="4"
          py="2"
          borderRadius="lg"
          bg="green.600"
          color="white"
          fontWeight="600"
          fontSize="sm"
          display="flex"
          alignItems="center"
          gap="2"
          _hover={{ bg: "green.500" }}
          transition="all 0.15s"
          onClick={() => setNewTopicModalOpen(true)}
        >
          <Plus size={16} /> New Topic
        </Box>
      </Flex>

      {/* Level filter pills */}
      <HStack gap="2" mb="8" flexWrap="wrap">
        <HStack
          px="3"
          py="1.5"
          borderRadius="lg"
          gap="2"
          bg={levelFilter === null ? "bg.muted" : "bg.surface"}
          border="1px solid"
          borderColor={levelFilter === null ? "border.muted" : "border.default"}
          cursor="pointer"
          onClick={() => setLevelFilter(null)}
        >
          <Text fontSize="xs" color="fg.muted">
            All
          </Text>
          <Text fontSize="xs" fontWeight="700" color="fg.default">
            {topics.length}
          </Text>
        </HStack>
        {Object.entries(LEVEL_CONFIG).map(([key, cfg]) => {
          const count = topics.filter((t) => t.level === key).length;
          const active = levelFilter === key;
          return (
            <HStack
              key={key}
              px="3"
              py="1.5"
              borderRadius="lg"
              gap="2"
              bg={active ? "bg.muted" : "bg.surface"}
              border="1px solid"
              borderColor={active ? "border.muted" : "border.default"}
              cursor="pointer"
              onClick={() =>
                setLevelFilter(active ? null : (key as TopicLevel))
              }
            >
              <Text fontSize="sm">{cfg.icon}</Text>
              <Text fontSize="xs" color="fg.muted">
                {cfg.label}
              </Text>
              <Text fontSize="xs" fontWeight="700" color="fg.default">
                {count}
              </Text>
            </HStack>
          );
        })}
      </HStack>

      {/* Loading skeletons */}
      {topicsLoading && (
        <VStack gap="2" align="stretch">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="66px" borderRadius="xl" />
          ))}
        </VStack>
      )}

      {/* Topics list */}
      {!topicsLoading && visible.length > 0 && (
        <VStack gap="2" align="stretch">
          {visible.map((t) => (
            <TopicRow
              key={t.slug}
              topic={t}
              onEdit={(e) => handleEdit(e, t)}
              onDelete={(e) => {
                e.stopPropagation();
                setDeletingTopic(t);
              }}
              onClick={() => router.push(`/topic/${t.slug}`)}
            />
          ))}
        </VStack>
      )}

      {/* Empty state */}
      {!topicsLoading && topics.length === 0 && (
        <Flex direction="column" align="center" py="20" gap="4">
          <Box
            p="5"
            borderRadius="2xl"
            bg="bg.surface"
            _dark={{ bg: "gray.900" }}
            border="1px dashed"
            borderColor="border.muted"
          >
            <Sprout size={36} color="#10B981" />
          </Box>
          <Text fontSize="lg" fontWeight="600" color="fg.default">
            Plant your first topic
          </Text>
          <Text fontSize="sm" color="fg.muted" textAlign="center" maxW="320px">
            Create a topic for anything you want to learn or keep notes on —
            math, ML, code, whatever you&apos;re cultivating.
          </Text>
          <Box
            as="button"
            px="4"
            py="2"
            borderRadius="lg"
            bg="bg.surface"
            _dark={{ bg: "gray.900" }}
            color="fg.default"
            fontSize="sm"
            fontWeight="500"
            border="1px solid"
            borderColor="border.muted"
            display="flex"
            alignItems="center"
            gap="2"
            _hover={{ borderColor: "green.500" }}
            transition="all 0.15s"
            onClick={() => setNewTopicModalOpen(true)}
          >
            <Plus size={15} /> Create Topic
          </Box>
        </Flex>
      )}

      {!topicsLoading && topics.length > 0 && visible.length === 0 && (
        <Flex direction="column" align="center" py="16" gap="2">
          <Text fontSize="sm" color="fg.muted">
            No topics at this level yet.
          </Text>
        </Flex>
      )}

      <ConfirmDialog
        open={!!deletingTopic}
        title="Delete topic"
        description={`"${deletingTopic?.name}" and all its notes will be permanently deleted.`}
        confirmLabel="Delete topic"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTopic(null)}
      />
    </Box>
  );
}

function TopicRow({
  topic,
  onEdit,
  onDelete,
  onClick,
}: {
  topic: TopicMeta;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const cfg = LEVEL_CONFIG[topic.level];
  const date = new Date(topic.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Flex
      p="4"
      borderRadius="xl"
      bg="bg.surface"
      _dark={{ bg: "gray.900" }}
      border="1px solid"
      borderColor="border.default"
      align="center"
      gap="4"
      cursor="pointer"
      role="group"
      _hover={{ borderColor: "border.muted", bg: "bg.muted" }}
      transition="all 0.15s"
      onClick={onClick}
    >
      <Box w="3" h="3" borderRadius="full" bg={topic.color} flexShrink={0} />
      <Box flex="1" minW="0">
        <HStack gap="2" mb="0.5">
          <Text fontSize="sm" fontWeight="600" color="fg.default" truncate>
            {topic.name}
          </Text>
          <Badge
            fontSize="9px"
            px="2"
            py="0"
            borderRadius="full"
            fontWeight="600"
            bg={`${cfg.color}20`}
            color={cfg.color}
          >
            {cfg.label}
          </Badge>
        </HStack>
        {topic.description && (
          <Text fontSize="xs" color="fg.muted" truncate>
            {topic.description}
          </Text>
        )}
      </Box>
      <HStack gap="4" flexShrink={0}>
        {topic.tags.length > 0 && (
          <HStack gap="1">
            <Tag size={12} color="currentColor" style={{ opacity: 0.5 }} />
            <Text fontSize="xs" color="fg.muted">
              {topic.tags.slice(0, 2).join(", ")}
              {topic.tags.length > 2 ? ` +${topic.tags.length - 2}` : ""}
            </Text>
          </HStack>
        )}
        <HStack gap="1">
          <Clock size={12} color="currentColor" style={{ opacity: 0.5 }} />
          <Text fontSize="xs" color="fg.muted">
            {date}
          </Text>
        </HStack>
      </HStack>

      <HStack
        gap="0.5"
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.15s"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          aria-label="edit topic"
          size="xs"
          variant="ghost"
          color="fg.subtle"
          _hover={{ color: "fg.default" }}
          onClick={onEdit}
        >
          <Pencil size={13} />
        </IconButton>
        <IconButton
          aria-label="delete topic"
          size="xs"
          variant="ghost"
          color="fg.subtle"
          _hover={{ color: "red.400" }}
          onClick={onDelete}
        >
          <Trash2 size={13} />
        </IconButton>
      </HStack>

      <Box
        color="fg.subtle"
        _groupHover={{ color: "fg.muted" }}
        transition="color 0.15s"
      >
        <ArrowRight size={16} />
      </Box>
    </Flex>
  );
}
