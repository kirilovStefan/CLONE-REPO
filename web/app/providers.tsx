"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme-context";
import { CurrencyProvider } from "@/lib/currency-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CurrencyProvider>{children}</CurrencyProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
