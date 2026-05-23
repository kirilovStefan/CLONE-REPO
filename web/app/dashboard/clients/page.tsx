"use client";

import { useMemo, useState } from "react";
import { useCalendar } from "@/lib/calendar-context";
import { useT } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency-context";
import {
  services,
  todaysAppointments,
  type Client,
} from "@/lib/mock-data";

type ClientStats = {
  visitsCount: number;
  totalSpent: number;
  lastVisit: Date | null;
  favoriteBarberId: string | null;
};

function computeStats(phone: string): ClientStats {
  const visits = todaysAppointments.filter((a) => a.clientPhone === phone);
  const totalSpent = visits.reduce((sum, a) => {
    const s = services.find((sv) => sv.id === a.serviceId);
    return sum + (s?.price ?? 0);
  }, 0);
  let lastVisit: Date | null = null;
  for (const v of visits) {
    const d = new Date(v.startsAt);
    if (!lastVisit || d > lastVisit) lastVisit = d;
  }
  const barberCounts: Record<string, number> = {};
  for (const v of visits) {
    barberCounts[v.barberId] = (barberCounts[v.barberId] ?? 0) + 1;
  }
  let favoriteBarberId: string | null = null;
  let max = 0;
  for (const [id, count] of Object.entries(barberCounts)) {
    if (count > max) {
      max = count;
      favoriteBarberId = id;
    }
  }
  return {
    visitsCount: visits.length,
    totalSpent,
    lastVisit,
    favoriteBarberId,
  };
}

