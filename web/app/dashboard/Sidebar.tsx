"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useCalendar, isSameDay, startOfDay } from "@/lib/calendar-context";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import type { TranslationKey } from "@/lib/translations";
import { Logo } from "@/components/Logo";

type Item = {
  href: string;
  labelKey: TranslationKey;
  icon: React.ReactNode;
  badgeKey?: TranslationKey;
  soon?: boolean;
};

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const items: Item[] = [
  {
    href: "/dashboard",
    labelKey: "nav.calendar",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/dashboard/reports",
    labelKey: "nav.reports",
    icon: (
      <svg {...iconProps}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    href: "/dashboard/clients",
    labelKey: "nav.clients",
    icon: (
      <svg {...iconProps}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/dashboard/team",
    labelKey: "nav.team",
    icon: (
      <svg {...iconProps}>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    href: "/dashboard/services",
    labelKey: "nav.services",
    icon: (
      <svg {...iconProps}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    href: "/dashboard/finance",
    labelKey: "nav.finance",
    icon: (
      <svg {...iconProps}>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    soon: true,
  },
  {
    href: "/dashboard/inventory",
    labelKey: "nav.inventory",
    icon: (
      <svg {...iconProps}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    labelKey: "nav.settings",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
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
  const { locations, currentLocationId, setCurrentLocationId } = useCalendar();
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
        <Logo size="md" />

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
            className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
              isActive
                ? "bg-accent/[0.13] text-bone [&_svg]:text-accent"
                : "text-bone-dim hover:bg-ink-muted/40 hover:text-bone"
            } ${item.soon ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <span className="flex items-center gap-3">
              <span className="shrink-0">{item.icon}</span>
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
