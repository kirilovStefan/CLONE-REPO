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
    <header className="relative z-40 flex shrink-0 items-center justify-end gap-3 border-b border-ink-muted/40 bg-ink/95 px-6 py-2.5 backdrop-blur">
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
  const [passwordPrompt, setPasswordPrompt] = useState(false);

  const locationBarbers = barbers.filter(
    (b) => b.locationId === currentLocationId
  );
  const isOwner = viewAs === "owner";
  const currentBarber = barbers.find((b) => b.id === viewAs);
  const currentLabel = isOwner ? "Собственик" : currentBarber?.name ?? "?";

  function requestOwnerSwitch() {
    setOpen(false);
    if (isOwner) return;
    setPasswordPrompt(true);
  }

  function handlePasswordConfirm(password: string): boolean {
    if (password === "1234") {
      setViewAs("owner");
      setPasswordPrompt(false);
      return true;
    }
    return false;
  }

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
              requestOwnerSwitch();
            }}
            className={`flex w-full items-center gap-3 rounded-t-xl px-3 py-2.5 text-left transition hover:bg-ink-muted/40 ${
              isOwner ? "bg-accent/10" : ""
            }`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/30 text-lg">
              👑
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Собственик {!isOwner && "🔒"}
              </p>
              <p className="text-[11px] text-bone-dim">
                {isOwner
                  ? "Пълен достъп до всички локации и данни"
                  : "Изисква се парола"}
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

      {passwordPrompt && (
        <OwnerPasswordModal
          onClose={() => setPasswordPrompt(false)}
          onConfirm={handlePasswordConfirm}
        />
      )}
    </div>
  );
}

function OwnerPasswordModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (password: string) => boolean;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    if (!onConfirm(password)) {
      setError("Грешна парола. Опитай отново.");
      setPassword("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-ink-muted bg-ink-soft p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/20 text-2xl">
            🔒
          </span>
          <div>
            <h2 className="font-display text-xl">Достъп до собственик</h2>
            <p className="mt-1 text-sm text-bone-dim">
              Въведи парола, за да преминеш в изглед на собственика.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-bone-dim">
              Парола
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoFocus
              placeholder="••••"
              className={`mt-1.5 w-full rounded-xl border bg-ink px-4 py-2.5 text-sm text-bone placeholder:text-bone-dim/50 focus:outline-none ${
                error
                  ? "border-rose-500 focus:border-rose-400"
                  : "border-ink-muted focus:border-accent"
              }`}
            />
            {error ? (
              <p className="mt-1.5 text-xs text-rose-400">{error}</p>
            ) : (
              <p className="mt-1.5 text-[10px] italic text-bone-dim/70">
                Демо парола: <span className="font-mono">1234</span>
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={!password.trim()}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Влез
            </button>
          </div>
        </form>
      </div>
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
