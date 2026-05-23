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

// 24-часов график; видими 10 часа едновременно (скрол за останалите)
const START_HOUR = 0;
const END_HOUR = 24;
const ROW_HEIGHT = 32; // 30-минутен слот
const SLOTS_PER_HOUR = 2;
const HOUR_HEIGHT = ROW_HEIGHT * SLOTS_PER_HOUR; // 64 px
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
const HEADER_HEIGHT = 56;
const VISIBLE_HOURS = 10;
const VISIBLE_HEIGHT = VISIBLE_HOURS * HOUR_HEIGHT;
const TIME_AXIS_WIDTH = 64;

type HoverState = { barberId: string; startMinutes: number } | null;
type ModalState = { barberId: string; startsAt: string } | null;

export default function DashboardCalendarPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedBarberId, setSelectedBarberId] = useState<string | "all">(
    "all"
  );
  const [now, setNow] = useState<Date | null>(null);
  const [customAppointments, setCustomAppointments] = useState<Appointment[]>(
    []
  );
  const [hover, setHover] = useState<HoverState>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrolledRef = useRef<number | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Авто-скрол до текущия час при отваряне (или при смяна на ден)
  useEffect(() => {
    if (!containerRef.current || !now) return;
    if (lastScrolledRef.current === dayOffset) return;
    const targetHour = dayOffset === 0 ? now.getHours() : 9;
    const targetTop = (targetHour - START_HOUR) * HOUR_HEIGHT;
    containerRef.current.scrollTop = Math.max(
      0,
      targetTop - containerRef.current.clientHeight / 3
    );
    lastScrolledRef.current = dayOffset;
  }, [dayOffset, now]);

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

  const allAppointments = useMemo(
    () => [...todaysAppointments, ...customAppointments],
    [customAppointments]
  );

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

      <div
        ref={containerRef}
        className="mt-4 overflow-auto rounded-2xl border border-ink-muted bg-ink-soft"
        style={{ maxHeight: VISIBLE_HEIGHT + HEADER_HEIGHT }}
      >
        <div className="flex min-w-fit">
          <TimeAxis
            now={isToday ? now : null}
            nowTop={nowTop}
            nowLabel={nowLabel}
          />
          {visibleBarbers.map((barber) => {
            const barberAppts = isToday
              ? allAppointments.filter((a) => a.barberId === barber.id)
              : [];
            const hoverForThis =
              hover && hover.barberId === barber.id ? hover.startMinutes : null;
            return (
              <BarberColumn
                key={barber.id}
                barber={barber}
                appointments={barberAppts}
                hoverMinutes={hoverForThis}
                nowTop={isToday ? nowTop : null}
                now={isToday ? now : null}
                onHoverChange={(startMinutes) =>
                  startMinutes === null
                    ? setHover(null)
                    : setHover({ barberId: barber.id, startMinutes })
                }
                onCreate={(startMinutes) => {
                  const date = new Date();
                  date.setDate(date.getDate() + dayOffset);
                  date.setHours(
                    Math.floor(startMinutes / 60),
                    startMinutes % 60,
                    0,
                    0
                  );
                  setModal({
                    barberId: barber.id,
                    startsAt: date.toISOString(),
                  });
                }}
              />
            );
          })}
        </div>
      </div>

      {!isToday && (
        <p className="mt-6 text-center text-sm text-bone-dim">
          Демо данни има само за днес. Превключи към „Днес“ за пълния график.
        </p>
      )}

      {modal && (
        <NewAppointmentModal
          barberId={modal.barberId}
          startsAt={modal.startsAt}
          onClose={() => setModal(null)}
          onSave={(appt) => {
            setCustomAppointments((prev) => [...prev, appt]);
            setModal(null);
          }}
        />
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
      <span className="ml-auto text-bone-dim/70">
        💡 Цъкни в празно поле за да добавиш час
      </span>
    </div>
  );
}

