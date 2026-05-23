import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <WhyUs />
      <Features />
      <Pricing />
      <AITease />
      <FinalCTA />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-ink-muted/40 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-display text-lg font-bold text-ink">
            B
          </span>
          <span className="font-display text-xl tracking-wide">BarberOS</span>
        </Link>
        <div className="hidden gap-8 text-sm text-bone-dim md:flex">
          <a href="#why" className="hover:text-bone">
            Защо нас
          </a>
          <a href="#features" className="hover:text-bone">
            Функции
          </a>
          <a href="#pricing" className="hover:text-bone">
            Пакети
          </a>
          <Link href="/dashboard" className="hover:text-bone">
            Демо
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-bone-dim transition hover:text-bone"
          >
            Вход
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent-hover"
          >
            7 дни безплатно
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(201,163,106,0.18),_transparent_60%)]" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.05fr_1fr] md:py-28">
        <div className="flex flex-col justify-center">
          <span className="mb-4 w-fit rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-widest text-accent">
            ✂️ От бръснари, за бръснари
          </span>
          <h1 className="font-display text-5xl leading-[1.05] md:text-6xl">
            Знаем какво ти трябва,
            <br />
            <span className="text-accent">защото бяхме на твое място.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-bone-dim">
            BarberOS е създаден от хора, които познават салона отвътре —
            закъсненията, спама от фалшиви часове, кражбата на клиенти и
            хаоса в графика. Изградихме инструмента, който ние самите искахме
            да имаме.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-accent px-6 py-3 font-medium text-ink transition hover:bg-accent-hover"
            >
              🎁 Пробвай 7 дни безплатно
            </Link>
            <a
              href="#pricing"
              className="rounded-full border border-bone-dim/30 px-6 py-3 font-medium text-bone transition hover:border-bone"
            >
              Виж пакетите →
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-bone-dim">
            <span>★ 4.9 средна оценка</span>
            <span className="h-1 w-1 rounded-full bg-bone-dim/50" />
            <span>+200 салона ползват BarberOS</span>
            <span className="h-1 w-1 rounded-full bg-bone-dim/50" />
            <span>Без карта при пробен период</span>
          </div>
        </div>

        <DeviceMockup />
      </div>
    </section>
  );
}

function DeviceMockup() {
  return (
    <div className="relative h-[480px] md:h-[520px]">
      {/* Glow */}
      <div className="absolute inset-0 rounded-3xl bg-accent/10 blur-3xl" />

      {/* Laptop */}
      <div className="absolute left-0 right-0 top-4 mx-auto w-full max-w-[440px]">
        <div className="rounded-t-xl border border-ink-muted bg-ink-soft p-2.5 shadow-2xl">
          <div className="overflow-hidden rounded-md border border-ink-muted/60 bg-ink">
            <div className="flex items-center gap-1 border-b border-ink-muted/60 bg-ink-soft px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
              <span className="ml-2 text-[8px] text-bone-dim/70">
                BarberOS · Календар
              </span>
            </div>
            <MiniCalendarGraphic />
          </div>
        </div>
        <div className="h-2 w-full rounded-b-xl bg-gradient-to-b from-ink-muted to-ink-muted/40" />
        <div className="mx-auto -mt-px h-1.5 w-[60%] rounded-b-xl bg-ink-muted/30" />
      </div>

      {/* Phone */}
      <div className="absolute -bottom-4 left-0 z-10 w-[150px] -rotate-6 md:w-[170px]">
        <div className="rounded-[26px] border-2 border-ink-muted bg-ink-soft p-1.5 shadow-2xl">
          <div className="overflow-hidden rounded-[20px] bg-ink">
            <div className="flex justify-center border-b border-ink-muted/40 bg-ink-soft py-1">
              <span className="h-1 w-10 rounded-full bg-ink-muted" />
            </div>
            <MiniPhoneGraphic />
          </div>
        </div>
      </div>

      {/* Watch */}
      <div className="absolute -right-2 bottom-8 z-20 w-[110px] rotate-6">
        <div className="rounded-2xl border-2 border-ink-muted bg-ink-soft p-1 shadow-2xl">
          <div className="overflow-hidden rounded-xl bg-ink">
            <MiniWatchGraphic />
          </div>
        </div>
        <div className="mx-auto -mt-1 h-2 w-[60%] rounded-b-lg bg-ink-muted/40" />
      </div>
    </div>
  );
}

