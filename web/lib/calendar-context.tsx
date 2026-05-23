"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { locations } from "./mock-data";

export type ViewAs = "owner" | string;

type CalendarContextValue = {
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  currentLocationId: string;
  setCurrentLocationId: (id: string) => void;
  viewAs: ViewAs;
  setViewAs: (v: ViewAs) => void;
};

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [currentLocationId, setCurrentLocationIdRaw] = useState<string>(
    locations[0].id
  );
  const [viewAs, setViewAs] = useState<ViewAs>("owner");

  function setCurrentLocationId(id: string) {
    setCurrentLocationIdRaw(id);
    // Сменяме локация → връщаме се към собственик
    setViewAs("owner");
  }

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        currentLocationId,
        setCurrentLocationId,
        viewAs,
        setViewAs,
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