export default function ClientsPage() {
  const { clients, addClient, updateClient, removeClient, barbers, viewAs } =
    useCalendar();
  const { t, localeTag } = useT();

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);

  const isBarberView = viewAs !== "owner";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const full = `${c.firstName} ${c.lastName}`.toLowerCase();
      return (
        full.includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [clients, query]);

  if (isBarberView) {
    return (
      <main className="h-full overflow-y-auto px-4 py-6 md:px-6">
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-center">
          <p className="font-display text-xl text-rose-200">🔒</p>
          <p className="mt-2 text-sm text-rose-200">
            {t("clients.barberOnlyWarning")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl">
            {t("clients.title")}
          </h1>
          <p className="mt-1 text-sm text-bone-dim">
            {t("clients.subtitle")} ·{" "}
            {t("clients.count", { count: clients.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover"
        >
          {t("clients.addButton")}
        </button>
      </header>

      <div className="mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("clients.searchPlaceholder")}
          className="w-full rounded-lg border border-ink-muted bg-ink-soft px-3 py-2 text-sm text-bone placeholder:text-bone-dim/60 focus:border-accent focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-bone-dim">
          {query ? t("clients.noMatch") : t("clients.empty")}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {filtered.map((c) => (
            <ClientRow
              key={c.id}
              client={c}
              barberName={
                computeStats(c.phone).favoriteBarberId
                  ? barbers.find(
                      (b) =>
                        b.id === computeStats(c.phone).favoriteBarberId
                    )?.name ?? null
                  : null
              }
              onEdit={() => setEditing(c)}
              onDelete={() => {
                if (
                  window.confirm(
                    t("clients.deleteConfirm", {
                      name: `${c.firstName} ${c.lastName}`,
                    })
                  )
                ) {
                  removeClient(c.id);
                }
              }}
              localeTag={localeTag}
              t={t}
            />
          ))}
        </ul>
      )}

      {(creating || editing) && (
        <ClientFormModal
          initial={editing ?? undefined}
          isEdit={!!editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={(input) => {
            if (editing) {
              updateClient(editing.id, input);
            } else {
              addClient(input);
            }
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}

function ClientRow({
  client,
  barberName,
  onEdit,
  onDelete,
  localeTag,
  t,
}: {
  client: Client;
  barberName: string | null;
  onEdit: () => void;
  onDelete: () => void;
  localeTag: string;
  t: ReturnType<typeof useT>["t"];
}) {
  const { format } = useCurrency();
  const stats = computeStats(client.phone);
  const phoneClean = client.phone.replace(/[^\d+]/g, "");
  const phoneDigits = client.phone.replace(/[^\d]/g, "");
  const fullName = `${client.firstName} ${client.lastName}`.trim();
  const initials =
    (client.firstName[0] ?? "?") + (client.lastName[0] ?? "");

  return (
    <li className="rounded-2xl border border-ink-muted bg-ink-soft p-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/20 font-display text-base font-medium text-accent">
          {initials.toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight">{fullName}</p>
          <p className="text-sm text-bone-dim">
            {client.phone}
            {client.email && (
              <>
                {" · "}
                {client.email}
              </>
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-bone-dim">
            <span>
              {stats.visitsCount === 1
                ? t("clients.singleVisit", { count: stats.visitsCount })
                : t("clients.visitsCount", { count: stats.visitsCount })}
            </span>
            {stats.totalSpent > 0 && (
              <span className="text-accent">{format(stats.totalSpent, false)}</span>
            )}
            {stats.lastVisit ? (
              <span>
                {t("clients.lastVisit", {
                  date: stats.lastVisit.toLocaleDateString(localeTag, {
                    day: "numeric",
                    month: "short",
                  }),
                })}
              </span>
            ) : (
              <span>{t("clients.noVisits")}</span>
            )}
            {barberName && (
              <span>{t("clients.favoriteBarber", { name: barberName })}</span>
            )}
          </div>
          {client.notes && (
            <p className="mt-2 text-[11px] italic text-bone-dim/80">
              📝 {client.notes}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <ActionButton
            href={`tel:${phoneClean}`}
            label={t("clients.action.call")}
            icon="📞"
          />
          <ActionButton
            href={`sms:${phoneClean}`}
            label={t("clients.action.sms")}
            icon="💬"
          />
          {client.email && (
            <ActionButton
              href={`mailto:${client.email}`}
              label={t("clients.action.email")}
              icon="📧"
            />
          )}
          <ActionButton
            href={`viber://chat?number=${encodeURIComponent(phoneClean)}`}
            label={t("clients.action.viber")}
            icon="💜"
          />
          <ActionButton
            href={`https://wa.me/${phoneDigits}`}
            label={t("clients.action.whatsapp")}
            icon="💚"
            external
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2 border-t border-ink-muted/40 pt-3">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-ink-muted px-3 py-1.5 text-xs text-bone-dim transition hover:border-accent hover:text-bone"
        >
          {t("clients.action.edit")}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-ink-muted px-3 py-1.5 text-xs text-bone-dim transition hover:border-rose-400 hover:text-rose-300"
        >
          {t("clients.action.delete")}
        </button>
      </div>
    </li>
  );
}

function ActionButton({
  href,
  label,
  icon,
  external = false,
}: {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-ink-muted bg-ink/60 text-base transition hover:border-accent hover:bg-accent/10"
    >
      {icon}
    </a>
  );
}

function ClientFormModal({
  initial,
  isEdit,
  onClose,
  onSave,
}: {
  initial?: Client;
  isEdit: boolean;
  onClose: () => void;
  onSave: (input: Omit<Client, "id" | "createdAt">) => void;
}) {
  const { t } = useT();
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const canSave = firstName.trim() && phone.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  }

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
            {isEdit ? t("clientForm.titleEdit") : t("clientForm.titleNew")}
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
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("clientForm.firstName")}>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input"
                required
                autoFocus
              />
            </Field>
            <Field label={t("clientForm.lastName")}>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input"
              />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={t("clientForm.phone")}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+359 88 123 4567"
                className="input"
                required
              />
            </Field>
            <Field label={t("clientForm.email")}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </Field>
          </div>
          <Field label={t("clientForm.notes")}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("clientForm.notesPlaceholder")}
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
              {t("clientForm.cancel")}
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("clientForm.save")}
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
