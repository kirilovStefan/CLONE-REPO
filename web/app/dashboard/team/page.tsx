"use client";

import { useMemo, useState } from "react";
import { useCalendar } from "@/lib/calendar-context";
import { useT } from "@/lib/i18n";
import { type Barber, type Location } from "@/lib/mock-data";

export default function TeamPage() {
  const {
    barbers,
    addBarber,
    updateBarber,
    removeBarber,
    locations,
    currentLocationId,
  } = useCalendar();
  const { t } = useT();

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Barber | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inLocation = barbers.filter((b) => b.locationId === currentLocationId);
    if (!q) return inLocation;
    return inLocation.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.title.toLowerCase().includes(q) ||
        b.specialties.some((s) => s.toLowerCase().includes(q))
    );
  }, [barbers, currentLocationId, query]);

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">
            {t("team.title")}
          </h1>
          <p className="mt-1 text-sm text-bone-dim">
            {t("team.subtitle")} ·{" "}
            {t("team.count", { count: filtered.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover"
        >
          {t("team.addButton")}
        </button>
      </header>

      <div className="mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("team.searchPlaceholder")}
          className="w-full rounded-lg border border-ink-muted bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/60 focus:border-accent focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-bone-dim">
          {query ? t("team.noMatch") : t("team.empty")}
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          {filtered.map((b) => (
            <BarberCard
              key={b.id}
              barber={b}
              onEdit={() => setEditing(b)}
              onDelete={() => {
                if (
                  window.confirm(
                    t("team.deleteConfirm", { name: b.name })
                  )
                ) {
                  removeBarber(b.id);
                }
              }}
            />
          ))}
        </ul>
      )}

      {(creating || editing) && (
        <BarberFormModal
          initial={editing ?? undefined}
          locations={locations}
          defaultLocationId={currentLocationId}
          isEdit={!!editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={(input) => {
            if (editing) {
              updateBarber(editing.id, input);
            } else {
              addBarber(input);
            }
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}

function BarberCard({
  barber,
  onEdit,
  onDelete,
}: {
  barber: Barber;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useT();
  const initials = barber.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <li className="rounded-2xl border border-ink-muted bg-ink-soft p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/20 font-display text-base font-medium text-accent">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight">{barber.name}</p>
          <p className="text-sm text-bone-dim">{barber.title}</p>
          <p className="mt-2 text-xs text-bone-dim">
            {t("team.workHours")}:{" "}
            <span className="font-medium text-bone">
              {String(barber.workStart).padStart(2, "0")}:00 –{" "}
              {String(barber.workEnd).padStart(2, "0")}:00
            </span>
          </p>
          <p className="text-xs text-bone-dim">
            ★ {barber.rating} ·{" "}
            {t("team.reviews", { count: barber.reviewsCount })}
          </p>
          {barber.specialties.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {barber.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-ink-muted px-2 py-0.5 text-[10px] text-bone-dim"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-md border border-ink-muted px-3 py-1.5 text-xs text-bone-dim transition hover:border-accent hover:text-bone"
        >
          ✏️ {t("clients.action.edit")}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-ink-muted px-3 py-1.5 text-xs text-bone-dim transition hover:border-rose-400 hover:text-rose-300"
        >
          ✗
        </button>
      </div>
    </li>
  );
}

function BarberFormModal({
  initial,
  locations,
  defaultLocationId,
  isEdit,
  onClose,
  onSave,
}: {
  initial?: Barber;
  locations: Location[];
  defaultLocationId: string;
  isEdit: boolean;
  onClose: () => void;
  onSave: (input: Omit<Barber, "id">) => void;
}) {
  const { t } = useT();
  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "Barber");
  const [locationId, setLocationId] = useState(
    initial?.locationId ?? defaultLocationId
  );
  const [workStart, setWorkStart] = useState(String(initial?.workStart ?? 9));
  const [workEnd, setWorkEnd] = useState(String(initial?.workEnd ?? 18));
  const [specialtiesText, setSpecialtiesText] = useState(
    initial?.specialties.join(", ") ?? ""
  );

  const startNum = Number(workStart);
  const endNum = Number(workEnd);
  const canSave =
    name.trim() &&
    locationId &&
    !isNaN(startNum) &&
    !isNaN(endNum) &&
    startNum >= 0 &&
    endNum <= 24 &&
    endNum > startNum;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      name: name.trim(),
      title: title.trim() || "Barber",
      locationId,
      workStart: startNum,
      workEnd: endNum,
      specialties: specialtiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      rating: initial?.rating ?? 5.0,
      reviewsCount: initial?.reviewsCount ?? 0,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-ink-muted bg-ink-soft p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl">
            {isEdit ? t("teamForm.titleEdit") : t("teamForm.titleNew")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-bone-dim transition hover:bg-ink-muted hover:text-bone"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <Field label={t("teamForm.name")}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("teamForm.namePlaceholder")}
              className="input"
              required
              autoFocus
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("teamForm.titleField")}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("teamForm.titleFieldPlaceholder")}
                className="input"
              />
            </Field>
            <Field label={t("teamForm.location")}>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="input"
                required
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("teamForm.workStart")}>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
                className="input"
                required
              />
            </Field>
            <Field label={t("teamForm.workEnd")}>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
                className="input"
                required
              />
            </Field>
          </div>

          <Field label={t("teamForm.specialties")}>
            <input
              type="text"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder={t("teamForm.specialtiesPlaceholder")}
              className="input"
            />
          </Field>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
            >
              {t("teamForm.cancel")}
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("teamForm.save")}
            </button>
          </div>
        </form>
        <style jsx>{`
          :global(.input) {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid rgb(42 42 48);
            background: rgb(var(--ink) / 1);
            padding: 0.625rem 0.875rem;
            font-size: 0.875rem;
            color: rgb(var(--bone) / 1);
            outline: none;
            transition: border-color 0.15s;
          }
          :global(.input:focus) {
            border-color: rgb(var(--accent) / 1);
          }
          :global(.input::placeholder) {
            color: rgb(var(--bone-dim) / 0.5);
          }
        `}</style>
      </div>
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
