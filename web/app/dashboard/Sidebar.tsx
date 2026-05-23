"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useCalendar, isSameDay, startOfDay } from "@/lib/calendar-context";
import { locations } from "@/lib/mock-data";

type Item = {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  soon?: boolean;
};

const items: Item[] = [
  { href: "/dashboard", label: "Календар", icon: "📅" },
  { href: "/dashboard/reports", label: "Отчети", icon: "📊" },
  { href: "/dashboard/clients", label: "Клиенти", icon: "👥", soon: true },
  { href: "/dashboard/team", label: "Екип", icon: "✂️", soon: true, badge: "new" },
  { href: "/dashboard/services", label: "Услуги", icon: "🧾", soon: true },
  { href: "/dashboard/finance", label: "Финанси", icon: "💰", soon: true },
  { href: "/dashboard/inventory", label: "Стоки", icon: "📦", soon: true },
  { href: "/dashboard/settings", label: "Настройки", icon: "⚙️", soon: true },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-muted/40 bg-ink-soft md:flex">
      <BusinessHeader />
      <MiniCalendar />
      <Nav />
      <Footer />
    </aside>
  );
}

function BusinessHeader() {
  const { currentLocationId, setCurrentLocationId } = useCalendar();
  const [open, setOpen] = useState(false);
  const location = locations.find((l) => l.id === currentLocationId);

  return (
    <div className="relative border-b border-ink-muted/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-ink-muted/20"
      >
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent font-display text-xl font-bold text-ink"
          title="Качи лого (скоро)"
        >
          B
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base leading-tight">
            My Barbershop
          </p>
          <p className="truncate text-[10px] uppercase tracking-widest text-bone-dim">
            📍 {location?.name ?? "Изберете локация"}
          </p>
        </div>
        <span className="text-bone-dim">▾</span>
      </button>

      {open && (
        <div className="absolute inset-x-3 top-full z-30 mt-1 rounded-xl border border-ink-muted bg-ink-soft shadow-2xl">
          <div className="border-b border-ink-muted/30 px-3 py-2 text-[10px] uppercase tracking-widest text-bone-dim">
            Локации
          </div>
          {locations.map((loc) => {
            const isActive = loc.id === currentLocationId;
            return (
              <button
                key={loc.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setCurrentLocationId(loc.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition hover:bg-ink-muted/40 ${
                  isActive ? "bg-accent/10" : ""
                }`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-ink-muted/60 text-xs font-medium text-bone-dim">
                  {loc.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{loc.name}</p>
                  <p className="truncate text-[10px] text-bone-dim">
                    {loc.address}
                  </p>
                </div>
                {isActive && <span className="text-accent">✓</span>}
              </button>
            );
          })}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              alert("Скоро: добавяне на нова локация");
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-b-xl border-t border-ink-muted/40 px-3 py-2.5 text-left text-sm text-bone-dim transition hover:bg-ink-muted/40 hover:text-accent"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-ink-muted/30 text-bone-dim">
              +
            </span>
            Добави нова локация
          </button>
        </div>
      )}
    </div>
  );
}

function MiniCalendar() {
  const { selectedDate, setSelectedDate } = useCalendar();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const d = new Date(selectedDate);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const monthLabel = viewMonth.toLocaleDateString("bg-BG", {
    month: "long",
    year: "numeric",
  });

  // Build 6-week grid (Monday-first)
  const days = useMemo(() => {
    const firstOfMonth = new Date(viewMonth);
    const weekday = firstOfMonth.getDay(); // 0=Sun..6=Sat
    const startOffset = (weekday + 6) % 7; // Monday-first
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(firstOfMonth.getDate() - startOffset);

    const arr: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [viewMonth]);

  function goToPrevMonth() {
    const d = new Date(viewMonth);
    d.setMonth(viewMonth.getMonth() - 1);
    setViewMonth(d);
  }

  function goToNextMonth() {
    const d = new Date(viewMonth);
    d.setMonth(viewMonth.getMonth() + 1);
    setViewMonth(d);
  }

  function goToToday() {
    const d = new Date(today);
    d.setDate(1);
    setViewMonth(d);
    setSelectedDate(today);
  }

  return (
    <div className="border-b border-ink-muted/30 px-3 py-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="grid h-6 w-6 place-items-center rounded text-bone-dim transition hover:bg-ink-muted/40 hover:text-bone"
          aria-label="Предходен месец"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goToToday}
          className="text-xs font-medium capitalize text-bone transition hover:text-accent"
          title="Към днешен ден"
        >
          {monthLabel}
        </button>
        <button
          type="button"
          onClick={goToNextMonth}
          className="grid h-6 w-6 place-items-center rounded text-bone-dim transition hover:bg-ink-muted/40 hover:text-bone"
          aria-label="Следващ месец"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
          <span
            key={d}
            className="py-1 text-center text-[9px] uppercase tracking-wider text-bone-dim/70"
          >
            {d}
          </span>
        ))}
        {days.map((d) => {
          const isCurrentMonth = d.getMonth() === viewMonth.getMonth();
          const isToday = isSameDay(d, today);
          const isSelected = isSameDay(d, selectedDate);

          const baseClasses =
            "relative grid aspect-square place-items-center rounded text-xs transition";
          const textColor = !isCurrentMonth
            ? "text-bone-dim/30"
            : isToday
              ? "text-red-400 font-bold"
              : "text-bone";
          const selection = isSelected
            ? "ring-2 ring-accent"
            : "hover:bg-ink-muted/40";

          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => setSelectedDate(startOfDay(d))}
              className={`${baseClasses} ${textColor} ${selection}`}
            >
              <span>{d.getDate()}</span>
              {isToday && (
                <span className="absolute bottom-0.5 h-0.5 w-0.5 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.soon ? "#" : item.href}
            onClick={(e) => item.soon && e.preventDefault()}
            className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
              isActive
                ? "bg-accent/15 text-bone"
                : "text-bone-dim hover:bg-ink-muted/40 hover:text-bone"
            } ${item.soon ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <span className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </span>
            {item.badge && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink">
                {item.badge}
              </span>
            )}
            {item.soon && !item.badge && (
              <span className="text-[10px] uppercase tracking-wider text-bone-dim/60">
                скоро
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Footer() {
  return (
    <div className="border-t border-ink-muted/40 px-4 py-3 text-[11px] text-bone-dim">
      Демо режим — данните са локални
    </div>
  );
}
