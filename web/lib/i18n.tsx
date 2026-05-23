"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type TranslationKey } from "./translations";

export type Locale = "bg" | "en";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  localeTag: string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "barberos-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>("bg");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "bg" || stored === "en") {
        setLocaleRaw(stored);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  function setLocale(l: Locale) {
    setLocaleRaw(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }

  function t(
    key: TranslationKey,
    vars?: Record<string, string | number>
  ): string {
    const entry = translations[key];
    if (!entry) return key;
    let str: string = entry[locale] ?? entry.bg ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  }

  const localeTag = locale === "en" ? "en-GB" : "bg-BG";

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, localeTag }}>
      {loaded ? children : null}
    </I18nContext.Provider>
  );
}

export function useT(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useT must be used within I18nProvider");
  }
  return ctx;
}