function TimeAxis({
  now,
  nowTop,
  nowLabel,
}: {
  now: Date | null;
  nowTop: number | null;
  nowLabel: string;
}) {
  const hours = [];
  for (let h = START_HOUR; h < END_HOUR; h++) hours.push(h);
  return (
    <div
      className="sticky left-0 z-20 shrink-0 border-r border-ink-muted/60 bg-ink-soft"
      style={{ width: TIME_AXIS_WIDTH }}
    >
      <div
        className="sticky top-0 z-30 border-b border-ink-muted/60 bg-ink-soft"
        style={{ height: HEADER_HEIGHT }}
      />
      <div className="relative" style={{ height: TOTAL_HEIGHT }}>
        {hours.map((h, i) => (
          <div
            key={h}
            style={{ top: i * HOUR_HEIGHT }}
            className="absolute inset-x-0 right-2 text-right text-xs text-bone-dim"
          >
            <span className="absolute right-2 -translate-y-1/2 bg-ink-soft px-1">
              {String(h).padStart(2, "0")}:00
            </span>
          </div>
        ))}
        {now && nowTop !== null && (
          <div
            className="absolute right-0 z-10 -translate-y-1/2"
            style={{ top: nowTop }}
          >
            <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-lg">
              {nowLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function BarberColumn({
  barber,
  appointments,
  hoverMinutes,
  nowTop,
  now,
  onHoverChange,
  onCreate,
}: {
  barber: Barber;
  appointments: Appointment[];
  hoverMinutes: number | null;
  nowTop: number | null;
  now: Date | null;
  onHoverChange: (startMinutes: number | null) => void;
  onCreate: (startMinutes: number) => void;
}) {
  const initials = barber.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const workStartMin = barber.workStart * 60;
  const workEndMin = barber.workEnd * 60;
  const workStartPx = (workStartMin / 30) * ROW_HEIGHT;
  const workEndPx = (workEndMin / 30) * ROW_HEIGHT;

  function isWithinWorkingHours(startMin: number): boolean {
    return startMin >= workStartMin && startMin + 60 <= workEndMin;
  }

  function overlapsExisting(startMin: number): boolean {
    return appointments.some((a) => {
      const s = services.find((sv) => sv.id === a.serviceId);
      if (!s) return false;
      const d = new Date(a.startsAt);
      const aStart = d.getHours() * 60 + d.getMinutes();
      const aEnd = aStart + s.durationMin;
      return !(startMin + 60 <= aStart || startMin >= aEnd);
    });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutesFromStart = (y / ROW_HEIGHT) * 30;
    const totalMin = START_HOUR * 60 + minutesFromStart;
    const snapped = Math.floor(totalMin / 30) * 30;

    if (!isWithinWorkingHours(snapped) || overlapsExisting(snapped)) {
      onHoverChange(null);
      return;
    }
    onHoverChange(snapped);
  }

  function handleClick() {
    if (hoverMinutes === null) return;
    onCreate(hoverMinutes);
  }

  return (
    <div className="min-w-[200px] flex-1 border-r border-ink-muted/30 last:border-r-0">
      <div
        className="sticky top-0 z-10 flex items-center gap-2 border-b border-ink-muted/60 bg-ink-soft px-3"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/20 text-xs font-medium text-accent">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{barber.name}</p>
          <p className="truncate text-[10px] text-bone-dim">
            {String(barber.workStart).padStart(2, "0")}:00–
            {String(barber.workEnd).padStart(2, "0")}:00
          </p>
        </div>
      </div>

      <div
        className="relative cursor-pointer"
        style={{ height: TOTAL_HEIGHT }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => onHoverChange(null)}
        onClick={handleClick}
      >
        {Array.from({ length: END_HOUR - START_HOUR }).map((_, i) => (
          <div
            key={i}
            style={{ top: i * HOUR_HEIGHT, height: HOUR_HEIGHT }}
            className="absolute inset-x-0 border-b border-ink-muted/20"
          />
        ))}

        {workStartPx > 0 && (
          <div
            className="absolute inset-x-0 top-0 bg-ink/75"
            style={{ height: workStartPx }}
            title="Извън работно време"
          />
        )}
        {workEndPx < TOTAL_HEIGHT && (
          <div
            className="absolute inset-x-0 bg-ink/75"
            style={{ top: workEndPx, height: TOTAL_HEIGHT - workEndPx }}
            title="Извън работно време"
          />
        )}

        {hoverMinutes !== null && (
          <HoverMarker startMinutes={hoverMinutes} />
        )}

        {appointments.map((a) => (
          <AppointmentBlock key={a.id} appointment={a} now={now} />
        ))}

        {nowTop !== null && (
          <div
            className="pointer-events-none absolute inset-x-0 z-[15] flex items-center"
            style={{ top: nowTop - 1 }}
          >
            <span className="-ml-1 h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
            <span className="h-0.5 flex-1 bg-red-500/80" />
          </div>
        )}
      </div>
    </div>
  );
}

function formatMinutesToTime(totalMin: number) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function HoverMarker({ startMinutes }: { startMinutes: number }) {
  const top = (startMinutes / 30) * ROW_HEIGHT;
  const height = HOUR_HEIGHT; // 1 час
  return (
    <div
      className="pointer-events-none absolute inset-x-1 z-[3] flex flex-col justify-center rounded-md border-2 border-dashed border-accent bg-accent/15 px-2 py-1 text-center text-[11px] font-medium text-accent"
      style={{ top, height: height - 2 }}
    >
      <p>+ Нов час</p>
      <p className="opacity-80">
        {formatMinutesToTime(startMinutes)}–
        {formatMinutesToTime(startMinutes + 60)}
      </p>
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
      style={{ top, height: height - 3 }}
      onClick={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      className={`absolute inset-x-1.5 z-[5] overflow-hidden rounded-lg border-l-4 px-2.5 py-1.5 text-[11px] leading-tight shadow-sm transition hover:shadow-md ${colors.bg} ${colors.border} ${
        status === "no-show" ? "opacity-70" : ""
      }`}
      title={`${appointment.clientName} • ${service.name} • ${colors.label}${
        appointment.notes ? "\nБележка: " + appointment.notes : ""
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="font-semibold text-bone">
          {startLabel}–{endLabel}
        </p>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
      </div>
      <p
        className={`mt-0.5 truncate font-medium text-bone ${
          status === "no-show" ? "line-through" : ""
        }`}
      >
        {appointment.clientName}
      </p>
      <p className="truncate text-bone-dim">{service.name}</p>
      {appointment.notes && (
        <p className="mt-0.5 truncate text-[10px] italic text-bone-dim/80">
          📝 {appointment.notes}
        </p>
      )}
    </div>
  );
}

function NewAppointmentModal({
  barberId,
  startsAt,
  onClose,
  onSave,
}: {
  barberId: string;
  startsAt: string;
  onClose: () => void;
  onSave: (a: Appointment) => void;
}) {
  const barber = barbers.find((b) => b.id === barberId);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState(services[0].id);
  const [notes, setNotes] = useState("");

  const service = services.find((s) => s.id === serviceId);
  const startDate = new Date(startsAt);
  const startLabel = startDate.toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endLabel = service
    ? new Date(
        startDate.getTime() + service.durationMin * 60_000
      ).toLocaleTimeString("bg-BG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const canSave = firstName.trim() && lastName.trim() && phone.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    const appt: Appointment = {
      id: `local-${Date.now()}`,
      clientName: `${firstName.trim()} ${lastName.trim()}`,
      clientPhone: phone.trim(),
      clientEmail: email.trim() || undefined,
      notes: notes.trim() || undefined,
      serviceId,
      barberId,
      startsAt,
      status: "confirmed",
    };
    onSave(appt);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-ink-muted bg-ink-soft p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Нов час</h2>
            <p className="mt-1 text-sm text-bone-dim">
              {barber?.name} · {startLabel}
              {service ? `–${endLabel}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-bone-dim transition hover:bg-ink-muted hover:text-bone"
            aria-label="Затвори"
          >
            ✕
          </button>
        </div>

        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Име *">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Иван"
                className="input"
                required
                autoFocus
              />
            </Field>
            <Field label="Фамилия *">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Петров"
                className="input"
                required
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Телефон *">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+359 88 123 4567"
                className="input"
                required
              />
            </Field>
            <Field label="Имейл">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@example.com"
                className="input"
              />
            </Field>
          </div>

          <Field label="Услуга">
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="input"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.durationMin} мин · {s.price} лв)
                </option>
              ))}
            </select>
          </Field>

          <Field label="Бележка">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="напр. ще закъснее с 10 мин; алергия към одеколон..."
              rows={3}
              className="input resize-none"
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Запиши часа
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(42 42 48);
          background: rgb(11 11 13);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: rgb(245 239 230);
          outline: none;
          transition: border-color 0.15s;
        }
        :global(.input:focus) {
          border-color: rgb(201 163 106);
        }
        :global(.input::placeholder) {
          color: rgba(207 198 184 / 0.5);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-bone-dim">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
