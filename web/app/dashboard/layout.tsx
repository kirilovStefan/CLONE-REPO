"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { CalendarProvider, useCalendar } from "@/lib/calendar-context";
import { barbers } from "@/lib/mock-data";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <CalendarProvider>
      <div className="flex h-screen overflow-hidden bg-ink">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </CalendarProvider>
  );
}

function TopBar() {
  return (
    <header className="flex shrink-0 items-center justify-end gap-3 border-b border-ink-muted/40 bg-ink/95 px-6 py-2.5 backdrop-blur">
      <ViewAsSelector />
      <span className="text-bone-dim/30">·</span>
      <Link
        href="/"
        className="font-display text-sm tracking-[0.2em] text-bone-dim/60 transition hover:text-bone"
      >
        BARBEROS
      </Link>
      <span className="text-bone-dim/30">·</span>
      <Link
        href="/"
        className="text-xs text-bone-dim transition hover:text-bone"
      >
        ← На сайта
      </Link>
      <UserAvatar />
    </header>
  );
}

function ViewAsSelector() {
  const { viewAs, setViewAs, currentLocationId } = useCalendar();
  const [open, setOpen] = useState(false);

  const locationBarbers = barbers.filter(
    (b) => b.locationId === currentLocationId
  );
  const isOwner = viewAs === "owner";
  const currentBarber = barbers.find((b) => b.id === viewAs);
  const currentLabel = isOwner ? "Собственик" : currentBarber?.name ?? "?";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition ${
          isOwner
            ? "border-ink-muted/60 hover:border-accent"
            : "border-emerald-500/60 bg-emerald-500/10"
        }`}
      >
        <span className="text-[10px] uppercase tracking-widest text-bone-dim">
          Гледай като
        </span>
        <span className="font-medium">{currentLabel}</span>
        <span className="text-bone-dim">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-xl border border-ink-muted bg-ink-soft shadow-2xl">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setViewAs("owner");
              setOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-t-xl px-3 py-2.5 text-left transition hover:bg-ink-muted/40 ${
              isOwner ? "bg-accent/10" : ""
            }`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/30 text-lg">
              👑
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">Собственик</p>
              <p className="text-[11px] text-bone-dim">
                Пълен достъп до всички локации и данни
              </p>
            </div>
            {isOwner && <span className="text-accent">✓</span>}
          </button>
          <div className="border-t border-ink-muted/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-bone-dim">
            Бръснари — само техния график
          </div>
          {locationBarbers.map((b) => {
            const isActive = viewAs === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setViewAs(b.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-ink-muted/40 ${
                  isActive ? "bg-accent/10" : ""
                }`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/20 text-xs font-medium text-accent">
                  {b.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.name}</p>
                  <p className="truncate text-[11px] text-bone-dim">
                    {b.title}
                  </p>
                </div>
                {isActive && <span className="text-accent">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UserAvatar() {
  const { viewAs } = useCalendar();
  const isOwner = viewAs === "owner";
  const barber = isOwner ? null : barbers.find((b) => b.id === viewAs);
  const initials = barber
    ? barber.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "МК";
  return (
    <div
      className={`grid h-8 w-8 place-items-center rounded-full text-sm font-medium ${
        isOwner
          ? "bg-accent/20 text-accent"
          : "bg-emerald-500/30 text-emerald-200 ring-1 ring-emerald-400/60"
      }`}
      title={isOwner ? "Собственик" : `Бръснар: ${barber?.name}`}
    >
      {initials}
    </div>
  );
}
