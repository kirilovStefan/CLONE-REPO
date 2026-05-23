"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loadTheme,
  saveTheme,
  resolveTheme,
  type ThemeMode,
} from "./theme-store";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  effective: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeRaw] = useState<ThemeMode>("dark");
  const [effective, setEffective] = useState<"light" | "dark">("dark");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadTheme();
    setModeRaw(stored);
    setEffective(resolveTheme(stored));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveTheme(mode);
    const eff = resolveTheme(mode);
    setEffective(eff);
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      if (eff === "light") {
        html.classList.add("light");
        html.classList.remove("dark");
      } else {
        html.classList.add("dark");
        html.classList.remove("light");
      }
    }
  }, [mode, loaded]);

  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function handler() {
      const eff = mq.matches ? "dark" : "light";
      setEffective(eff);
      if (typeof document !== "undefined") {
        const html = document.documentElement;
        if (eff === "light") {
          html.classList.add("light");
          html.classList.remove("dark");
        } else {
          html.classList.add("dark");
          html.classList.remove("light");
        }
      }
    }
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  function setMode(m: ThemeMode) {
    setModeRaw(m);
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, effective }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
