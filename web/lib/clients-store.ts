"use client";

import type { Appointment, Client } from "./mock-data";

const STORAGE_KEY = "barberos-clients";

export function loadClients(): Client[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as Client[];
  } catch {
    return null;
  }
}

export function saveClients(items: Client[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function seedClientsFromAppointments(
  appointments: Appointment[]
): Client[] {
  const byPhone = new Map<string, Client>();
  let counter = 0;
  for (const a of appointments) {
    const phone = a.clientPhone?.trim();
    if (!phone) continue;
    if (byPhone.has(phone)) continue;
    const parts = a.clientName.trim().split(/\s+/);
    const firstName = parts[0] ?? "";
    const lastName = parts.slice(1).join(" ");
    byPhone.set(phone, {
      id: `c-seed-${counter++}`,
      firstName,
      lastName,
      phone,
      email: a.clientEmail,
      createdAt: new Date(a.startsAt).toISOString(),
    });
  }
  return Array.from(byPhone.values());
}
