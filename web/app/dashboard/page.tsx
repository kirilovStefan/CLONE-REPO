"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  STATUS_COLOR_CLASSES,
  TIME_OFF_REASON_LABEL,
  type Appointment,
  type Barber,
  type AppointmentStatus,
  type Product,
  type ProductSale,
  type TimeOffRequest,
  type TimeOffReason,
} from "@/lib/mock-data";
import { loadSales, saveSales } from "@/lib/sales-store";
import {
  useCalendar,
  isSameDay,
  startOfDay,
  maskClientName,
  getApprovedTimeOff,
  dateToIsoDay,
} from "@/lib/calendar-context";
import { useT } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency-context";
import type { TranslationKey } from "@/lib/translations";

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
  const {
    selectedDate,
    setSelectedDate,
    currentLocationId,
    viewAs,
    timeOffRequests,
    addTimeOff,
    products,
    decrementProductStock,
    incrementProductStock,
    barbers,
    services,
    appointments,
  } = useCalendar();
  const today = useMemo(() => startOfDay(new Date()), []);
  const isToday = isSameDay(selectedDate, today);
  const isBarberView = viewAs !== "owner";
  const { localeTag } = useT();
  const [selectedBarberId, setSelectedBarberId] = useState<string | "all">(
    "all"
  );
  const [timeOffModalOpen, setTimeOffModalOpen] = useState(false);
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
  const [productSales, setProductSales] = useState<ProductSale[]>([]);
  const [salesLoaded, setSalesLoaded] = useState(false);

  const dragRef = useRef<DragInfo | null>(null);
  const dragPreviewRef = useRef<DragPreview | null>(null);
  const justFinishedDragRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrolledRef = useRef<string | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setProductSales(loadSales());
    setSalesLoaded(true);
  }, []);

  useEffect(() => {
    if (!salesLoaded) return;
    saveSales(productSales);
  }, [productSales, salesLoaded]);

  function handleSellProduct(appointmentId: string, productId: string) {
    const product = products.find((p) => p.id === productId);
    const appt = allAppointments.find((a) => a.id === appointmentId);
    if (!product || !appt) return;
    if (!decrementProductStock(productId)) {
      // Out of stock — refuse silently. The dropdown should not have shown it.
      return;
    }
    const effective = applyOverride(appt, overrides[appointmentId]);
    const sale: ProductSale = {
      id: `sale-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId,
      appointmentId,
      barberId: effective.barberId,
      price: product.price,
      commissionPct: product.commissionPct,
      soldAt: new Date().toISOString(),
    };
    setProductSales((prev) => [...prev, sale]);
  }

  function handleRemoveSale(saleId: string) {
    const sale = productSales.find((s) => s.id === saleId);
    setProductSales((prev) => prev.filter((s) => s.id !== saleId));
    if (sale) incrementProductStock(sale.productId, 1);
  }

  useEffect(() => {
    if (!containerRef.current || !now) return;
    const dayKey = selectedDate.toISOString().slice(0, 10);
    if (lastScrolledRef.current === dayKey) return;
    const targetHour = isToday ? now.getHours() : 9;
    const targetTop = (targetHour - START_HOUR) * HOUR_HEIGHT;
    containerRef.current.scrollTop = Math.max(
      0,
      targetTop - containerRef.current.clientHeight / 3
    );
    lastScrolledRef.current = dayKey;
  }, [selectedDate, now, isToday]);

  function setOverride(id: string, ov: AppointmentOverride) {
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...ov } }));
  }

  const allAppointments = useMemo(
    () => [...appointments, ...customAppointments],
    [appointments, customAppointments]
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
    const newDate = new Date(selectedDate);
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

  const visibleBarbers = useMemo(() => {
    const locationBarbers = barbers.filter(
      (b) => b.locationId === currentLocationId
    );
    if (isBarberView) {
      return locationBarbers.filter((b) => b.id === viewAs);
    }
    if (selectedBarberId !== "all") {
      return locationBarbers.filter((b) => b.id === selectedBarberId);
    }
    return locationBarbers;
  }, [currentLocationId, isBarberView, viewAs, selectedBarberId]);

  const dateLabel = selectedDate.toLocaleDateString(localeTag, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  function changeDay(delta: number) {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + delta);
    setSelectedDate(startOfDay(next));
  }

  const nowMinutesFromStart =
    now && isToday ? now.getHours() * 60 + now.getMinutes() : null;
  const nowTop =
    nowMinutesFromStart !== null
      ? (nowMinutesFromStart / 30) * ROW_HEIGHT
      : null;
  const nowLabel = now
    ? now.toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit" })
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
    const result: { appointment: Appointment; isDragging: boolean }[] = [];
    for (const a of allAppointments) {
      if (dragPreview && dragPreview.appointmentId === a.id) {
        if (dragPreview.barberId === barberId) {
          const newDate = new Date(selectedDate);
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
      if (effective.barberId !== barberId) continue;
      const apptDate = new Date(effective.startsAt);
      if (!isSameDay(apptDate, selectedDate)) continue;
      result.push({ appointment: effective, isDragging: false });
    }
    return result;
  }

  return (
    <main className="flex h-full flex-col px-4 py-4 md:px-6">
      <Toolbar
        dateLabel={dateLabel}
        isToday={isToday}
        onPrevDay={() => changeDay(-1)}
        onNextDay={() => changeDay(1)}
        onJumpToToday={() => setSelectedDate(today)}
        selectedBarberId={selectedBarberId}
        onBarberChange={setSelectedBarberId}
        currentLocationId={currentLocationId}
        isBarberView={isBarberView}
        onRequestTimeOff={() => setTimeOffModalOpen(true)}
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
            const timeOffForDay = getApprovedTimeOff(
              timeOffRequests,
              barber.id,
              selectedDate
            );
            return (
              <BarberColumn
                key={barber.id}
                barber={barber}
                appointments={barberAppts}
                timeOff={timeOffForDay}
                hoverMinutes={dragPreview ? null : hoverForThis}
                nowTop={isToday ? nowTop : null}
                now={isToday ? now : null}
                isBarberView={isBarberView}
                onHoverChange={(startMinutes) =>
                  startMinutes === null
                    ? setHover(null)
                    : setHover({ barberId: barber.id, startMinutes })
                }
                onCreate={(startMinutes) => {
                  const date = new Date(selectedDate);
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


      {newModal && (
        <NewAppointmentModal
          barberId={newModal.barberId}
          startsAt={newModal.startsAt}
          isBarberView={isBarberView}
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
          isBarberView={isBarberView}
          sales={productSales.filter(
            (s) => s.appointmentId === detailsAppointment.id
          )}
          onClose={() => setDetailsModal(null)}
          onStatusChange={handleStatusChange}
          onSellProduct={(productId) =>
            handleSellProduct(detailsAppointment.id, productId)
          }
          onRemoveSale={handleRemoveSale}
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

      {timeOffModalOpen && isBarberView && (
        <TimeOffRequestModal
          barberId={viewAs as string}
          defaultStartDate={dateToIsoDay(selectedDate)}
          onClose={() => setTimeOffModalOpen(false)}
          onSubmit={(input) => {
            addTimeOff(input);
            setTimeOffModalOpen(false);
          }}
        />
      )}
    </main>
  );
}

function Toolbar({
  dateLabel,
  isToday,
  onPrevDay,
  onNextDay,
  onJumpToToday,
  selectedBarberId,
  onBarberChange,
  currentLocationId,
  isBarberView,
  onRequestTimeOff,
}: {
  dateLabel: string;
  isToday: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onJumpToToday: () => void;
  selectedBarberId: string | "all";
  onBarberChange: (id: string | "all") => void;
  currentLocationId: string;
  isBarberView: boolean;
  onRequestTimeOff: () => void;
}) {
  const { t } = useT();
  const { barbers } = useCalendar();
  const locationBarbers = barbers.filter(
    (b) => b.locationId === currentLocationId
  );
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevDay}
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink-muted/70 text-bone-dim transition hover:border-accent hover:text-bone"
          aria-label={t("toolbar.prevDay")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="font-display text-xl capitalize md:text-[22px]">
          {dateLabel}
        </h1>
        <button
          onClick={onNextDay}
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink-muted/70 text-bone-dim transition hover:border-accent hover:text-bone"
          aria-label={t("toolbar.nextDay")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <button
          onClick={onJumpToToday}
          disabled={isToday}
          className="ml-2 rounded-lg border border-ink-muted px-3 py-1.5 text-xs uppercase tracking-wider text-bone-dim transition hover:border-accent hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("toolbar.today")}
        </button>
      </div>

      <div className="flex items-center gap-3">
        {isBarberView ? (
          <button
            type="button"
            onClick={onRequestTimeOff}
            className="rounded-lg border border-ink-muted bg-ink px-3 py-2 text-sm text-bone-dim transition hover:border-accent hover:text-bone"
          >
            {t("timeOff.requestButton")}
          </button>
        ) : (
          <select
            value={selectedBarberId}
            onChange={(e) => onBarberChange(e.target.value)}
            className="rounded-lg border border-ink-muted bg-ink px-3 py-2 text-sm text-bone focus:border-accent focus:outline-none"
          >
            <option value="all">
              {t("toolbar.allBarbers", { count: locationBarbers.length })}
            </option>
            {locationBarbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

function StatusLegend() {
  const { t } = useT();
  const statuses: { status: AppointmentStatus; key: TranslationKey }[] = [
    { status: "confirmed", key: "status.confirmed" },
    { status: "in-progress", key: "status.inProgress" },
    { status: "completed", key: "status.completed" },
    { status: "no-show", key: "status.noShow" },
  ];
  return (
    <div className="mt-3 flex shrink-0 flex-wrap gap-x-5 gap-y-2 text-xs text-bone-dim">
      {statuses.map(({ status, key }) => {
        const c = STATUS_COLOR_CLASSES[status];
        return (
          <span key={status} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
            {t(key)}
          </span>
        );
      })}
      <span className="flex items-center gap-2">
        <span className="h-px w-5 bg-red-500" />
        {t("status.currentTime")}
      </span>
      <span className="ml-auto hidden text-bone-dim/70 md:inline">
        {t("status.hint")}
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
  timeOff,
  hoverMinutes,
  nowTop,
  now,
  isBarberView,
  onHoverChange,
  onCreate,
  onAppointmentClick,
  onAppointmentMouseDown,
}: {
  barber: Barber;
  appointments: { appointment: Appointment; isDragging: boolean }[];
  timeOff: TimeOffRequest | null;
  hoverMinutes: number | null;
  nowTop: number | null;
  now: Date | null;
  isBarberView: boolean;
  onHoverChange: (startMinutes: number | null) => void;
  onCreate: (startMinutes: number) => void;
  onAppointmentClick: (id: string) => void;
  onAppointmentMouseDown: (
    id: string,
    mode: "move" | "resize",
    e: React.MouseEvent
  ) => void;
}) {
  const { t, localeTag } = useT();
  const { services } = useCalendar();
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
    if (timeOff) {
      onHoverChange(null);
      return;
    }
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
    if (timeOff) return;
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
            title={t("calendar.offHours")}
          />
        )}
        {workEndPx < TOTAL_HEIGHT && (
          <div
            className="pointer-events-none absolute inset-x-0 bg-ink/55"
            style={{ top: workEndPx, height: TOTAL_HEIGHT - workEndPx }}
            title={t("calendar.offHours")}
          />
        )}

        {hoverMinutes !== null && <HoverMarker startMinutes={hoverMinutes} />}

        {appointments.map(({ appointment, isDragging }) => (
          <AppointmentBlock
            key={appointment.id}
            appointment={appointment}
            now={now}
            isDragging={isDragging}
            isBarberView={isBarberView}
            onClick={() => onAppointmentClick(appointment.id)}
            onMouseDown={(mode, e) =>
              onAppointmentMouseDown(appointment.id, mode, e)
            }
          />
        ))}

        {timeOff && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[10] flex items-center justify-center"
            style={{
              height: TOTAL_HEIGHT,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(244,63,94,0.06) 0 8px, transparent 8px 16px)",
              backgroundColor: "rgba(244,63,94,0.18)",
            }}
          >
            <div className="rounded-2xl border border-rose-400/50 bg-ink/85 px-4 py-3 text-center shadow-xl">
              <p className="font-display text-xl tracking-widest text-rose-300">
                {t("timeOff.outOfOffice")}
              </p>
              <p className="mt-1 text-xs text-rose-200/80">
                {t(`timeOff.reason.${timeOff.reason}` as TranslationKey)}
              </p>
              <p className="mt-1 text-[10px] text-rose-200/60">
                {new Date(timeOff.startDate).toLocaleDateString(localeTag, {
                  day: "numeric",
                  month: "short",
                })}
                {" – "}
                {new Date(timeOff.endDate).toLocaleDateString(localeTag, {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          </div>
        )}

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
  const { t } = useT();
  const top = (startMinutes / 30) * ROW_HEIGHT;
  return (
    <div
      className="pointer-events-none absolute inset-x-1 z-[3] flex flex-col justify-center rounded-md border-2 border-dashed border-accent bg-accent/20 px-2 py-1 text-center text-[11px] font-medium text-accent"
      style={{ top, height: HOUR_HEIGHT - 2 }}
    >
      <p>{t("calendar.newSlot")}</p>
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
  isBarberView,
  onClick,
  onMouseDown,
}: {
  appointment: Appointment;
  now: Date | null;
  isDragging: boolean;
  isBarberView: boolean;
  onClick: () => void;
  onMouseDown: (mode: "move" | "resize", e: React.MouseEvent) => void;
}) {
  const { t, localeTag } = useT();
  const { services } = useCalendar();
  const service = services.find((s) => s.id === appointment.serviceId);
  if (!service) return null;

  const durationMin = appointment.durationMin ?? service.durationMin;
  const date = new Date(appointment.startsAt);
  const startMin = date.getHours() * 60 + date.getMinutes();
  const offsetMin = startMin - START_HOUR * 60;
  const top = (offsetMin / 30) * ROW_HEIGHT;
  const height = (durationMin / 30) * ROW_HEIGHT;

  const status = effectiveStatus(appointment, durationMin, now);
  const statusLabelKey: TranslationKey =
    status === "confirmed"
      ? "status.confirmed"
      : status === "in-progress"
        ? "status.inProgress"
        : status === "completed"
          ? "status.completed"
          : status === "no-show"
            ? "status.noShow"
            : "status.cancelled";
  const statusLabel = t(statusLabelKey);
  const colors = STATUS_COLOR_CLASSES[status];
  const startLabel = date.toLocaleTimeString(localeTag, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endDate = new Date(date.getTime() + durationMin * 60_000);
  const endLabel = endDate.toLocaleTimeString(localeTag, {
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
      className={`absolute inset-x-1.5 z-[5] cursor-grab overflow-hidden rounded-xl border-l-[5px] px-2.5 py-1.5 text-left text-[11px] leading-tight shadow-md ring-1 ring-inset transition ${colors.bg} ${colors.gradient} ${colors.border} ${colors.ring} ${
        status === "no-show" ? "opacity-75" : ""
      } ${
        isDragging
          ? "scale-[1.03] cursor-grabbing opacity-90 shadow-2xl ring-2 ring-accent"
          : "hover:scale-[1.02] hover:shadow-xl"
      }`}
      title={`${appointment.clientName} • ${service.name} • ${statusLabel}${
        appointment.notes ? "\n📝 " + appointment.notes : ""
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
        {isBarberView ? maskClientName(appointment.clientName) : appointment.clientName}
      </p>
      <p className="truncate text-bone/85">{service.name}</p>
      {!isBarberView && appointment.notes && (
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
        title={t("calendar.resizeHandle")}
      >
        <span className="h-1 w-6 rounded-full bg-bone/20 group-hover/handle:bg-accent" />
      </div>
    </div>
  );
}

function NewAppointmentModal({
  barberId,
  startsAt,
  isBarberView,
  onClose,
  onSave,
}: {
  barberId: string;
  startsAt: string;
  isBarberView: boolean;
  onClose: () => void;
  onSave: (a: Appointment) => void;
}) {
  const { t, localeTag } = useT();
  const { format } = useCurrency();
  const { barbers, services } = useCalendar();
  const barber = barbers.find((b) => b.id === barberId);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [notes, setNotes] = useState("");

  const service = services.find((s) => s.id === serviceId);
  const startDate = new Date(startsAt);
  const startLabel = startDate.toLocaleTimeString(localeTag, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endLabel = service
    ? new Date(
        startDate.getTime() + service.durationMin * 60_000
      ).toLocaleTimeString(localeTag, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const canSave =
    firstName.trim() && lastName.trim() && (isBarberView || phone.trim());

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
    if (isBarberView) {
      appt.clientPhone = "";
      appt.clientEmail = undefined;
      appt.notes = undefined;
    }
    onSave(appt);
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">{t("newAppt.title")}</h2>
          <p className="mt-1 text-sm text-bone-dim">
            {barber?.name} · {startLabel}
            {service ? `–${endLabel}` : ""}
          </p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("newAppt.firstName")}>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("newAppt.firstNamePlaceholder")}
              className="input"
              required
              autoFocus
            />
          </Field>
          <Field label={t("newAppt.lastName")}>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("newAppt.lastNamePlaceholder")}
              className="input"
              required
            />
          </Field>
        </div>
        {!isBarberView && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("newAppt.phone")}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+359 88 123 4567"
                className="input"
                required
              />
            </Field>
            <Field label={t("newAppt.email")}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ivan@example.com"
                className="input"
              />
            </Field>
          </div>
        )}
        <Field label={t("newAppt.service")}>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="input"
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.durationMin} min · {format(s.price, false)})
              </option>
            ))}
          </select>
        </Field>
        {!isBarberView && (
          <Field label={t("newAppt.notes")}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("newAppt.notesPlaceholder")}
              rows={3}
              className="input resize-none"
            />
          </Field>
        )}
        {isBarberView && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-[11px] text-emerald-200/80">
            {t("newAppt.barberHint")}
          </p>
        )}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
          >
            {t("newAppt.cancel")}
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("newAppt.submit")}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function AppointmentDetailsModal({
  appointment,
  now,
  isBarberView,
  sales,
  onClose,
  onStatusChange,
  onSellProduct,
  onRemoveSale,
}: {
  appointment: Appointment;
  now: Date | null;
  isBarberView: boolean;
  sales: ProductSale[];
  onClose: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onSellProduct: (productId: string) => void;
  onRemoveSale: (saleId: string) => void;
}) {
  const { t, localeTag } = useT();
  const { format } = useCurrency();
  const { barbers, services } = useCalendar();
  const service = services.find((s) => s.id === appointment.serviceId);
  const barber = barbers.find((b) => b.id === appointment.barberId);
  if (!service || !barber) return null;
  const durationMin = appointment.durationMin ?? service.durationMin;
  const status = effectiveStatus(appointment, durationMin, now);
  const statusLabel = t(
    (status === "confirmed"
      ? "status.confirmed"
      : status === "in-progress"
        ? "status.inProgress"
        : status === "completed"
          ? "status.completed"
          : status === "no-show"
            ? "status.noShow"
            : "status.cancelled") as TranslationKey
  );
  const colors = STATUS_COLOR_CLASSES[status];

  const startDate = new Date(appointment.startsAt);
  const startLabel = startDate.toLocaleTimeString(localeTag, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endLabel = new Date(
    startDate.getTime() + durationMin * 60_000
  ).toLocaleTimeString(localeTag, { hour: "2-digit", minute: "2-digit" });

  const statusActions: {
    status: AppointmentStatus;
    labelKey: TranslationKey;
    descKey: TranslationKey;
    icon: string;
  }[] = [
    {
      status: "confirmed",
      labelKey: "details.action.confirmed",
      descKey: "details.action.confirmedDesc",
      icon: "📅",
    },
    {
      status: "in-progress",
      labelKey: "details.action.inProgress",
      descKey: "details.action.inProgressDesc",
      icon: "✂️",
    },
    {
      status: "completed",
      labelKey: "details.action.completed",
      descKey: "details.action.completedDesc",
      icon: "💰",
    },
    {
      status: "no-show",
      labelKey: "details.action.noShow",
      descKey: "details.action.noShowDesc",
      icon: "✗",
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
            {statusLabel}
          </span>
          <h2 className="mt-2 font-display text-2xl">
            {isBarberView
              ? maskClientName(appointment.clientName)
              : appointment.clientName}
          </h2>
          <p className="mt-1 text-sm text-bone-dim">
            {startLabel}–{endLabel} · {durationMin} min · {barber.name}
          </p>
        </div>
        <CloseButton onClose={onClose} />
      </div>
      <dl className="mt-5 space-y-2 rounded-xl border border-ink-muted bg-ink/40 p-4 text-sm">
        <InfoRow
          label={t("details.service")}
          value={`${service.name} (${format(service.price, false)})`}
        />
        {!isBarberView && (
          <InfoRow label={t("details.phone")} value={appointment.clientPhone} />
        )}
        {!isBarberView && appointment.clientEmail && (
          <InfoRow label={t("details.email")} value={appointment.clientEmail} />
        )}
        {!isBarberView && appointment.notes && (
          <InfoRow
            label={t("details.note")}
            value={`📝 ${appointment.notes}`}
          />
        )}
        {isBarberView && (
          <p className="text-[11px] italic text-bone-dim/70">
            {t("details.locked")}
          </p>
        )}
      </dl>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-widest text-bone-dim">
          {t("details.changeStatus")}
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
                    {t(a.labelKey)}
                    {isActive && (
                      <span className="ml-2 text-[10px] text-bone-dim">
                        {t("details.statusActive")}
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[11px] text-bone-dim">
                    {t(a.descKey)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {!isBarberView && (
        <ProductSaleSection
          sales={sales}
          onSell={onSellProduct}
          onRemove={onRemoveSale}
        />
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
        >
          {t("details.close")}
        </button>
      </div>
    </ModalShell>
  );
}

function ProductSaleSection({
  sales,
  onSell,
  onRemove,
}: {
  sales: ProductSale[];
  onSell: (productId: string) => void;
  onRemove: (saleId: string) => void;
}) {
  const { t } = useT();
  const { format } = useCurrency();
  const { products } = useCalendar();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.stockQty > 0 &&
          (p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.barcode ?? "").includes(q))
      )
      .slice(0, 6);
  }, [query, products]);

  const totalSales = sales.reduce((sum, s) => sum + s.price, 0);
  const totalCommission = sales.reduce(
    (sum, s) => sum + (s.price * s.commissionPct) / 100,
    0
  );

  return (
    <div className="mt-5">
      <p className="text-xs uppercase tracking-widest text-bone-dim">
        {t("products.title")}
      </p>

      <div className="relative mt-3">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 150);
          }}
          placeholder={t("products.searchPlaceholder")}
          className="input"
        />
        {showDropdown && matches.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-64 overflow-y-auto rounded-xl border border-ink-muted bg-ink-soft shadow-2xl">
            {matches.map((p) => {
              const isLow = p.stockQty <= p.lowStockThreshold;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSell(p.id);
                      setQuery("");
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-accent/15"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-[11px] text-bone-dim">
                        {p.brand} · {p.category} ·{" "}
                        {t("products.commissionPct", { pct: p.commissionPct })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-accent">
                        {format(p.price, false)}
                      </span>
                      <p
                        className={`text-[10px] ${
                          isLow ? "text-rose-300" : "text-bone-dim/70"
                        }`}
                      >
                        {t("products.lowStockHint", { count: p.stockQty })}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {showDropdown && query.trim() && matches.length === 0 && (
          <div className="absolute inset-x-0 top-full z-10 mt-1 rounded-xl border border-ink-muted bg-ink-soft p-3 text-sm text-bone-dim shadow-2xl">
            {t("products.noMatch", { query })}
          </div>
        )}
      </div>

      {sales.length > 0 && (
        <div className="mt-3">
          <ul className="space-y-1.5">
            {sales.map((sale) => {
              const product = products.find((p) => p.id === sale.productId);
              const commission = (sale.price * sale.commissionPct) / 100;
              return (
                <li
                  key={sale.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-ink-muted bg-ink/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      {product?.name ?? t("products.deletedProduct")}
                    </p>
                    <p className="text-[10px] text-bone-dim">
                      {t("products.commissionLine", {
                        price: format(commission, false),
                        pct: sale.commissionPct,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-accent">
                      {format(sale.price, false)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(sale.id)}
                      className="text-bone-dim transition hover:text-rose-400"
                      aria-label={t("products.removeSale")}
                    >
                      ✗
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-accent/10 px-3 py-2 text-sm">
            <span className="text-bone-dim">
              {t("products.totalLabel", { count: sales.length })}
            </span>
            <span>
              <span className="font-display text-base text-accent">
                {format(totalSales, false)}
              </span>
              <span className="ml-2 text-[11px] text-bone-dim">
                {t("products.commissionTotal", {
                  price: format(totalCommission, false),
                })}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeOffRequestModal({
  barberId,
  defaultStartDate,
  onClose,
  onSubmit,
}: {
  barberId: string;
  defaultStartDate: string;
  onClose: () => void;
  onSubmit: (input: {
    barberId: string;
    startDate: string;
    endDate: string;
    reason: TimeOffReason;
    notes?: string;
  }) => void;
}) {
  const { t } = useT();
  const { barbers } = useCalendar();
  const barber = barbers.find((b) => b.id === barberId);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultStartDate);
  const [reason, setReason] = useState<TimeOffReason>("vacation");
  const [notes, setNotes] = useState("");

  const canSubmit = !!startDate && !!endDate && startDate <= endDate;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      barberId,
      startDate,
      endDate,
      reason,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">{t("timeOff.title")}</h2>
          <p className="mt-1 text-sm text-bone-dim">
            {barber?.name} · {t("timeOff.subtitle")}
          </p>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("timeOff.fromDate")}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
              required
              autoFocus
            />
          </Field>
          <Field label={t("timeOff.toDate")}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="input"
              required
            />
          </Field>
        </div>

        <Field label={t("timeOff.reason")}>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as TimeOffReason)}
            className="input"
          >
            <option value="vacation">{t("timeOff.reason.vacation")}</option>
            <option value="course">{t("timeOff.reason.course")}</option>
            <option value="sick">{t("timeOff.reason.sick")}</option>
            <option value="personal">{t("timeOff.reason.personal")}</option>
            <option value="other">{t("timeOff.reason.other")}</option>
          </select>
        </Field>

        <Field label={t("timeOff.notes")}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("timeOff.notesPlaceholder")}
            rows={3}
            className="input resize-none"
          />
        </Field>

        {!canSubmit && startDate && endDate && startDate > endDate && (
          <p className="text-xs text-rose-400">{t("timeOff.error.dates")}</p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
          >
            {t("timeOff.cancel")}
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("timeOff.submit")}
          </button>
        </div>
      </form>
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
  const { t } = useT();
  const { barbers } = useCalendar();
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
          <h2 className="font-display text-2xl">{t("move.title")}</h2>
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
            {t("move.from")}
          </p>
          <p className="mt-1 font-display text-lg">
            {fromTime}–{fromEnd}
          </p>
          <p className="text-sm text-bone-dim">{fromBarber?.name}</p>
        </div>
        <div className="flex justify-center text-accent">↓</div>
        <div className="rounded-xl border border-accent/60 bg-accent/10 p-4">
          <p className="text-xs uppercase tracking-widest text-accent">
            {t("move.to")}
          </p>
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
          {t("move.cancel")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover"
        >
          {t("move.confirm")}
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
