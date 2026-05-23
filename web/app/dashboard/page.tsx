"use client";

import { useMemo, useState } from "react";
import {
  barbers,
  services,
  todaysAppointments,
  SERVICE_COLOR_CLASSES,
  type Appointment,
} from "@/lib/mock-data";

const START_HOUR = 9;
const END_HOUR = 19;
const ROW_HEIGHT = 44;
const SLOTS_PER_HOUR = 2;
const HOUR_HEIGHT = ROW_HEIGHT * SLOTS_PER_HOUR;

export default function DashboardCalendarPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedBarberId, setSelectedBarberId] = useState<string | "all">(
    "all"
  );

  const currentDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const visibleBarbers = useMemo(() => {
    if (selectedBarberId === "all") return barbers;
    return barbers.filter((b) => b.id === selectedBarberId);
  }, [selectedBarberId]);

  const dateLabel = currentDate.toLocaleDateString("bg-BG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="px-4 py-4 md:px-6">
      <Toolbar
        dateLabel={dateLabel}
        dayOffset={dayOffset}
        onDayChange={setDayOffset}
        selectedBarberId={selectedBarberId}
        onBarberChange={setSelectedBarberId}
      />

      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-muted bg-ink-soft">
        <div className="flex min-w-fit">
          <TimeAxis />
          <div className="flex flex-1">
            {visibleBarbers.map((barber) => (
              <BarberColumn
                key={barber.id}
                barberName={barber.name}
                barberTitle={barber.title}
                appointments={
                  dayOffset === 0
                    ? todaysAppointments.filter((a) => a.barberId === barber.id)
                    : []
                }
              />
            ))}
          </div>
        </div>
      </div>

      {dayOffset !== 0 && (
        <p className="mt-6 text-center text-sm text-bone-dim">
          Демо данни има само за днес. Превключи към „Днес“ за да видиш
          графика.
        </p>
      )}
    </main>
  );
}

function Toolbar({
  dateLabel,
  dayOffset,
  onDayChange,
  selectedBarberId,
  onBarberChange,
}: {
  dateLabel: string;
  dayOffset: number;
  onDayChange: (n: number) => void;
  selectedBarberId: string | "all";
  onBarberChange: (id: string | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDayChange(dayOffset - 1)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink-muted text-bone-dim transition hover:border-accent hover:text-bone"
          aria-label="Предишен ден"
        >
          ←
        </button>
        <h1 className="font-display text-xl capitalize md:text-2xl">
          {dateLabel}
        </h1>
        <button
          onClick={() => onDayChange(dayOffset + 1)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink-muted text-bone-dim transition hover:border-accent hover:text-bone"
          aria-label="Следващ ден"
        >
          →
        </button>
        <button
          onClick={() => onDayChange(0)}
          disabled={dayOffset === 0}
          className="ml-2 rounded-lg border border-ink-muted px-3 py-1.5 text-xs uppercase tracking-wider text-bone-dim transition hover:border-accent hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
        >
          Днес
        </button>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={selectedBarberId}
          onChange={(e) => onBarberChange(e.target.value)}
          className="rounded-lg border border-ink-muted bg-ink px-3 py-2 text-sm text-bone focus:border-accent focus:outline-none"
        >
          <option value="all">Всички бръснари ({barbers.length})</option>
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover">
          + Нов час
        </button>
      </div>
    </div>
  );
}

function TimeAxis() {
  const hours = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hours.push(h);
  }
  return (
    <div className="w-16 shrink-0 border-r border-ink-muted/60">
      <div className="h-14 border-b border-ink-muted/60" />
      {hours.map((h, i) => (
        <div
          key={h}
          style={{ height: HOUR_HEIGHT }}
          className={`relative pr-2 text-right text-xs text-bone-dim ${
            i < hours.length - 1 ? "border-b border-ink-muted/30" : ""
          }`}
        >
          <span className="absolute right-2 top-0 -translate-y-1/2 bg-ink-soft px-1">
            {String(h).padStart(2, "0")}:00
          </span>
        </div>
      ))}
    </div>
  );
}

function BarberColumn({
  barberName,
  barberTitle,
  appointments,
}: {
  barberName: string;
  barberTitle: string;
  appointments: Appointment[];
}) {
  const initials = barberName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const totalHours = END_HOUR - START_HOUR;
  const gridHeight = totalHours * HOUR_HEIGHT;

  return (
    <div className="min-w-[180px] flex-1 border-r border-ink-muted/30 last:border-r-0">
      <div className="flex h-14 items-center gap-2 border-b border-ink-muted/60 px-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-xs font-medium text-accent">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{barberName}</p>
          <p className="truncate text-[10px] text-bone-dim">{barberTitle}</p>
        </div>
      </div>

      <div className="relative" style={{ height: gridHeight }}>
        {Array.from({ length: totalHours }).map((_, i) => (
          <div
            key={i}
            style={{ height: HOUR_HEIGHT }}
            className="border-b border-ink-muted/20 last:border-b-0"
          />
        ))}
        {appointments.map((a) => (
          <AppointmentBlock key={a.id} appointment={a} />
        ))}
      </div>
    </div>
  );
}

function AppointmentBlock({ appointment }: { appointment: Appointment }) {
  const service = services.find((s) => s.id === appointment.serviceId);
  if (!service) return null;

  const date = new Date(appointment.startsAt);
  const startMin = date.getHours() * 60 + date.getMinutes();
  const offsetMin = startMin - START_HOUR * 60;
  const top = (offsetMin / 30) * ROW_HEIGHT;
  const height = (service.durationMin / 30) * ROW_HEIGHT;

  const colors = SERVICE_COLOR_CLASSES[service.color];
  const startLabel = date.toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endDate = new Date(date.getTime() + service.durationMin * 60_000);
  const endLabel = endDate.toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{ top, height: height - 2 }}
      className={`absolute inset-x-1 overflow-hidden rounded-md border-l-2 px-2 py-1 text-[11px] leading-tight ${colors.bg} ${colors.border} ${colors.text}`}
    >
      <p className="font-medium text-bone">
        {startLabel}–{endLabel}
      </p>
      <p className="truncate font-medium text-bone">
        {appointment.clientName}
      </p>
      <p className="truncate opacity-90">{service.name}</p>
      {appointment.status === "pending" && (
        <p className="mt-0.5 text-[9px] uppercase tracking-wider text-amber-300">
          чака потвърждение
        </p>
      )}
    </div>
  );
}
