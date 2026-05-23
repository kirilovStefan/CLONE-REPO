"use client";

import type { Barber } from "./mock-data";

const STORAGE_KEY = "barberos-team";

export function loadTeam(): Barber[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as Barber[];
  } catch {
    return null;
  }
}

export function saveTeam(items: Barber[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}
