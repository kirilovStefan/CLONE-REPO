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

const START_HOUR = 0;
const END_HOUR = 24;
const ROW_HEIGHT = 32;
const SLOTS_PER_HOUR = 2;
const HOUR_HEIGHT = ROW_HEIGHT * SLOTS_PER_HOUR;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
const HEADER_HEIGHT = 56;
const TIME_AXIS_WIDTH = 64;
const DRAG_THRESHOLD = 4;

type AppointmentOverride = Partial<Appointment>;
type HoverState = { barberId: string; startMinutes: number } | null;
type NewModal = { barberId: string; startsAt: string } | null;
type DetailsModal = { appointmentId: string } | null;

type DragInfo = {
  appointmentId: string;
  mode: "move" | "resize";
  startX: number;
  startY: number;
  hasMoved: boolean;
  originalBarberId: string;
  originalStartMinutes: number;
  originalDurationMin: number;
  clickOffsetWithinBlock: number;
};

type DragPreview = {
  appointmentId: string;
  barberId: string;
  startMinutes: number;
  durationMin: number;
};

type MoveConfirm = {
  appointmentId: string;
  fromBarberId: string;
  fromStartMinutes: number;
  fromDurationMin: number;
  toBarberId: string;
  toStartMinutes: number;
};

function applyOverride(a: Appointment, ov?: AppointmentOverride): Appointment {
  if (!ov) return a;
  return { ...a, ...ov };
}

