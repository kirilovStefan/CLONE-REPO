"use client";

import { useCallback, useEffect, useState } from "react";
import type { Client } from "./mock-data";

type NewClient = Omit<Client, "id" | "createdAt">;

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setClients(data.clients ?? []);
      setError(null);
    } catch {
      setError("Грешка при зареждане на клиентите.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addClient(input: NewClient): Promise<boolean> {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Грешка при запазване.");
      return false;
    }
    setClients((prev) => [data.client, ...prev]);
    return true;
  }

  async function updateClient(
    id: string,
    patch: NewClient
  ): Promise<boolean> {
    const res = await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Грешка при обновяване.");
      return false;
    }
    setClients((prev) => prev.map((c) => (c.id === id ? data.client : c)));
    return true;
  }

  async function removeClient(id: string): Promise<void> {
    setClients((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
  }

  return { clients, loading, error, addClient, updateClient, removeClient };
}
