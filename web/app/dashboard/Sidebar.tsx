"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useCalendar, isSameDay, startOfDay } from "@/lib/calendar-context";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { locations } from "@/lib/mock-data";
import type { TranslationKey } from "@/lib/translations";

type Item = {
  href: string;
  labelKey: TranslationKey;
  icon: string;
  badgeKey?: TranslationKey;
  soon?: boolean;
};

const items: Item[] = [
  { href: "/dashboard", labelKey: "nav.calendar", icon: "📅" },
  { href: "/dashboard/reports", labelKey: "nav.reports", icon: "📊" },
  { href: "/dashboard/clients", labelKey: "nav.clients", icon: "👥" },
  { href: "/dashboard/team", labelKey: "nav.team", icon: "✂️" },
  { href: "/dashboard/services", labelKey: "nav.services", icon: "🧾" },
  { href: "/dashboard/finance", labelKey: "nav.finance", icon: "💰", soon: true },
  { href: "/dashboard/inventory", labelKey: "nav.inventory", icon: "📦" },
  { href: "/dashboard/settings", labelKey: "nav.settings", icon: "⚙️" },
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
  const { t } = useT();
  const { organization } = useAuth();
  const [open, setOpen] = useState(false);
  const location = locations.find((l) => l.id === currentLocationId);
  const businessName = organization?.name ?? t("sidebar.businessName");

  return (
    <div className="relative border-b border-ink-muted/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-ink-muted/20"
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent font-display text-lg font-bold text-ink"
          title={t("sidebar.uploadLogo")}
        >
          B
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm leading-tight">
            {businessName}
          </p>
          <p className="truncate text-[10px] uppercase tracking-widest text-bone-dim">
            📍 {location?.name ?? t("sidebar.chooseLocation")}
          </p>
        </div>
        <span className="text-bone-dim">▾</span>
      </button>

      {open && (
        <div className="absolute inset-x-3 top-full z-30 mt-1 rounded-xl border border-ink-muted bg-ink-soft shadow-2xl">
          <div className="border-b border-ink-muted/30 px-3 py-2 text-[10px] uppercase tracking-widest text-bone-dim">
            {t("sidebar.locations")}
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
              alert(t("sidebar.addLocationSoon"));
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-b-xl border-t border-ink-muted/40 px-3 py-2.5 text-left text-sm text-bone-dim transition hover:bg-ink-muted/40 hover:text-accent"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-ink-muted/30 text-bone-dim">
              +
            </span>
            {t("sidebar.addLocation")}
          </button>
        </div>
      )}
    </div>
  );
}

function MiniCalendar() {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { t, localeTag } = useT();
  const today = useMemo(() => startOfDay(new Date()), []);

  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const d = new Date(selectedDate);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const monthLabel = viewMonth.toLocaleDateString(localeTag, {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => {
    const firstOfMonth = new Date(viewMonth);
    const weekday = firstOfMonth.getDay();
    const startOffset = (weekday + 6) % 7;
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

  // Generate localized weekday labels (Monday-first)
  const weekdayLabels = useMemo(() => {
    const labels: string[] = [];
    const ref = new Date(2024, 0, 1); // Monday Jan 1 2024
    for (let i = 0; i < 7; i++) {
      const d = new Date(ref);
      d.setDate(ref.getDate() + i);
      labels.push(d.toLocaleDateString(localeTag, { weekday: "short" }));
    }
    return labels;
  }, [localeTag]);

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
    <div className="border-b border-ink-muted/30 px-3 py-2">
      <div className="mb-1.5 flex items-center justify-between px-0.5">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="grid h-5 w-5 place-items-center rounded text-bone-dim transition hover:bg-ink-muted/40 hover:text-bone"
          aria-label={t("sidebar.prevMonth")}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goToToday}
          className="text-[11px] font-medium capitalize text-bone transition hover:text-accent"
          title={t("sidebar.gotoToday")}
        >
          {monthLabel}
        </button>
        <button
          type="button"
          onClick={goToNextMonth}
          className="grid h-5 w-5 place-items-center rounded text-bone-dim transition hover:bg-ink-muted/40 hover:text-bone"
          aria-label={t("sidebar.nextMonth")}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {weekdayLabels.map((d) => (
          <span
            key={d}
            className="text-center text-[8px] uppercase tracking-wider text-bone-dim/70"
          >
            {d}
          </span>
        ))}
        {days.map((d) => {
          const isCurrentMonth = d.getMonth() === viewMonth.getMonth();
          const isTodayDay = isSameDay(d, today);
          const isSelected = isSameDay(d, selectedDate);

          const baseClasses =
            "relative grid h-6 w-full place-items-center rounded text-[11px] transition";
          const textColor = !isCurrentMonth
            ? "text-bone-dim/30"
            : isTodayDay
              ? "text-red-400 font-bold"
              : "text-bone";
          const selection = isSelected
            ? "ring-1 ring-accent"
            : "hover:bg-ink-muted/40";

          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => setSelectedDate(startOfDay(d))}
              className={`${baseClasses} ${textColor} ${selection}`}
            >
              <span>{d.getDate()}</span>
              {isTodayDay && (
                <span className="absolute bottom-0 h-0.5 w-0.5 rounded-full bg-red-500" />
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
  const { t } = useT();
  const { products } = useCalendar();
  const lowStockCount = products.filter(
    (p) => p.stockQty <= p.lowStockThreshold
  ).length;
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-1.5">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        const showLowStockBadge =
          item.href === "/dashboard/inventory" && lowStockCount > 0;
        return (
          <Link
            key={item.href}
            href={item.soon ? "#" : item.href}
            onClick={(e) => item.soon && e.preventDefault()}
            className={`group flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition ${
              isActive
                ? "bg-accent/15 text-bone"
                : "text-bone-dim hover:bg-ink-muted/40 hover:text-bone"
            } ${item.soon ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <span className="flex items-center gap-2.5">
              <span className="text-sm">{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </span>
            {showLowStockBadge && (
              <span
                className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white"
                title={t("inventory.lowStockBanner", { count: lowStockCount })}
              >
                {lowStockCount}
              </span>
            )}
            {item.badgeKey && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink">
                {t(item.badgeKey)}
              </span>
            )}
            {item.soon && !item.badgeKey && (
              <span className="text-[10px] uppercase tracking-wider text-bone-dim/60">
                {t("nav.soon")}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Footer() {
  const { t } = useT();
  return (
    <div className="border-t border-ink-muted/40 px-3 py-2 text-[10px] text-bone-dim">
      {t("sidebar.demoFooter")}
    </div>
  );
}
