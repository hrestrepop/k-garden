"use client";

import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { useAppStore } from "@/store/app-store";
import NewTopicModal from "@/components/topic/NewTopicModal";
import NewNoteModal from "@/components/topic/NewNoteModal";
import MoveNoteModal from "@/components/topic/MoveNoteModal";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, sidebarWidth, lectureMode } = useAppStore();
  const railWidth = lectureMode ? 0 : sidebarOpen ? sidebarWidth : 48;
  return (
    <Flex minH="100vh" width="full">
      {!lectureMode && <Sidebar />}
      <Box
        flex="1"
        ml={`${railWidth}px`}
        transition="margin-left 0.2s"
        minH="100vh"
        bg="bg.canvas"
        _dark={{ bg: "gray.900" }}
      >
        {children}
      </Box>
      <NewTopicModal />
      <NewNoteModal />
      <MoveNoteModal />
    </Flex>
  );
}
