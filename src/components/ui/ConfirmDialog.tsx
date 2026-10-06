"use client";

import { useState } from "react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { Loader } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  danger = true,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={(d) => { if (!d.open && !loading) onCancel(); }}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent
          bg="bg.surface"
          border="1px solid"
          borderColor="border.muted"
          borderRadius="xl"
          boxShadow="0 25px 60px rgba(0,0,0,0.25)"
          maxW="420px"
          mx="4"
        >
          <DialogHeader pb="0">
            <DialogTitle>
              <Text fontSize="md" fontWeight="700" color="fg.default">
                {title}
              </Text>
            </DialogTitle>
          </DialogHeader>
          <DialogBody py="3">
            <DialogDescription>
              <Text fontSize="sm" color="fg.muted">
                {description}
              </Text>
            </DialogDescription>
          </DialogBody>
          <DialogFooter pt="0" gap="2">
            <Box
              as="button"
              px="4"
              py="2"
              borderRadius="lg"
              bg="bg.muted"
              color="fg.muted"
              fontSize="sm"
              fontWeight="500"
              border="1px solid"
              borderColor="border.default"
              _hover={{ bg: loading ? "bg.muted" : "bg.subtle" }}
              transition="all 0.15s"
              onClick={onCancel}
              aria-disabled={loading}
              opacity={loading ? 0.5 : 1}
              cursor={loading ? "not-allowed" : "pointer"}
            >
              Cancel
            </Box>
            <Box
              as="button"
              px="4"
              py="2"
              borderRadius="lg"
              bg={danger ? "red.600" : "green.600"}
              color="white"
              fontSize="sm"
              fontWeight="600"
              display="flex"
              alignItems="center"
              gap="1.5"
              _hover={{ bg: loading ? (danger ? "red.600" : "green.600") : (danger ? "red.500" : "green.500") }}
              transition="all 0.15s"
              onClick={handleConfirm}
              aria-disabled={loading}
              opacity={loading ? 0.7 : 1}
              cursor={loading ? "not-allowed" : "pointer"}
            >
              {loading && <Loader size={12} className="animate-spin" />}
              {confirmLabel}
            </Box>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
