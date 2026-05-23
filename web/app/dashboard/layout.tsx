import Link from "next/link";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { CalendarProvider } from "@/lib/calendar-context";

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
    <header className="flex shrink-0 items-center justify-end gap-4 border-b border-ink-muted/40 bg-ink/95 px-6 py-3 backdrop-blur">
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
      <div
        className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-sm font-medium text-accent"
        title="Моят профил"
      >
        МК
      </div>
    </header>
  );
}