export default function DashboardCalendarPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const [selectedBarberId, setSelectedBarberId] = useState<string | "all">(
    "all"
  );
  const [now, setNow] = useState<Date | null>(null);
  const [customAppointments, setCustomAppointments] = useState<Appointment[]>(
    []
  );
  const [overrides, setOverrides] = useState<
    Record<string, AppointmentOverride>
  >({});
  const [hover, setHover] = useState<HoverState>(null);
  const [newModal, setNewModal] = useState<NewModal>(null);
  const [detailsModal, setDetailsModal] = useState<DetailsModal>(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const [moveConfirm, setMoveConfirm] = useState<MoveConfirm | null>(null);

  const dragRef = useRef<DragInfo | null>(null);
  const dragPreviewRef = useRef<DragPreview | null>(null);
  const justFinishedDragRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrolledRef = useRef<number | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

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

  function setOverride(id: string, ov: AppointmentOverride) {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...ov } }));
  }

  const allAppointments = useMemo(
    () => [...todaysAppointments, ...customAppointments],
    [customAppointments]
  );

  // Global drag listeners
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current) return;
      const d = dragRef.current;

      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (!d.hasMoved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;
      d.hasMoved = true;

      if (d.mode === "resize") {
        const deltaMin = (dy / ROW_HEIGHT) * 30;
        const newEnd =
          d.originalStartMinutes + d.originalDurationMin + deltaMin;
        const snappedEnd = Math.round(newEnd / 15) * 15;
        const newDuration = Math.max(
          15,
          Math.min(
            snappedEnd - d.originalStartMinutes,
            END_HOUR * 60 - d.originalStartMinutes
          )
        );
        const preview: DragPreview = {
          appointmentId: d.appointmentId,
          barberId: d.originalBarberId,
          startMinutes: d.originalStartMinutes,
          durationMin: newDuration,
        };
        dragPreviewRef.current = preview;
        setDragPreview(preview);
      } else {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const columnEl = el?.closest(
          "[data-barber-column]"
        ) as HTMLElement | null;
        if (!columnEl) return;
        const barberId = columnEl.getAttribute("data-barber-column");
        if (!barberId) return;

        const rect = columnEl.getBoundingClientRect();
        const yInColumn = e.clientY - rect.top - d.clickOffsetWithinBlock;
        const newStartMin = (yInColumn / ROW_HEIGHT) * 30 + START_HOUR * 60;
        const snapped = Math.round(newStartMin / 30) * 30;
        const clamped = Math.max(
          START_HOUR * 60,
          Math.min(snapped, END_HOUR * 60 - d.originalDurationMin)
        );
        const preview: DragPreview = {
          appointmentId: d.appointmentId,
          barberId,
          startMinutes: clamped,
          durationMin: d.originalDurationMin,
        };
        dragPreviewRef.current = preview;
        setDragPreview(preview);
      }
    }

    function onMouseUp() {
      if (!dragRef.current) return;
      const d = dragRef.current;

      if (!d.hasMoved) {
        dragRef.current = null;
        dragPreviewRef.current = null;
        setDragPreview(null);
        return;
      }

      justFinishedDragRef.current = true;
      const preview = dragPreviewRef.current;

      if (d.mode === "resize") {
        if (preview && preview.durationMin !== d.originalDurationMin) {
          setOverride(d.appointmentId, { durationMin: preview.durationMin });
        }
        setDragPreview(null);
        dragPreviewRef.current = null;
        dragRef.current = null;
      } else {
        if (
          !preview ||
          (preview.barberId === d.originalBarberId &&
            preview.startMinutes === d.originalStartMinutes)
        ) {
          setDragPreview(null);
          dragPreviewRef.current = null;
          dragRef.current = null;
          return;
        }
        setMoveConfirm({
          appointmentId: d.appointmentId,
          fromBarberId: d.originalBarberId,
          fromStartMinutes: d.originalStartMinutes,
          fromDurationMin: d.originalDurationMin,
          toBarberId: preview.barberId,
          toStartMinutes: preview.startMinutes,
        });
      }
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  function handleAppointmentMouseDown(
    appointmentId: string,
    mode: "move" | "resize",
    e: React.MouseEvent
  ) {
    e.stopPropagation();
    const baseAppt = allAppointments.find((a) => a.id === appointmentId);
    if (!baseAppt) return;
    const appt = applyOverride(baseAppt, overrides[appointmentId]);
    const service = services.find((s) => s.id === appt.serviceId);
    if (!service) return;

    const startDate = new Date(appt.startsAt);
    const startMin = startDate.getHours() * 60 + startDate.getMinutes();
    const durationMin = appt.durationMin ?? service.durationMin;

    const target = e.currentTarget as HTMLElement;
    const columnEl = target.closest(
      "[data-barber-column]"
    ) as HTMLElement | null;
    let clickOffsetWithinBlock = 0;
    if (columnEl) {
      const columnRect = columnEl.getBoundingClientRect();
      const apptBlockTop = ((startMin - START_HOUR * 60) / 30) * ROW_HEIGHT;
      clickOffsetWithinBlock =
        e.clientY - columnRect.top - apptBlockTop;
    }

    dragRef.current = {
      appointmentId,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false,
      originalBarberId: appt.barberId,
      originalStartMinutes: startMin,
      originalDurationMin: durationMin,
      clickOffsetWithinBlock,
    };
  }

  function handleAppointmentClick(appointmentId: string) {
    if (justFinishedDragRef.current) {
      justFinishedDragRef.current = false;
      return;
    }
    setDetailsModal({ appointmentId });
  }

  function handleMoveConfirm() {
    if (!moveConfirm) return;
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + dayOffset);
    newDate.setHours(
      Math.floor(moveConfirm.toStartMinutes / 60),
      moveConfirm.toStartMinutes % 60,
      0,
      0
    );
    setOverride(moveConfirm.appointmentId, {
      barberId: moveConfirm.toBarberId,
      startsAt: newDate.toISOString(),
    });
    setMoveConfirm(null);
    setDragPreview(null);
    dragPreviewRef.current = null;
    dragRef.current = null;
  }

  function handleMoveCancel() {
    setMoveConfirm(null);
    setDragPreview(null);
    dragPreviewRef.current = null;
    dragRef.current = null;
  }

  function handleStatusChange(id: string, status: AppointmentStatus) {
    setOverride(id, { status });
    setDetailsModal(null);
  }

  const currentDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const visibleBarbers = useMemo(() => {
    if (selectedBarberId === "all") return barbers;
    return barbers.filter((b) => b.id === selectedBarberId);
  }, [selectedBarberId]);

  const isToday = dayOffset === 0;
  const dateLabel = currentDate.toLocaleDateString("bg-BG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const nowMinutesFromStart =
    now && isToday ? now.getHours() * 60 + now.getMinutes() : null;
  const nowTop =
    nowMinutesFromStart !== null
      ? (nowMinutesFromStart / 30) * ROW_HEIGHT
      : null;
  const nowLabel = now
    ? now.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })
    : "";

  const detailsBaseAppt = detailsModal
    ? allAppointments.find((a) => a.id === detailsModal.appointmentId) ?? null
    : null;
  const detailsAppointment = detailsBaseAppt
    ? applyOverride(detailsBaseAppt, overrides[detailsBaseAppt.id])
    : null;

  function getAppointmentsForBarber(
    barberId: string
  ): { appointment: Appointment; isDragging: boolean }[] {
    if (!isToday) return [];
    const result: { appointment: Appointment; isDragging: boolean }[] = [];
    for (const a of allAppointments) {
      if (dragPreview && dragPreview.appointmentId === a.id) {
        if (dragPreview.barberId === barberId) {
          const newDate = new Date();
          newDate.setDate(newDate.getDate() + dayOffset);
          newDate.setHours(
            Math.floor(dragPreview.startMinutes / 60),
            dragPreview.startMinutes % 60,
            0,
            0
          );
          result.push({
            appointment: {
              ...a,
              barberId: dragPreview.barberId,
              startsAt: newDate.toISOString(),
              durationMin: dragPreview.durationMin,
            },
            isDragging: true,
          });
        }
        continue;
      }
      const effective = applyOverride(a, overrides[a.id]);
      if (effective.barberId === barberId) {
        result.push({ appointment: effective, isDragging: false });
      }
    }
    return result;
  }

  return (
    <main className="flex h-full flex-col px-4 py-4 md:px-6">
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
        className={`mt-4 min-h-0 flex-1 overflow-auto rounded-2xl border border-ink-muted bg-ink-soft ${
          dragRef.current ? "select-none" : ""
        }`}
      >
        <div className="flex min-w-fit">
          <TimeAxis
            now={isToday ? now : null}
            nowTop={nowTop}
            nowLabel={nowLabel}
          />
          {visibleBarbers.map((barber) => {
            const barberAppts = getAppointmentsForBarber(barber.id);
            const hoverForThis =
              hover && hover.barberId === barber.id
                ? hover.startMinutes
                : null;
            return (
              <BarberColumn
                key={barber.id}
                barber={barber}
                appointments={barberAppts}
                hoverMinutes={dragPreview ? null : hoverForThis}
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
                  setNewModal({
                    barberId: barber.id,
                    startsAt: date.toISOString(),
                  });
                }}
                onAppointmentClick={handleAppointmentClick}
                onAppointmentMouseDown={handleAppointmentMouseDown}
              />
            );
          })}
        </div>
      </div>

      {!isToday && (
        <p className="mt-3 shrink-0 text-center text-xs text-bone-dim">
          Демо данни има само за днес. Превключи към „Днес“ за пълния график.
        </p>
      )}

      {newModal && (
        <NewAppointmentModal
          barberId={newModal.barberId}
          startsAt={newModal.startsAt}
          onClose={() => setNewModal(null)}
          onSave={(appt) => {
            setCustomAppointments((prev) => [...prev, appt]);
            setNewModal(null);
          }}
        />
      )}

      {detailsAppointment && (
        <AppointmentDetailsModal
          appointment={detailsAppointment}
          now={isToday ? now : null}
          onClose={() => setDetailsModal(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {moveConfirm && (
        <MoveConfirmModal
          info={moveConfirm}
          appointment={
            allAppointments.find((a) => a.id === moveConfirm.appointmentId) ??
            null
          }
          onConfirm={handleMoveConfirm}
          onCancel={handleMoveCancel}
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
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
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
    <div className="mt-3 flex shrink-0 flex-wrap gap-x-5 gap-y-2 text-xs text-bone-dim">
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
      <span className="ml-auto hidden text-bone-dim/70 md:inline">
        💡 Влачи за преместване · долен край за смяна на времетраене
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
  onAppointmentClick,
  onAppointmentMouseDown,
}: {
  barber: Barber;
  appointments: { appointment: Appointment; isDragging: boolean }[];
  hoverMinutes: number | null;
  nowTop: number | null;
  now: Date | null;
  onHoverChange: (startMinutes: number | null) => void;
  onCreate: (startMinutes: number) => void;
  onAppointmentClick: (id: string) => void;
  onAppointmentMouseDown: (
    id: string,
    mode: "move" | "resize",
    e: React.MouseEvent
  ) => void;
}) {
  const initials = barber.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const workStartPx = (barber.workStart - START_HOUR) * HOUR_HEIGHT;
  const workEndPx = (barber.workEnd - START_HOUR) * HOUR_HEIGHT;

  function overlapsExisting(startMin: number): boolean {
    return appointments.some(({ appointment: a }) => {
      const s = services.find((sv) => sv.id === a.serviceId);
      if (!s) return false;
      const d = new Date(a.startsAt);
      const aStart = d.getHours() * 60 + d.getMinutes();
      const dur = a.durationMin ?? s.durationMin;
      const aEnd = aStart + dur;
      return !(startMin + 60 <= aStart || startMin >= aEnd);
    });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutesFromStart = (y / ROW_HEIGHT) * 30;
    const totalMin = START_HOUR * 60 + minutesFromStart;
    const snapped = Math.floor(totalMin / 30) * 30;
    if (snapped < START_HOUR * 60 || snapped + 60 > END_HOUR * 60) {
      onHoverChange(null);
      return;
    }
    if (overlapsExisting(snapped)) {
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
        data-barber-column={barber.id}
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
            className="pointer-events-none absolute inset-x-0 top-0 bg-ink/55"
            style={{ height: workStartPx }}
            title="Извън работно време"
          />
        )}
        {workEndPx < TOTAL_HEIGHT && (
          <div
            className="pointer-events-none absolute inset-x-0 bg-ink/55"
            style={{ top: workEndPx, height: TOTAL_HEIGHT - workEndPx }}
            title="Извън работно време"
          />
        )}

        {hoverMinutes !== null && <HoverMarker startMinutes={hoverMinutes} />}

        {appointments.map(({ appointment, isDragging }) => (
          <AppointmentBlock
            key={appointment.id}
            appointment={appointment}
            now={now}
            isDragging={isDragging}
            onClick={() => onAppointmentClick(appointment.id)}
            onMouseDown={(mode, e) =>
              onAppointmentMouseDown(appointment.id, mode, e)
            }
          />
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
  return (
    <div
      className="pointer-events-none absolute inset-x-1 z-[3] flex flex-col justify-center rounded-md border-2 border-dashed border-accent bg-accent/20 px-2 py-1 text-center text-[11px] font-medium text-accent"
      style={{ top, height: HOUR_HEIGHT - 2 }}
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
  isDragging,
  onClick,
  onMouseDown,
}: {
  appointment: Appointment;
  now: Date | null;
  isDragging: boolean;
  onClick: () => void;
  onMouseDown: (mode: "move" | "resize", e: React.MouseEvent) => void;
}) {
  const service = services.find((s) => s.id === appointment.serviceId);
  if (!service) return null;

  const durationMin = appointment.durationMin ?? service.durationMin;
  const date = new Date(appointment.startsAt);
  const startMin = date.getHours() * 60 + date.getMinutes();
  const offsetMin = startMin - START_HOUR * 60;
  const top = (offsetMin / 30) * ROW_HEIGHT;
  const height = (durationMin / 30) * ROW_HEIGHT;

  const status = effectiveStatus(appointment, durationMin, now);
  const colors = STATUS_COLOR_CLASSES[status];
  const startLabel = date.toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endDate = new Date(date.getTime() + durationMin * 60_000);
  const endLabel = endDate.toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{ top, height: height - 3 }}
      onMouseDown={(e) => onMouseDown("move", e)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseMove={(e) => e.stopPropagation()}
      className={`absolute inset-x-1.5 z-[5] cursor-grab overflow-hidden rounded-lg border-l-[5px] px-2.5 py-1.5 text-left text-[11px] leading-tight shadow-md ring-1 ring-inset transition ${colors.bg} ${colors.border} ${colors.ring} ${
        status === "no-show" ? "opacity-75" : ""
      } ${
        isDragging
          ? "scale-[1.03] cursor-grabbing opacity-90 shadow-2xl ring-2 ring-accent"
          : "hover:scale-[1.02] hover:shadow-xl"
      }`}
      title={`${appointment.clientName} • ${service.name} • ${colors.label}${
        appointment.notes ? "\nБележка: " + appointment.notes : ""
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="font-semibold text-bone">
          {startLabel}–{endLabel}
        </p>
        <span className={`h-2 w-2 shrink-0 rounded-full ${colors.dot}`} />
      </div>
      <p
        className={`mt-0.5 truncate font-semibold text-bone ${
          status === "no-show" ? "line-through" : ""
        }`}
      >
        {appointment.clientName}
      </p>
      <p className="truncate text-bone/85">{service.name}</p>
      {appointment.notes && (
        <p className="mt-0.5 truncate text-[10px] italic text-bone-dim">
          📝 {appointment.notes}
        </p>
      )}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown("resize", e);
        }}
        onClick={(e) => e.stopPropagation()}
        className="group/handle absolute inset-x-0 bottom-0 flex h-2.5 cursor-ns-resize items-center justify-center"
        title="Влачи за смяна на времетраене"
      >
        <span className="h-1 w-6 rounded-full bg-bone/20 group-hover/handle:bg-accent" />
      </div>
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
    <ModalShell onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Нов час</h2>
          <p className="mt-1 text-sm text-bone-dim">
            {barber?.name} · {startLabel}
            {service ? `–${endLabel}` : ""}
          </p>
        </div>
        <CloseButton onClose={onClose} />
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
            placeholder="напр. ще закъснее с 10 мин..."
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
    </ModalShell>
  );
}

function AppointmentDetailsModal({
  appointment,
  now,
  onClose,
  onStatusChange,
}: {
  appointment: Appointment;
  now: Date | null;
  onClose: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}) {
  const service = services.find((s) => s.id === appointment.serviceId)!;
  const barber = barbers.find((b) => b.id === appointment.barberId)!;
  const durationMin = appointment.durationMin ?? service.durationMin;
  const status = effectiveStatus(appointment, durationMin, now);
  const colors = STATUS_COLOR_CLASSES[status];

  const startDate = new Date(appointment.startsAt);
  const startLabel = startDate.toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endLabel = new Date(
    startDate.getTime() + durationMin * 60_000
  ).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });

  const statusActions: {
    status: AppointmentStatus;
    label: string;
    icon: string;
    desc: string;
  }[] = [
    {
      status: "confirmed",
      label: "Записан",
      icon: "📅",
      desc: "Чака се да дойде",
    },
    {
      status: "in-progress",
      label: "Дошъл",
      icon: "✂️",
      desc: "В момента се обслужва",
    },
    {
      status: "completed",
      label: "Платено",
      icon: "💰",
      desc: "Услугата приключи",
    },
    {
      status: "no-show",
      label: "Не дойде",
      icon: "✗",
      desc: "Клиентът пропусна часа",
    },
  ];

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.ring} ring-1`}
          >
            <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
            {colors.label}
          </span>
          <h2 className="mt-2 font-display text-2xl">
            {appointment.clientName}
          </h2>
          <p className="mt-1 text-sm text-bone-dim">
            {startLabel}–{endLabel} · {durationMin} мин · {barber.name}
          </p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <dl className="mt-5 space-y-2 rounded-xl border border-ink-muted bg-ink/40 p-4 text-sm">
        <InfoRow
          label="Услуга"
          value={`${service.name} (${service.price} лв)`}
        />
        <InfoRow label="Телефон" value={appointment.clientPhone} />
        {appointment.clientEmail && (
          <InfoRow label="Имейл" value={appointment.clientEmail} />
        )}
        {appointment.notes && (
          <InfoRow label="Бележка" value={`📝 ${appointment.notes}`} />
        )}
      </dl>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-widest text-bone-dim">
          Промени статуса
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {statusActions.map((a) => {
            const c = STATUS_COLOR_CLASSES[a.status];
            const isActive = status === a.status;
            return (
              <button
                key={a.status}
                onClick={() => onStatusChange(appointment.id, a.status)}
                disabled={isActive}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                  isActive
                    ? `${c.bg} ${c.ring} ring-1 cursor-default`
                    : "border-ink-muted hover:border-accent/60 hover:bg-ink-muted/30"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg ${c.bg}`}
                >
                  {a.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {a.label}
                    {isActive && (
                      <span className="ml-2 text-[10px] text-bone-dim">
                        (текущ)
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[11px] text-bone-dim">{a.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
        >
          Затвори
        </button>
      </div>
    </ModalShell>
  );
}

function MoveConfirmModal({
  info,
  appointment,
  onConfirm,
  onCancel,
}: {
  info: MoveConfirm;
  appointment: Appointment | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const fromBarber = barbers.find((b) => b.id === info.fromBarberId);
  const toBarber = barbers.find((b) => b.id === info.toBarberId);
  const fromTime = formatMinutesToTime(info.fromStartMinutes);
  const fromEnd = formatMinutesToTime(
    info.fromStartMinutes + info.fromDurationMin
  );
  const toTime = formatMinutesToTime(info.toStartMinutes);
  const toEnd = formatMinutesToTime(
    info.toStartMinutes + info.fromDurationMin
  );

  return (
    <ModalShell onClose={onCancel}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Преместване на час?</h2>
          {appointment && (
            <p className="mt-1 text-sm text-bone-dim">
              {appointment.clientName}
            </p>
          )}
        </div>
        <CloseButton onClose={onCancel} />
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl border border-ink-muted bg-ink/40 p-4">
          <p className="text-xs uppercase tracking-widest text-bone-dim">
            От
          </p>
          <p className="mt-1 font-display text-lg">
            {fromTime}–{fromEnd}
          </p>
          <p className="text-sm text-bone-dim">{fromBarber?.name}</p>
        </div>
        <div className="flex justify-center text-accent">↓</div>
        <div className="rounded-xl border border-accent/60 bg-accent/10 p-4">
          <p className="text-xs uppercase tracking-widest text-accent">На</p>
          <p className="mt-1 font-display text-lg">
            {toTime}–{toEnd}
          </p>
          <p className="text-sm text-bone-dim">{toBarber?.name}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
        >
          Отказ
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover"
        >
          Премести
        </button>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-ink-muted bg-ink-soft p-6 shadow-2xl"
      >
        {children}
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

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="grid h-8 w-8 place-items-center rounded-full text-bone-dim transition hover:bg-ink-muted hover:text-bone"
      aria-label="Затвори"
    >
      ✕
    </button>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <dt className="w-20 shrink-0 text-xs uppercase tracking-widest text-bone-dim">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-sm text-bone">{value}</dd>
    </div>
  );
}
