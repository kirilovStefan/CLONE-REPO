"use client";

export type Currency = "EUR" | "BGN" | "USD" | "GBP";

const STORAGE_KEY = "barberos-currency";
const SECONDARY_KEY = "barberos-show-bgn-secondary";

export const CURRENCIES: {
  code: Currency;
  symbol: string;
  nativeLabel: string;
  flag: string;
}[] = [
  { code: "EUR", symbol: "€", nativeLabel: "Euro", flag: "🇪🇺" },
  { code: "BGN", symbol: "лв", nativeLabel: "Български лев", flag: "🇧🇬" },
  { code: "USD", symbol: "$", nativeLabel: "US Dollar", flag: "🇺🇸" },
  { code: "GBP", symbol: "£", nativeLabel: "British Pound", flag: "🇬🇧" },
];

// EUR is the base for stored prices. Fixed BG rate by law; others approximate.
export const RATES: Record<Currency, number> = {
  EUR: 1,
  BGN: 1.95583,
  USD: 1.08,
  GBP: 0.86,
};

const SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  BGN: "лв",
  USD: "$",
  GBP: "£",
};

export function loadCurrency(): Currency {
  if (typeof window === "undefined") return "EUR";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (
      stored === "EUR" ||
      stored === "BGN" ||
      stored === "USD" ||
      stored === "GBP"
    )
      return stored;
  } catch {
    // ignore
  }
  return "EUR";
}

export function saveCurrency(c: Currency): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, c);
  } catch {
    // ignore
  }
}

export function loadSecondary(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(SECONDARY_KEY);
    if (stored === "false") return false;
  } catch {
    // ignore
  }
  return true;
}

export function saveSecondary(v: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SECONDARY_KEY, v ? "true" : "false");
  } catch {
    // ignore
  }
}

function formatSingle(amountEur: number, currency: Currency): string {
  const converted = amountEur * RATES[currency];
  const fractionDigits =
    Math.abs(converted - Math.round(converted)) < 0.005 ? 0 : 2;
  const formatted = converted.toLocaleString("en-GB", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  const symbol = SYMBOLS[currency];
  if (currency === "BGN") return `${formatted} ${symbol}`;
  return `${symbol}${formatted}`;
}

export function formatPrice(
  amountEur: number,
  currency: Currency,
  options?: { showSecondary?: boolean }
): string {
  const main = formatSingle(amountEur, currency);
  if (options?.showSecondary && currency === "EUR") {
    const bgn = formatSingle(amountEur, "BGN");
    return `${main} (${bgn})`;
  }
  if (options?.showSecondary && currency === "BGN") {
    const eur = formatSingle(amountEur, "EUR");
    return `${main} (${eur})`;
  }
  return main;
}
