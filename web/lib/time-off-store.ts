"use client";

import type { TimeOffRequest } from "./mock-data";

const STORAGE_KEY = "barberos-time-off";

export function loadTimeOff(): TimeOffRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as TimeOffRequest[];
  } catch {
    return [];
  }
}

export function saveTimeOff(items: TimeOffRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export const TIME_OFF_STORAGE_KEY = STORAGE_KEY;
