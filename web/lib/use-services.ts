"use client";

import { useCallback, useEffect, useState } from "react";

export type ServiceRow = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  priceEur: number;
};

type NewService = {
  name: string;
  description: string;
  durationMin: number;
  priceEur: number;
};

export function useServices() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("load failed");
      const data = await res.json();
      setServices(data.services ?? []);
      setError(null);
    } catch {
      setError("Грешка при зареждане на услугите.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addService(input: NewService): Promise<boolean> {
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Грешка при запазване.");
      return false;
    }
    setServices((prev) => [...prev, data.service]);
    return true;
  }

  async function updateService(
    id: string,
    patch: NewService
  ): Promise<boolean> {
    const res = await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Грешка при обновяване.");
      return false;
    }
    setServices((prev) => prev.map((s) => (s.id === id ? data.service : s)));
    return true;
  }

  async function removeService(id: string): Promise<void> {
    setServices((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/services/${id}`, { method: "DELETE" });
  }

  return { services, loading, error, addService, updateService, removeService };
}