function MiniCalendarGraphic() {
  return (
    <div className="grid grid-cols-[24px_1fr_1fr_1fr] gap-px bg-ink-muted/40 p-px text-[7px]">
      {/* Time axis */}
      <div className="flex flex-col gap-px bg-ink-soft">
        {["10", "11", "12", "13", "14"].map((h) => (
          <div
            key={h}
            className="flex h-7 items-start justify-end pr-1 pt-0.5 text-bone-dim/70"
          >
            {h}
          </div>
        ))}
      </div>
      {/* Column 1 */}
      <div className="relative flex flex-col gap-px bg-ink-soft">
        <ColumnHeader name="ИП" />
        <Block top={2} h={14} color="emerald" />
        <Block top={26} h={10} color="violet" />
        <Block top={50} h={20} color="amber" />
      </div>
      {/* Column 2 */}
      <div className="relative flex flex-col gap-px bg-ink-soft">
        <ColumnHeader name="ГС" />
        <Block top={6} h={20} color="violet" />
        <Block top={40} h={14} color="emerald" />
      </div>
      {/* Column 3 */}
      <div className="relative flex flex-col gap-px bg-ink-soft">
        <ColumnHeader name="МК" />
        <Block top={14} h={10} color="rose" />
        <Block top={32} h={14} color="emerald" />
        <Block top={56} h={10} color="violet" />
      </div>
    </div>
  );
}

function ColumnHeader({ name }: { name: string }) {
  return (
    <div className="grid h-3 place-items-center border-b border-ink-muted/40 bg-ink-soft text-[6px] text-bone-dim">
      {name}
    </div>
  );
}

function Block({
  top,
  h,
  color,
}: {
  top: number;
  h: number;
  color: "emerald" | "violet" | "amber" | "rose";
}) {
  const cls: Record<typeof color, string> = {
    emerald: "bg-emerald-500/50",
    violet: "bg-violet-500/50",
    amber: "bg-amber-500/60",
    rose: "bg-rose-500/50",
  };
  return (
    <div
      className={`absolute inset-x-0.5 rounded-sm ${cls[color]}`}
      style={{ top: top * 0.45 + 12, height: h * 0.45 }}
    />
  );
}

