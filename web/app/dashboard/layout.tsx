"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { CalendarProvider, useCalendar } from "@/lib/calendar-context";
import { I18nProvider, useT, type Locale } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme-context";
import { type TimeOffRequest } from "@/lib/mock-data";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CalendarProvider>
          <div className="flex h-screen overflow-hidden bg-ink">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar />
              <div className="flex-1 overflow-hidden">{children}</div>
            </div>
          </div>
        </CalendarProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

function TopBar() {
  const { t } = useT();
  return (
    <header className="relative z-40 flex shrink-0 items-center justify-end gap-3 border-b border-ink-muted/40 bg-ink/95 px-6 py-2.5 backdrop-blur">
      <LanguageSwitcher />
      <NotificationBell />
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
        {t("top.toSite")}
      </Link>
      <UserAvatar />
    </header>
  );
}

function LanguageSwitcher() {
  const { locale, setLocale, t } = useT();
  const [open, setOpen] = useState(false);

  const languages: { code: Locale; flag: string; label: string }[] = [
    { code: "bg", flag: "🇧🇬", label: t("lang.bg") },
    { code: "en", flag: "🇬🇧", label: t("lang.en") },
  ];
  const current = languages.find((l) => l.code === locale) ?? languages[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex items-center gap-1.5 rounded-lg border border-ink-muted/60 px-2.5 py-1.5 text-sm transition hover:border-accent"
        title={t("lang.label")}
      >
        <span>{current.flag}</span>
        <span className="font-medium uppercase">{current.code}</span>
        <span className="text-bone-dim">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-ink-muted bg-ink-soft shadow-2xl">
          {languages.map((lang) => {
            const isActive = lang.code === locale;
            return (
              <button
                key={lang.code}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setLocale(lang.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-ink-muted/40 ${
                  isActive ? "bg-accent/10" : ""
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-sm">{lang.label}</span>
                {isActive && <span className="text-accent">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NotificationBell() {
  const {
    viewAs,
    timeOffRequests,
    approveTimeOff,
    rejectTimeOff,
    cancelTimeOff,
  } = useCalendar();
  const { t } = useT();
  const [open, setOpen] = useState(false);

  const isOwner = viewAs === "owner";
  const visible: TimeOffRequest[] = isOwner
    ? [...timeOffRequests].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;
        return b.createdAt.localeCompare(a.createdAt);
      })
    : timeOffRequests
        .filter((r) => r.barberId === viewAs)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const badgeCount = isOwner
    ? visible.filter((r) => r.status === "pending").length
    : visible.filter((r) => r.status === "pending").length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-ink-muted/60 text-base transition hover:border-accent"
        aria-label={t("bell.title")}
        title={t("bell.title")}
      >
        🔔
        {badgeCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {badgeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 overflow-hidden rounded-xl border border-ink-muted bg-ink-soft shadow-2xl">
          <div className="border-b border-ink-muted/40 px-3 py-2">
            <p className="text-xs uppercase tracking-widest text-bone-dim">
              {isOwner ? t("bell.ownerHeader") : t("bell.barberHeader")}
            </p>
          </div>
          {visible.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-bone-dim">
              {isOwner ? t("bell.empty.owner") : t("bell.empty.barber")}
            </p>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-ink-muted/40">
              {visible.map((req) => (
                <TimeOffRow
                  key={req.id}
                  request={req}
                  isOwner={isOwner}
                  onApprove={() => approveTimeOff(req.id)}
                  onReject={() => rejectTimeOff(req.id)}
                  onCancel={() => cancelTimeOff(req.id)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function TimeOffRow({
  request,
  isOwner,
  onApprove,
  onReject,
  onCancel,
}: {
  request: TimeOffRequest;
  isOwner: boolean;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
}) {
  const { t, localeTag } = useT();
  const { barbers } = useCalendar();
  const barber = barbers.find((b) => b.id === request.barberId);
  const initials = barber
    ? barber.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?";
  const startLabel = new Date(request.startDate).toLocaleDateString(localeTag, {
    day: "numeric",
    month: "short",
  });
  const endLabel = new Date(request.endDate).toLocaleDateString(localeTag, {
    day: "numeric",
    month: "short",
  });

  const statusBadge: Record<typeof request.status, { label: string; cls: string }> = {
    pending: {
      label: t("timeOff.status.pending"),
      cls: "bg-amber-500/30 text-amber-200 ring-1 ring-amber-400/60",
    },
    approved: {
      label: t("timeOff.status.approved"),
      cls: "bg-emerald-500/30 text-emerald-200 ring-1 ring-emerald-400/60",
    },
    rejected: {
      label: t("timeOff.status.rejected"),
      cls: "bg-rose-500/30 text-rose-200 ring-1 ring-rose-400/60",
    },
  };
  const sb = statusBadge[request.status];

  const reasonLabel = t(`timeOff.reason.${request.reason}` as const);

  return (
    <li className="px-3 py-3">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-medium text-accent">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{barber?.name ?? "?"}</p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${sb.cls}`}
            >
              {sb.label}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-bone-dim">
            {reasonLabel} · {startLabel} – {endLabel}
          </p>
          {request.notes && (
            <p className="mt-1 text-[11px] italic text-bone-dim/80">
              📝 {request.notes}
            </p>
          )}
        </div>
      </div>
      {isOwner && request.status === "pending" && (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onApprove();
            }}
            className="flex-1 rounded-md bg-emerald-500/20 px-2 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/30"
          >
            {t("bell.approve")}
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onReject();
            }}
            className="flex-1 rounded-md bg-rose-500/20 px-2 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-500/30"
          >
            {t("bell.reject")}
          </button>
        </div>
      )}
      {!isOwner && request.status === "pending" && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onCancel();
          }}
          className="mt-2 w-full rounded-md border border-ink-muted px-2 py-1.5 text-xs text-bone-dim transition hover:border-rose-400 hover:text-rose-300"
        >
          {t("bell.cancelRequest")}
        </button>
      )}
    </li>
  );
}

function ViewAsSelector() {
  const { viewAs, setViewAs, currentLocationId, barbers } = useCalendar();
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(false);

  const locationBarbers = barbers.filter(
    (b) => b.locationId === currentLocationId
  );
  const isOwner = viewAs === "owner";
  const currentBarber = barbers.find((b) => b.id === viewAs);
  const currentLabel = isOwner ? t("viewAs.owner") : currentBarber?.name ?? "?";

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
          {t("viewAs.label")}
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
                {t("viewAs.owner")} {!isOwner && "🔒"}
              </p>
              <p className="text-[11px] text-bone-dim">
                {isOwner
                  ? t("viewAs.ownerDescUnlocked")
                  : t("viewAs.ownerDescLocked")}
              </p>
            </div>
            {isOwner && <span className="text-accent">✓</span>}
          </button>
          <div className="border-t border-ink-muted/40 px-3 py-1.5 text-[10px] uppercase tracking-widest text-bone-dim">
            {t("viewAs.barbersHeader")}
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
  const { t } = useT();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    if (!onConfirm(password)) {
      setError(t("password.error"));
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
            <h2 className="font-display text-xl">{t("password.title")}</h2>
            <p className="mt-1 text-sm text-bone-dim">{t("password.subtitle")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-bone-dim">
              {t("password.field")}
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
                {t("password.hint")} <span className="font-mono">1234</span>
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
            >
              {t("password.cancel")}
            </button>
            <button
              type="submit"
              disabled={!password.trim()}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("password.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserAvatar() {
  const { viewAs, barbers } = useCalendar();
  const { t } = useT();
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
      title={
        isOwner
          ? t("viewAs.ownerBadge")
          : `${t("viewAs.barberBadge")}: ${barber?.name}`
      }
    >
      {initials}
    </div>
  );
}
