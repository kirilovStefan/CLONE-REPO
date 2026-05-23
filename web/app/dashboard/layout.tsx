import Link from "next/link";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />
      <div className="flex-1 overflow-x-auto">
        <TopBar />
        {children}
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-muted/40 bg-ink/95 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-bone-dim">
          Barbershop
        </span>
        <span className="text-bone-dim">/</span>
        <span className="font-display text-base">BarberOS Demo</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-xs text-bone-dim transition hover:text-bone"
        >
          ← На сайта
        </Link>
        <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-sm font-medium text-accent">
          МК
        </div>
      </div>
    </header>
  );
}