function MiniPhoneGraphic() {
  return (
    <div className="p-2 text-[7px]">
      <p className="font-display text-[10px]">Днес</p>
      <p className="text-[6px] text-bone-dim">3 часа</p>
      <div className="mt-1.5 space-y-1">
        {[
          { time: "10:00", color: "bg-emerald-500/40" },
          { time: "12:30", color: "bg-violet-500/40" },
          { time: "14:00", color: "bg-amber-500/50" },
        ].map((a) => (
          <div
            key={a.time}
            className={`flex items-center justify-between rounded ${a.color} px-1.5 py-1`}
          >
            <span>{a.time}</span>
            <span className="h-0.5 w-3 rounded-full bg-bone/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniWatchGraphic() {
  return (
    <div className="p-2 text-center text-[7px]">
      <p className="text-[6px] uppercase tracking-widest text-bone-dim">
        Нов час
      </p>
      <p className="mt-1 font-display text-[9px]">Иван П.</p>
      <p className="text-[6px] text-accent">14:00 · Брада</p>
      <div className="mt-1 grid grid-cols-2 gap-px">
        <div className="rounded bg-emerald-500/30 py-0.5 text-[6px]">✓</div>
        <div className="rounded bg-rose-500/30 py-0.5 text-[6px]">✗</div>
      </div>
    </div>
  );
}

function WhyUs() {
  const items = [
    {
      icon: "💈",
      title: "Разбираме професията",
      desc: "Защото сами сме били бръснари. Знаем какво е да губиш клиент заради грешка в графика.",
    },
    {
      icon: "🔒",
      title: "Защита от кражба на клиенти",
      desc: "Бръснарите виждат само своя график — без телефони и имейли на клиентите.",
    },
    {
      icon: "🇧🇬",
      title: "Локален екип, локална поддръжка",
      desc: "Чуваме се с теб на български. Без чатботи, без преводи — реални хора.",
    },
    {
      icon: "🚀",
      title: "Изграден за растеж",
      desc: "Започваш с един салон, растеш до 10 — без да сменяш системата.",
    },
  ];
  return (
    <section id="why" className="border-t border-ink-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl">Защо BarberOS, а не нещо друго?</h2>
          <p className="mt-3 text-bone-dim">
            Има много софтуери за салони. Но почти всички са направени от
            хора, които никога не са държали машинка. Ние сме другата страна.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ink-muted bg-ink-soft p-6"
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-4 font-display text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-bone-dim">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: "📅", label: "Онлайн резервации" },
    { icon: "⏱️", label: "Multi-локация" },
    { icon: "✂️", label: "Графици на екипа" },
    { icon: "👥", label: "Клиентска база (CRM)" },
    { icon: "📦", label: "Инвентар + баркод" },
    { icon: "💰", label: "Продажба на продукти" },
    { icon: "📊", label: "Дневни отчети" },
    { icon: "🔔", label: "Известия и напомняния" },
  ];
  return (
    <section id="features" className="border-t border-ink-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-4xl">Всичко в едно</h2>
        <p className="mt-3 text-bone-dim">
          Без 5 различни приложения. Без Excel. Без бележник.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-ink-muted bg-ink-soft px-4 py-3 text-sm"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="border-t border-ink-muted/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl">Прости цени, без изненади</h2>
          <p className="mt-3 text-bone-dim">
            Започни с 7 дни безплатно. Откажи се по всяко време.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <PlanCard
            name="Старт"
            price="19"
            tagline="За соло бръснари и малки салони"
            features={[
              "1 локация",
              "До 2 бръснари",
              "Календар + резервации",
              "50 SMS / месец",
              "Базови отчети",
              "Email поддръжка",
            ]}
          />
          <PlanCard
            name="Професионален"
            price="49"
            tagline="За растящи салони"
            popular
            features={[
              "До 3 локации",
              "До 10 бръснари",
              "Всичко от Старт",
              "Inventory + продукти + комисионни",
              "Клиентска база (CRM)",
              "QR код + публичен booking link",
              "200 SMS / месец",
              "Email + chat поддръжка",
            ]}
          />
          <PlanCard
            name="Премиум"
            price="99"
            tagline="За вериги и амбициозни брандове"
            features={[
              "Неограничен брой локации",
              "Неограничен брой бръснари",
              "Всичко от Професионален",
              "🤖 AI рецепционист (скоро)",
              "Маркетинг автоматизация",
              "Бели лейбъл / собствено приложение",
              "Приоритетна поддръжка 24/7",
              "API достъп",
            ]}
          />
        </div>
        <p className="mt-8 text-center text-xs text-bone-dim">
          Всички цени са в български лева, без ДДС. Годишен абонамент — 2
          месеца безплатно.
        </p>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  price,
  tagline,
  features,
  popular = false,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  popular?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border p-6 ${
        popular
          ? "border-accent bg-accent/5 shadow-2xl ring-1 ring-accent/40"
          : "border-ink-muted bg-ink-soft"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink">
          Най-популярен
        </span>
      )}
      <p className="font-display text-2xl">{name}</p>
      <p className="text-sm text-bone-dim">{tagline}</p>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-5xl text-accent">{price}</span>
        <span className="text-sm text-bone-dim">лв / месец</span>
      </div>
      <ul className="mt-6 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 text-accent">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`mt-8 block rounded-full px-6 py-3 text-center text-sm font-medium transition ${
          popular
            ? "bg-accent text-ink hover:bg-accent-hover"
            : "border border-bone-dim/30 text-bone hover:border-bone"
        }`}
      >
        Избери {name}
      </Link>
    </div>
  );
}

function AITease() {
  return (
    <section className="border-t border-ink-muted/40 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-accent/40 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-4xl">🤖</span>
            <span className="rounded-full border border-accent/40 px-3 py-1 text-[10px] uppercase tracking-widest text-accent">
              В разработка
            </span>
          </div>
          <h2 className="mt-6 font-display text-3xl md:text-4xl">
            AI рецепционист — който никога не спи.
          </h2>
          <p className="mt-4 max-w-2xl text-bone-dim">
            Скоро в Премиум пакета: автоматичен AI асистент, който отговаря на
            обажданията, записва часове, изпраща напомняния и потвърждава
            резервации — на български, 24/7. Ти се концентрираш върху ножиците,
            той се грижи за телефона.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-bone-dim">
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              📞 Обажда
            </span>
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              💬 Чати
            </span>
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              📧 Имейли
            </span>
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              🔔 Напомня
            </span>
            <span className="rounded-full border border-ink-muted px-3 py-1.5">
              📅 Записва часове
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="border-t border-ink-muted/40 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl">
          Готов ли си да обърнеш страницата?
        </h2>
        <p className="mt-4 text-bone-dim">
          7 дни безплатно. Без карта. Без обвързване. Без излишно усложнение.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-accent px-8 py-4 text-base font-medium text-ink transition hover:bg-accent-hover"
          >
            🎁 Започни безплатния период
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-bone-dim/30 px-8 py-4 text-base font-medium text-bone transition hover:border-bone"
          >
            Първо разгледай демо
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-muted/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-sm text-bone-dim md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-accent font-display text-sm font-bold text-ink">
            B
          </span>
          <span>© {new Date().getFullYear()} BarberOS</span>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/login" className="hover:text-bone">
            Вход
          </Link>
          <Link href="/signup" className="hover:text-bone">
            Регистрация
          </Link>
          <a href="#" className="hover:text-bone">
            Условия
          </a>
          <a href="#" className="hover:text-bone">
            Поверителност
          </a>
          <a href="#" className="hover:text-bone">
            Контакти
          </a>
        </div>
      </div>
    </footer>
  );
}
