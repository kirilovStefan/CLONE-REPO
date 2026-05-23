"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { useTheme } from "@/lib/theme-context";
import type { ThemeMode } from "@/lib/theme-store";

export default function SettingsPage() {
  const { t } = useT();
  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-6">
      <header>
        <h1 className="font-display text-2xl md:text-3xl">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-bone-dim">{t("settings.subtitle")}</p>
      </header>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ThemeSection />
        <BusinessSection />
        <PlaceholderSection
          titleKey="settings.notifications.title"
          subtitleKey="settings.notifications.subtitle"
        />
        <PlaceholderSection
          titleKey="settings.subscription.title"
          subtitleKey="settings.subscription.subtitle"
        />
      </div>

      <DangerSection />
    </main>
  );
}

function ThemeSection() {
  const { t } = useT();
  const { mode, setMode } = useTheme();
  const options: { value: ThemeMode; labelKey: string; icon: string }[] = [
    { value: "light", labelKey: "settings.theme.light", icon: "☀️" },
    { value: "dark", labelKey: "settings.theme.dark", icon: "🌙" },
    { value: "system", labelKey: "settings.theme.system", icon: "🖥️" },
  ];

  return (
    <section className="rounded-2xl border border-ink-muted bg-ink-soft p-5">
      <h2 className="font-display text-lg">{t("settings.theme.title")}</h2>
      <p className="mt-1 text-sm text-bone-dim">{t("settings.theme.subtitle")}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isActive = mode === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMode(opt.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition ${
                isActive
                  ? "border-accent bg-accent/10 text-bone"
                  : "border-ink-muted text-bone-dim hover:border-accent/60 hover:bg-ink-muted/30"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span>
                {t(opt.labelKey as Parameters<typeof t>[0])}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BusinessSection() {
  const { t } = useT();
  const [businessName, setBusinessName] = useState("My Barbershop");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <section className="rounded-2xl border border-ink-muted bg-ink-soft p-5">
      <h2 className="font-display text-lg">{t("settings.account.title")}</h2>
      <p className="mt-1 text-sm text-bone-dim">
        {t("settings.account.subtitle")}
      </p>
      <div className="mt-4 space-y-3">
        <Field label={t("settings.account.businessName")}>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="settings-input"
          />
        </Field>
        <Field label={t("settings.account.email")}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@my-barbershop.bg"
            className="settings-input"
          />
        </Field>
        <Field label={t("settings.account.phone")}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+359 88 123 4567"
            className="settings-input"
          />
        </Field>
        <p className="text-[11px] italic text-bone-dim/70">
          {t("settings.account.saveSoon")}
        </p>
      </div>
      <style jsx>{`
        :global(.settings-input) {
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
        :global(.settings-input:focus) {
          border-color: rgb(var(--accent) / 1);
        }
        :global(.settings-input::placeholder) {
          color: rgb(var(--bone-dim) / 0.5);
        }
      `}</style>
    </section>
  );
}

function PlaceholderSection({
  titleKey,
  subtitleKey,
}: {
  titleKey: string;
  subtitleKey: string;
}) {
  const { t } = useT();
  return (
    <section className="rounded-2xl border border-ink-muted/60 bg-ink-soft p-5 opacity-70">
      <h2 className="font-display text-lg">
        {t(titleKey as Parameters<typeof t>[0])}
      </h2>
      <p className="mt-1 text-sm text-bone-dim">
        {t(subtitleKey as Parameters<typeof t>[0])}
      </p>
      <span className="mt-3 inline-block rounded-full bg-ink-muted/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-bone-dim">
        {t("settings.placeholder.soon")}
      </span>
    </section>
  );
}

function DangerSection() {
  const { t } = useT();

  function handleResetDemo() {
    if (!window.confirm(t("settings.danger.resetConfirm"))) return;
    const keys = [
      "barberos-product-sales",
      "barberos-time-off",
      "barberos-inventory",
      "barberos-clients",
      "barberos-team",
    ];
    for (const k of keys) {
      try {
        window.localStorage.removeItem(k);
      } catch {
        // ignore
      }
    }
    window.alert(t("settings.danger.resetDone"));
    window.location.reload();
  }

  return (
    <section className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
      <h2 className="font-display text-lg text-rose-200">
        {t("settings.danger.title")}
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleResetDemo}
          className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/15"
        >
          {t("settings.danger.resetDemo")}
        </button>
        <button
          type="button"
          disabled
          className="rounded-lg border border-bone-dim/30 px-4 py-2 text-sm text-bone-dim/60"
        >
          {t("settings.danger.logout")}
        </button>
      </div>
    </section>
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
