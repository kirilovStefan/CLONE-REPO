"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  barbers,
  services,
  todaysAppointments,
  STATUS_COLOR_CLASSES,
  type Appointment,
  type Barber,
  type AppointmentStatus,
} from "@/lib/mock-data";

// 24-часов график
const START_HOUR = 0;
const END_HOUR = 24;
const ROW_HEIGHT = 32; // височина на 30-минутен слот в px
const SLOTS_PER_HOUR = 2;
const HOUR_HEIGHT = ROW_HEIGHT * SLOTS_PER_HOUR;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

export default function DashboardCalendarPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedBarberId, setSelectedBarberId] = useState<string | "all">(
    "all"
  );
  const [now, setNow] = useState<Date | null>(null);
  const nowLineRef = useRef<HTMLDivElement>(null);

  // Стартираме часа в useEffect за да избегнем SSR/hydration несъответствие
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // При първоначално зареждане скролваме към текущия час
  useEffect(() => {
    if (now && nowLineRef.current && dayOffset === 0) {
      nowLineRef.current.scrollIntoView({ block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now !== null]);

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

  const isToday = dayOffset === 0;
  const nowMinutesFromStart =
    now && isToday ? now.getHours() * 60 + now.getMinutes() : null;
  const nowTop =
    nowMinutesFromStart !== null
      ? (nowMinutesFromStart / 30) * ROW_HEIGHT
      : null;
  const nowLabel = now
    ? now.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <main className="px-4 py-4 md:px-6">
      <Toolbar
        dateLabel={dateLabel}
        dayOffset={dayOffset}
        onDayChange={setDayOffset}
        selectedBarberId={selectedBarberId}
        onBarberChange={setSelectedBarberId}
      />

      <StatusLegend />

      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-muted bg-ink-soft">
        <div className="relative flex min-w-fit">
          <TimeAxis />
          <div className="relative flex flex-1">
            {visibleBarbers.map((barber) => (
              <BarberColumn
                key={barber.id}
                barber={barber}
                appointments={
                  isToday
                    ? todaysAppointments.filter((a) => a.barberId === barber.id)
                    : []
                }
                now={isToday ? now : null}
              />
            ))}

            {nowTop !== null && (
              <div
                ref={nowLineRef}
                className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                style={{ top: nowTop - 1 }}
              >
                <span className="absolute -left-14 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-lg">
                  {nowLabel}
                </span>
                <span className="-ml-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
                <span className="h-0.5 flex-1 bg-red-500/80" />
              </div>
            )}
          </div>
        </div>
      </div>

      {!isToday && (
        <p className="mt-6 text-center text-sm text-bone-dim">
          Демо данни има само за днес. Превключи към „Днес“ за пълния график.
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

function StatusLegend() {
  const statuses: AppointmentStatus[] = [
    "confirmed",
    "in-progress",
    "completed",
    "no-show",
  ];
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-bone-dim">
      {statuses.map((s) => {
        const c = STATUS_COLOR_CLASSES[s];
        return (
          <span key={s} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
            {c.label}
          </span>
        );
      })}
      <span className="flex items-center gap-2">
        <span className="h-px w-5 bg-red-500" />
        Текущ час
      </span>
    </div>
  );
}

function TimeAxis() {
  const hours = [];
  for (let h = START_HOUR; h < END_HOUR; h++) hours.push(h);
  return (
    <div className="w-16 shrink-0 border-r border-ink-muted/60">
      <div className="sticky top-0 h-14 border-b border-ink-muted/60 bg-ink-soft" />
      <div style={{ height: TOTAL_HEIGHT }} className="relative">
        {hours.map((h, i) => (
          <div
            key={h}
            style={{ height: HOUR_HEIGHT, top: i * HOUR_HEIGHT }}
            className={`absolute inset-x-0 pr-2 text-right text-xs text-bone-dim ${
              i < hours.length - 1 ? "border-b border-ink-muted/30" : ""
            }`}
          >
            <span className="absolute right-2 top-0 -translate-y-1/2 bg-ink-soft px-1">
              {String(h).padStart(2, "0")}:00
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarberColumn({
  barber,
  appointments,
  now,
}: {
  barber: Barber;
  appointments: Appointment[];
  now: Date | null;
}) {
  const initials = barber.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const workStartPx = (barber.workStart - START_HOUR) * HOUR_HEIGHT;
  const workEndPx = (barber.workEnd - START_HOUR) * HOUR_HEIGHT;

  return (
    <div className="min-w-[200px] flex-1 border-r border-ink-muted/30 last:border-r-0">
      <div className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-ink-muted/60 bg-ink-soft px-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/20 text-xs font-medium text-accent">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{barber.name}</p>
          <p className="truncate text-[10px] text-bone-dim">
            {String(barber.workStart).padStart(2, "0")}:00 –{" "}
            {String(barber.workEnd).padStart(2, "0")}:00
          </p>
        </div>
      </div>

      <div className="relative" style={{ height: TOTAL_HEIGHT }}>
        {/* Часови решетка (всеки час линия) */}
        {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
          <div
            key={i}
            style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
            className="absolute inset-x-0 border-b border-ink-muted/20 last:border-b-0"
          />
        ))}

        {/* Извън работно време — затъмнено */}
        {workStartPx > 0 && (
          <div
            className="absolute inset-x-0 top-0 bg-ink/70"
            style={{ height: workStartPx }}
            title="Извън работно време"
          />
        )}
        {workEndPx < TOTAL_HEIGHT && (
          <div
            className="absolute inset-x-0 bg-ink/70"
            style={{ top: workEndPx, height: TOTAL_HEIGHT - workEndPx }}
            title="Извън работно време"
          />
        )}

        {/* Резервации */}
        {appointments.map((a) => (
          <AppointmentBlock key={a.id} appointment={a} now={now} />
        ))}
      </div>
    </div>
  );
}

function effectiveStatus(
  appointment: Appointment,
  durationMin: number,
  now: Date | null
): AppointmentStatus {
  if (
    appointment.status === "completed" ||
    appointment.status === "no-show" ||
    appointment.status === "cancelled"
  ) {
    return appointment.status;
  }
  if (!now) return appointment.status;
  const start = new Date(appointment.startsAt);
  const end = new Date(start.getTime() + durationMin * 60_000);
  if (now >= start && now < end) return "in-progress";
  return appointment.status;
}

function AppointmentBlock({
  appointment,
  now,
}: {
  appointment: Appointment;
  now: Date | null;
}) {
  const service = services.find((s) => s.id === appointment.serviceId);
  if (!service) return null;

  const date = new Date(appointment.startsAt);
  const startMin = date.getHours() * 60 + date.getMinutes();
  const offsetMin = startMin - START_HOUR * 60;
  const top = (offsetMin / 30) * ROW_HEIGHT;
  const height = (service.durationMin / 30) * ROW_HEIGHT;

  const status = effectiveStatus(appointment, service.durationMin, now);
  const colors = STATUS_COLOR_CLASSES[status];
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
      className={`absolute inset-x-1 z-[5] overflow-hidden rounded-md border-l-4 px-2 py-1 text-[11px] leading-tight ${colors.bg} ${colors.border} ${
        status === "no-show" ? "line-through opacity-80" : ""
      }`}
      title={`${appointment.clientName} • ${service.name} • ${colors.label}`}
    >
      <p className="font-medium text-bone">
        {startLabel}–{endLabel}
      </p>
      <p className="truncate font-medium text-bone">{appointment.clientName}</p>
      <p className="truncate text-bone-dim">{service.name}</p>
    </div>
  );
}

