"use client";

import { useMemo, useState } from "react";
import { useT } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency-context";
import { useServices, type ServiceRow } from "@/lib/use-services";

export default function ServicesPage() {
  const { t } = useT();
  const { format } = useCurrency();
  const { services, loading, addService, updateService, removeService } =
    useServices();

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [services, query]);

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">
            {t("services.title")}
          </h1>
          <p className="mt-1 text-sm text-bone-dim">
            {t("services.subtitle")} ·{" "}
            {t("services.count", { count: services.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover"
        >
          {t("services.add")}
        </button>
      </header>

      <div className="mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("services.search")}
          className="w-full rounded-lg border border-ink-muted bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/60 focus:border-accent focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="mt-10 text-center text-sm text-bone-dim">…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-bone-dim">
          {query ? t("services.noMatch") : t("services.empty")}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {filtered.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink-muted bg-ink-soft p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-base">{s.name}</p>
                {s.description && (
                  <p className="truncate text-xs text-bone-dim">
                    {s.description}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-bone-dim">
                  {t("services.minutes", { count: s.durationMin })}
                </p>
              </div>
              <p className="font-display text-xl text-accent">
                {format(s.priceEur, false)}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(s)}
                  className="rounded-md border border-ink-muted px-3 py-1.5 text-xs text-bone-dim transition hover:border-accent hover:text-bone"
                >
                  {t("services.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        t("services.deleteConfirm", { name: s.name })
                      )
                    ) {
                      removeService(s.id);
                    }
                  }}
                  className="rounded-md border border-ink-muted px-3 py-1.5 text-xs text-bone-dim transition hover:border-rose-400 hover:text-rose-300"
                >
                  ✗
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {(creating || editing) && (
        <ServiceFormModal
          initial={editing ?? undefined}
          isEdit={!!editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={async (input) => {
            if (editing) {
              await updateService(editing.id, input);
            } else {
              await addService(input);
            }
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}

function ServiceFormModal({
  initial,
  isEdit,
  onClose,
  onSave,
}: {
  initial?: ServiceRow;
  isEdit: boolean;
  onClose: () => void;
  onSave: (input: {
    name: string;
    description: string;
    durationMin: number;
    priceEur: number;
  }) => void;
}) {
  const { t } = useT();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const initialDuration = initial?.durationMin ?? 30;
  const [hours, setHours] = useState(Math.floor(initialDuration / 60));
  const [minutes, setMinutes] = useState(initialDuration % 60);
  const [price, setPrice] = useState(String(initial?.priceEur ?? ""));

  const durationMin = hours * 60 + minutes;
  const canSave = name.trim() && durationMin >= 5 && !isNaN(Number(price));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      durationMin,
      priceEur: Number(price),
    });
  }

  const hourOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-ink-muted bg-ink-soft p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl">
            {isEdit ? t("serviceForm.titleEdit") : t("serviceForm.titleNew")}
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
          <Field label={t("serviceForm.name")}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("serviceForm.namePlaceholder")}
              className="input"
              required
              autoFocus
            />
          </Field>
          <Field label={t("serviceForm.description")}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("serviceForm.descriptionPlaceholder")}
              className="input"
            />
          </Field>
          <Field label={t("serviceForm.durationLabel")}>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="input"
                >
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h} {t("serviceForm.hours")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="input"
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>
                      {m} {t("serviceForm.minutes")}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {durationMin < 5 && (
              <p className="mt-1.5 text-[11px] text-rose-400">
                {t("services.minutes", { count: 5 })}+
              </p>
            )}
          </Field>

          <Field label={t("serviceForm.price")}>
            <input
              type="number"
              min="0"
              step="0.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="input"
              required
            />
          </Field>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-bone-dim/30 px-5 py-2 text-sm text-bone-dim transition hover:border-bone hover:text-bone"
            >
              {t("serviceForm.cancel")}
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("serviceForm.save")}
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
