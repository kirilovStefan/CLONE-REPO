"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type TranslationKey } from "./translations";

export type Locale = "bg" | "en" | "tr" | "de" | "es" | "it" | "fr";

type I18nContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  localeTag: string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "barberos-locale";

const SUPPORTED: Locale[] = ["bg", "en", "tr", "de", "es", "it", "fr"];

export const LANGUAGES: {
  code: Locale;
  flag: string;
  nativeName: string;
}[] = [
  { code: "bg", flag: "🇧🇬", nativeName: "Български" },
  { code: "en", flag: "🇬🇧", nativeName: "English" },
  { code: "tr", flag: "🇹🇷", nativeName: "Türkçe" },
  { code: "de", flag: "🇩🇪", nativeName: "Deutsch" },
  { code: "es", flag: "🇪🇸", nativeName: "Español" },
  { code: "it", flag: "🇮🇹", nativeName: "Italiano" },
  { code: "fr", flag: "🇫🇷", nativeName: "Français" },
];

const LOCALE_TAGS: Record<Locale, string> = {
  bg: "bg-BG",
  en: "en-GB",
  tr: "tr-TR",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
  fr: "fr-FR",
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>("bg");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.includes(stored as Locale)) {
        setLocaleRaw(stored as Locale);
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
    const entry = translations[key] as
      | (Record<string, string | undefined> & { bg?: string; en?: string })
      | undefined;
    if (!entry) return key;
    const candidate = entry[locale] ?? entry.en ?? entry.bg ?? key;
    let str: string = candidate;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(`{${k}}`, String(v));
      }
    }
    return str;
  }

  const localeTag = LOCALE_TAGS[locale];

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

export function LanguageStrip() {
  const { locale, setLocale } = useT();
  return (
    <div className="border-b border-ink-muted/30 bg-ink-soft/40">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-1.5">
        {LANGUAGES.map((l) => {
          const active = l.code === locale;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs transition ${
                active
                  ? "bg-accent/15 text-bone ring-1 ring-accent/40"
                  : "text-bone-dim hover:bg-ink-muted/30 hover:text-bone"
              }`}
              title={l.nativeName}
            >
              <span className="text-sm leading-none">{l.flag}</span>
              <span className="font-medium">{l.nativeName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
