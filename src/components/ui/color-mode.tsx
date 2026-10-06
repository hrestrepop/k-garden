"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ColorMode = "light" | "dark";

const ColorModeContext = createContext<{
  colorMode: ColorMode;
  toggleColorMode: () => void;
}>({ colorMode: "dark", toggleColorMode: () => {} });

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("color-mode") as ColorMode | null;
    const initial = stored ?? "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColorMode(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleColorMode = () => {
    setColorMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("color-mode", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext);
