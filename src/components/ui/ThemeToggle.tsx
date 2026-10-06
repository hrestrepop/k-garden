"use client";

import { IconButton } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";
import { useColorMode } from "./color-mode";

export function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="toggle color mode"
      size="xs"
      variant="ghost"
      color="fg.muted"
      _hover={{ color: "fg.default", bg: "bg.muted" }}
      onClick={toggleColorMode}
    >
      {colorMode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </IconButton>
  );
}
