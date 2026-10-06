import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        "bg.canvas": { value: { base: "#F8FAFC", _dark: "#030712" } },
        "bg.surface": { value: { base: "#FFFFFF", _dark: "#111827" } },
        "bg.muted": { value: { base: "#F1F5F9", _dark: "#1F2937" } },
        "bg.subtle": { value: { base: "#E2E8F0", _dark: "#374151" } },

        "border.default": { value: { base: "#E2E8F0", _dark: "#1F2937" } },
        "border.muted": { value: { base: "#CBD5E1", _dark: "#374151" } },

        "fg.default": { value: { base: "#0F172A", _dark: "#F9FAFB" } },
        "fg.muted": { value: { base: "#475569", _dark: "#9CA3AF" } },
        "fg.subtle": { value: { base: "#94A3B8", _dark: "#6B7280" } },
        "fg.inverted": { value: { base: "#FFFFFF", _dark: "#FFFFFF" } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
