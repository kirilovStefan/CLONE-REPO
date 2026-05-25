"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  products as seedProducts,
  todaysAppointments,
  type Barber,
  type Client,
  type Location,
  type Product,
  type TimeOffReason,
  type TimeOffRequest,
} from "./mock-data";
import { loadTimeOff, saveTimeOff } from "./time-off-store";
import { loadInventory, saveInventory } from "./inventory-store";
import {
  loadClients,
  saveClients,
  seedClientsFromAppointments,
} from "./clients-store";

export type ViewAs = "owner" | string;

type NewTimeOffInput = {
  barberId: string;
  startDate: string;
  endDate: string;
  reason: TimeOffReason;
  notes?: string;
};

type CalendarContextValue = {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  locations: Location[];
  currentLocationId: string;
  setCurrentLocationId: (id: string) => void;
  viewAs: ViewAs;
  setViewAs: (v: ViewAs) => void;
  timeOffRequests: TimeOffRequest[];
  addTimeOff: (input: NewTimeOffInput) => void;
  approveTimeOff: (id: string) => void;
  rejectTimeOff: (id: string) => void;
  cancelTimeOff: (id: string) => void;
  products: Product[];
  addProduct: (input: Omit<Product, "id">) => Product;
  updateProduct: (id: string, patch: Partial<Omit<Product, "id">>) => void;
  removeProduct: (id: string) => void;
  decrementProductStock: (id: string, by?: number) => boolean;
  incrementProductStock: (id: string, by?: number) => void;
  clients: Client[];
  addClient: (input: Omit<Client, "id" | "createdAt">) => Client;
  updateClient: (id: string, patch: Partial<Omit<Client, "id" | "createdAt">>) => void;
  removeClient: (id: string) => void;
  barbers: Barber[];
  addBarber: (input: Omit<Barber, "id">) => Promise<void>;
  updateBarber: (id: string, patch: Partial<Omit<Barber, "id">>) => Promise<void>;
  removeBarber: (id: string) => Promise<void>;
};

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocationId, setCurrentLocationIdRaw] = useState<string>("");
  const [viewAs, setViewAs] = useState<ViewAs>("owner");
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [timeOffLoaded, setTimeOffLoaded] = useState(false);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    setTimeOffRequests(loadTimeOff());
    setTimeOffLoaded(true);
    function onStorage(e: StorageEvent) {
      if (e.key === "barberos-time-off") setTimeOffRequests(loadTimeOff());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!timeOffLoaded) return;
    saveTimeOff(timeOffRequests);
  }, [timeOffRequests, timeOffLoaded]);

  useEffect(() => {
    const stored = loadInventory();
    if (stored && stored.length > 0) setProducts(stored);
    setProductsLoaded(true);
  }, []);

  useEffect(() => {
    if (!productsLoaded) return;
    saveInventory(products);
  }, [products, productsLoaded]);

  function addProduct(input: Omit<Product, "id">): Product {
    const id = `p-local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const product: Product = { ...input, id };
    setProducts((prev) => [...prev, product]);
    return product;
  }

  function updateProduct(id: string, patch: Partial<Omit<Product, "id">>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function decrementProductStock(id: string, by: number = 1): boolean {
    const product = products.find((p) => p.id === id);
    if (!product || product.stockQty < by) return false;
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQty: p.stockQty - by } : p))
    );
    return true;
  }

  function incrementProductStock(id: string, by: number = 1) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQty: p.stockQty + by } : p))
    );
  }

  useEffect(() => {
    const stored = loadClients();
    if (stored && stored.length > 0) {
      setClients(stored);
    } else {
      setClients(seedClientsFromAppointments(todaysAppointments));
    }
    setClientsLoaded(true);
  }, []);

  useEffect(() => {
    if (!clientsLoaded) return;
    saveClients(clients);
  }, [clients, clientsLoaded]);

  function addClient(input: Omit<Client, "id" | "createdAt">): Client {
    const client: Client = {
      ...input,
      id: `c-local-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [...prev, client]);
    return client;
  }

  function updateClient(
    id: string,
    patch: Partial<Omit<Client, "id" | "createdAt">>
  ) {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function removeClient(id: string) {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [locRes, barberRes] = await Promise.all([
          fetch("/api/locations"),
          fetch("/api/barbers"),
        ]);
        const locData = locRes.ok ? await locRes.json() : { locations: [] };
        const barberData = barberRes.ok ? await barberRes.json() : { barbers: [] };
        if (cancelled) return;
        setLocations(locData.locations ?? []);
        setBarbers(barberData.barbers ?? []);
      } catch {
        // leave empty on failure; UI shows the empty state
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Default the active location to the first one once locations arrive.
  useEffect(() => {
    if (locations.length === 0) return;
    setCurrentLocationIdRaw((prev) =>
      prev && locations.some((l) => l.id === prev) ? prev : locations[0].id
    );
  }, [locations]);

  async function addBarber(input: Omit<Barber, "id">): Promise<void> {
    const res = await fetch("/api/barbers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        title: input.title,
        locationId: input.locationId,
        workStart: input.workStart,
        workEnd: input.workEnd,
        specialties: input.specialties,
      }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setBarbers((prev) => [...prev, data.barber]);
  }

  async function updateBarber(
    id: string,
    patch: Partial<Omit<Barber, "id">>
  ): Promise<void> {
    const res = await fetch(`/api/barbers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return;
    const data = await res.json();
    setBarbers((prev) => prev.map((b) => (b.id === id ? data.barber : b)));
  }

  async function removeBarber(id: string): Promise<void> {
    setBarbers((prev) => prev.filter((b) => b.id !== id));
    await fetch(`/api/barbers/${id}`, { method: "DELETE" });
  }

  function setCurrentLocationId(id: string) {
    setCurrentLocationIdRaw(id);
    setViewAs("owner");
  }

  function addTimeOff(input: NewTimeOffInput) {
    const req: TimeOffRequest = {
      ...input,
      id: `to-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setTimeOffRequests((prev) => [...prev, req]);
  }

  function approveTimeOff(id: string) {
    setTimeOffRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "approved", decidedAt: new Date().toISOString() }
          : r
      )
    );
  }

  function rejectTimeOff(id: string) {
    setTimeOffRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "rejected", decidedAt: new Date().toISOString() }
          : r
      )
    );
  }

  function cancelTimeOff(id: string) {
    setTimeOffRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        locations,
        currentLocationId,
        setCurrentLocationId,
        viewAs,
        setViewAs,
        timeOffRequests,
        addTimeOff,
        approveTimeOff,
        rejectTimeOff,
        cancelTimeOff,
        products,
        addProduct,
        updateProduct,
        removeProduct,
        decrementProductStock,
        incrementProductStock,
        clients,
        addClient,
        updateClient,
        removeClient,
        barbers,
        addBarber,
        updateBarber,
        removeBarber,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return ctx;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function maskClientName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

export function dateToIsoDay(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getApprovedTimeOff(
  requests: TimeOffRequest[],
  barberId: string,
  date: Date
): TimeOffRequest | null {
  const dayStr = dateToIsoDay(date);
  return (
    requests.find(
      (r) =>
        r.status === "approved" &&
        r.barberId === barberId &&
        r.startDate <= dayStr &&
        r.endDate >= dayStr
    ) ?? null
  );
}
