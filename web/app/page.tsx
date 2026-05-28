"use client";

import Link from "next/link";
import { LanguageStrip, useT } from "@/lib/i18n";
import { useCurrency } from "@/lib/currency-context";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <LanguageStrip />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Testimonial />
      <AITease />
      <FinalCTA />
      <Footer />
    </main>
  );
}

function Nav() {
  const { t } = useT();
  return (
    <nav className="sticky top-0 z-50 border-b border-ink-muted/60 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo size="md" />
          <span className="font-display text-xl tracking-wide">BarberOS</span>
        </Link>
        <div className="hidden gap-8 text-sm text-bone-dim md:flex">
          <a href="#how" className="transition hover:text-bone">
            {t("landing.nav.why")}
          </a>
          <a href="#features" className="transition hover:text-bone">
            {t("landing.nav.features")}
          </a>
          <a href="#pricing" className="transition hover:text-bone">
            {t("landing.nav.pricing")}
          </a>
          <Link href="/dashboard" className="transition hover:text-bone">
            {t("landing.nav.demo")}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-bone-dim transition hover:text-bone"
          >
            {t("landing.nav.login")}
          </Link>
          <Link
            href="/signup"
            className="bg-gold-gradient rounded-full px-5 py-2.5 text-sm font-semibold text-[#1a1407] shadow-[0_8px_24px_rgba(216,179,106,0.25)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_30px_rgba(216,179,106,0.4)]"
          >
            {t("landing.nav.cta")}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const { t } = useT();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_0%,_rgba(216,179,106,0.18),_transparent_60%),radial-gradient(40%_40%_at_10%_30%,_rgba(216,179,106,0.07),_transparent_60%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1.05fr_0.95fr] md:py-24">
        <div className="flex flex-col justify-center">
          <span className="mb-5 w-fit rounded-full border border-accent/35 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.28em] text-accent">
            {t("landing.hero.badge")}
          </span>
          <h1 className="font-display text-5xl leading-[1.04] tracking-tight md:text-6xl">
            {t("landing.hero.titleA")}
            <br />
            <span className="text-gold-gradient">{t("landing.hero.titleB")}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-bone-dim">
            {t("landing.hero.sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="bg-gold-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-[#1a1407] shadow-[0_8px_30px_rgba(216,179,106,0.25)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_38px_rgba(216,179,106,0.38)]"
            >
              {t("landing.hero.tryFree")} →
            </Link>
            <a
              href="#how"
              className="rounded-full border border-bone-dim/30 px-6 py-3.5 font-medium text-bone transition hover:border-bone"
            >
              {t("landing.hero.seePlans")}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-bone-dim">
            <span>
              <span className="text-accent">★</span> {t("landing.hero.trust.rating")}
            </span>
            <span className="h-1 w-1 rounded-full bg-bone-dim/50" />
            <span>{t("landing.hero.trust.salons")}</span>
            <span className="h-1 w-1 rounded-full bg-bone-dim/50" />
            <span>{t("landing.hero.trust.noCard")}</span>
          </div>
        </div>

        <HeroCalendarPanel />
      </div>
    </section>
  );
}

function HeroCalendarPanel() {
  return (
    <div className="relative hidden md:block">
      <div className="overflow-hidden rounded-2xl border border-ink-muted bg-gradient-to-b from-ink-soft to-ink-card shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 border-b border-ink-muted/70 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-rose-400/70" />
          <span className="h-2 w-2 rounded-full bg-accent/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
          <span className="ml-2 text-[11px] text-bone-dim">
            BarberOS · Календар
          </span>
        </div>
        <div className="grid grid-cols-[34px_1fr_1fr_1fr] text-[10px]">
          <div>
            <div className="h-[30px]" />
            {["10", "11", "12", "13", "14"].map((h) => (
              <div
                key={h}
                className="h-[34px] border-t border-ink-muted/40 pr-1.5 pt-0.5 text-right text-bone-dim/70"
              >
                {h}
              </div>
            ))}
          </div>
          <HeroColumn name="Иван">
            <HeroEv top={38} h={30} tone="green" time="10:00" label="Подстригване" />
            <HeroEv top={90} h={24} tone="violet" time="12:00" label="Брада" />
            <HeroEv top={150} h={34} tone="amber" time="14:00" label="Fade + брада" />
          </HeroColumn>
          <HeroColumn name="Георги">
            <HeroEv top={46} h={44} tone="violet" time="10:30" label="Hot towel" />
            <HeroEv top={120} h={30} tone="green" time="13:00" label="Подстригване" />
          </HeroColumn>
          <HeroColumn name="Мартин">
            <HeroEv top={60} h={24} tone="rose" time="11:00" label="Детска" />
            <HeroEv top={110} h={30} tone="green" time="12:30" label="Класика" />
          </HeroColumn>
        </div>
      </div>

      <div className="absolute -right-2 bottom-6 w-[195px] rounded-2xl border border-ink-muted bg-ink-card p-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
        <span className="text-[10px] uppercase tracking-[0.16em] text-accent">
          Нова резервация
        </span>
        <p className="mt-1 text-sm font-semibold">Стоян И.</p>
        <p className="text-[13px] text-bone-dim">14:00 · Fade + брада</p>
        <div className="mt-3 flex gap-2">
          <span className="flex-1 rounded-md bg-emerald-500/15 py-1.5 text-center text-xs text-emerald-200">
            Потвърди
          </span>
          <span className="rounded-md bg-rose-500/15 px-3 py-1.5 text-center text-xs text-rose-200">
            ✕
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroColumn({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative border-l border-ink-muted/40">
      <div className="sticky top-0 grid h-[30px] place-items-center border-b border-ink-muted/50 bg-ink-soft text-[10px] text-bone-dim">
        {name}
      </div>
      {children}
    </div>
  );
}

const HERO_EV_TONES = {
  green: "bg-gradient-to-br from-emerald-200 to-emerald-500",
  violet: "bg-gradient-to-br from-violet-200 to-violet-500",
  amber: "bg-gold-gradient",
  rose: "bg-gradient-to-br from-rose-200 to-rose-400",
} as const;

function HeroEv({
  top,
  h,
  tone,
  time,
  label,
}: {
  top: number;
  h: number;
  tone: keyof typeof HERO_EV_TONES;
  time: string;
  label: string;
}) {
  return (
    <div
      className={`absolute left-[5px] right-[5px] rounded-lg px-1.5 py-1 text-[9px] font-semibold leading-tight text-[#0a0a0b] shadow-[0_4px_12px_rgba(0,0,0,0.3)] ${HERO_EV_TONES[tone]}`}
      style={{ top, height: h }}
    >
      {time}
      <span className="block text-[8px] font-medium opacity-80">{label}</span>
    </div>
  );
}

function HowItWorks() {
  const { t } = useT();
  const steps = [
    {
      no: 1,
      titleKey: "landing.how.s1.title" as const,
      descKey: "landing.how.s1.desc" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
    },
    {
      no: 2,
      titleKey: "landing.how.s2.title" as const,
      descKey: "landing.how.s2.desc" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      no: 3,
      titleKey: "landing.how.s3.title" as const,
      descKey: "landing.how.s3.desc" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      ),
    },
  ];
  return (
    <section id="how" className="border-t border-ink-muted/50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <span className="rounded-full border border-accent/35 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.28em] text-accent">
            {t("landing.how.eyebrow")}
          </span>
          <h2 className="mt-5 font-display text-4xl leading-tight md:text-[38px]">
            {t("landing.how.title")}
          </h2>
          <p className="mt-3 text-bone-dim md:text-[17px]">
            {t("landing.how.sub")}
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.no}
              className="relative rounded-2xl border border-ink-muted bg-ink-soft p-7"
            >
              <span className="absolute right-7 top-7 text-accent/80">
                {step.icon}
              </span>
              <p className="text-gold-gradient font-display text-5xl leading-none">
                {step.no}
              </p>
              <h3 className="mt-4 font-display text-lg">{t(step.titleKey)}</h3>
              <p className="mt-2 text-[15px] text-bone-dim">{t(step.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useT();
  const items = [
    {
      labelKey: "landing.features.bookings" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      labelKey: "landing.features.multiLocation" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      labelKey: "landing.features.teamSchedules" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      labelKey: "landing.features.crm" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      labelKey: "landing.features.inventory" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        </svg>
      ),
    },
    {
      labelKey: "landing.features.reports" as const,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];
  return (
    <section id="features" className="border-t border-ink-muted/50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <h2 className="font-display text-4xl leading-tight md:text-[38px]">
            {t("landing.features.title")}
          </h2>
          <p className="mt-3 text-bone-dim md:text-[17px]">
            {t("landing.features.sub")}
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.labelKey}
              className="group flex items-center gap-4 rounded-2xl border border-ink-muted bg-ink-soft p-6 transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                {item.icon}
              </div>
              <h3 className="font-display text-lg leading-snug">
                {t(item.labelKey)}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { t } = useT();
  return (
    <section id="pricing" className="border-t border-ink-muted/50 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-4xl leading-tight md:text-[38px]">
            {t("landing.pricing.title")}
          </h2>
          <p className="mt-3 text-bone-dim md:text-[17px]">
            {t("landing.pricing.sub")}
          </p>
        </div>
        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          <PlanCard
            nameKey="landing.plan.start.name"
            taglineKey="landing.plan.start.tagline"
            priceEur={19}
            features={[
              "1 локация",
              "До 2 бръснари",
              "Календар + резервации",
              "50 SMS / месец",
              "Базови отчети",
            ]}
          />
          <PlanCard
            nameKey="landing.plan.pro.name"
            taglineKey="landing.plan.pro.tagline"
            priceEur={49}
            popular
            features={[
              "До 3 локации",
              "До 10 бръснари",
              "Inventory + продукти + комисионни",
              "Клиентска база (CRM)",
              "QR код + публичен booking link",
              "200 SMS / месец",
            ]}
          />
          <PlanCard
            nameKey="landing.plan.premium.name"
            taglineKey="landing.plan.premium.tagline"
            priceEur={99}
            features={[
              "Неограничен брой локации",
              "AI рецепционист (скоро)",
              "Маркетинг автоматизация",
              "Бели лейбъл / собствено приложение",
              "Поддръжка 24/7 + API",
            ]}
          />
        </div>
        <p className="mt-8 text-center text-xs text-bone-dim">
          {t("landing.pricing.fineprint")}
        </p>
      </div>
    </section>
  );
}

function PlanCard({
  nameKey,
  taglineKey,
  priceEur,
  features,
  popular = false,
}: {
  nameKey: Parameters<ReturnType<typeof useT>["t"]>[0];
  taglineKey: Parameters<ReturnType<typeof useT>["t"]>[0];
  priceEur: number;
  features: string[];
  popular?: boolean;
}) {
  const { t } = useT();
  const { format } = useCurrency();
  const name = t(nameKey);
  const priceLabel = format(priceEur, false);
  return (
    <div
      className={`relative rounded-2xl border p-8 ${
        popular
          ? "border-accent/60 bg-gradient-to-b from-accent/[0.06] to-transparent shadow-[0_20px_60px_rgba(216,179,106,0.12)]"
          : "border-ink-muted bg-ink-soft"
      }`}
    >
      {popular && (
        <span className="bg-gold-gradient absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1407]">
          {t("landing.pricing.popular")}
        </span>
      )}
      <p className="font-display text-2xl">{name}</p>
      <p className="text-sm text-bone-dim">{t(taglineKey)}</p>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-gold-gradient font-display text-[52px] leading-none">
          {priceLabel}
        </span>
        <span className="text-sm text-bone-dim">
          {t("landing.pricing.perMonth")}
        </span>
      </div>
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span className="mt-0.5 text-accent">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`mt-7 block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
          popular
            ? "bg-gold-gradient text-[#1a1407] shadow-[0_8px_24px_rgba(216,179,106,0.25)] hover:translate-y-[-1px]"
            : "border border-bone-dim/30 text-bone hover:border-bone"
        }`}
      >
        {t("landing.pricing.choose", { name })}
      </Link>
    </div>
  );
}

function Testimonial() {
  const { t } = useT();
  return (
    <section className="border-t border-ink-muted/50 py-20 md:py-24">
      <div className="mx-auto grid max-w-3xl place-items-center px-6 text-center">
        <div className="text-accent text-xl tracking-[3px]">★★★★★</div>
        <blockquote className="mt-5 font-display text-2xl leading-snug md:text-[30px]">
          „{t("landing.testimonial.quote")}"
        </blockquote>
        <p className="mt-6 text-sm text-bone-dim">
          — {t("landing.testimonial.by")}
        </p>
      </div>
    </section>
  );
}

function AITease() {
  const { t } = useT();
  return (
    <section className="border-t border-ink-muted/50 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-4xl">🤖</span>
            <span className="rounded-full border border-accent/40 px-3 py-1 text-[10px] uppercase tracking-widest text-accent">
              {t("landing.ai.badge")}
            </span>
          </div>
          <h2 className="mt-6 font-display text-3xl md:text-4xl">
            {t("landing.ai.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-bone-dim">{t("landing.ai.desc")}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-bone-dim">
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              📞
            </span>
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              💬
            </span>
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              📧
            </span>
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              🔔
            </span>
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              📅
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { t } = useT();
  return (
    <section className="border-t border-ink-muted/50 py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="rounded-full border border-accent/35 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.28em] text-accent">
          {t("landing.hero.badge")}
        </span>
        <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
          {t("landing.final.title")}
        </h2>
        <p className="mt-4 text-bone-dim">{t("landing.final.sub")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="bg-gold-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-[#1a1407] shadow-[0_8px_30px_rgba(216,179,106,0.25)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_38px_rgba(216,179,106,0.4)]"
          >
            {t("landing.final.start")} →
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-bone-dim/30 px-8 py-4 text-base font-medium text-bone transition hover:border-bone"
          >
            {t("landing.final.demo")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-ink-muted/50 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-sm text-bone-dim md:flex-row md:items-center">
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span>© {new Date().getFullYear()} BarberOS</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/login" className="transition hover:text-bone">
            {t("landing.nav.login")}
          </Link>
          <Link href="/signup" className="transition hover:text-bone">
            {t("landing.nav.cta")}
          </Link>
          <a href="#" className="transition hover:text-bone">
            {t("landing.footer.terms")}
          </a>
          <a href="#" className="transition hover:text-bone">
            {t("landing.footer.privacy")}
          </a>
          <a href="#" className="transition hover:text-bone">
            {t("landing.footer.contact")}
          </a>
        </div>
      </div>
    </footer>
  );
}
