"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-ink-muted/40 bg-ink-soft md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-display text-lg font-bold text-ink">
          B
        </span>
        <span className="font-display text-lg tracking-wide">BarberOS</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
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

      <div className="border-t border-ink-muted/40 px-5 py-4 text-xs text-bone-dim">
        Демо режим — данните са фалшиви
      </div>
    </aside>
  );
}
