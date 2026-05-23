import Link from "next/link";
import { services, barbers, upcomingAppointments } from "@/lib/mock-data";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("bg-BG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Hero />
      <Features />
      <ServicesPreview />
      <BarbersPreview />
      <DashboardPeek />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-ink-muted/40 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-ink font-display text-lg font-bold">
            B
          </span>
          <span className="font-display text-xl tracking-wide">BarberOS</span>
        </a>
        <div className="hidden gap-8 text-sm text-bone-dim md:flex">
          <a href="#features" className="hover:text-bone">Функции</a>
          <a href="#services" className="hover:text-bone">Услуги</a>
          <a href="#barbers" className="hover:text-bone">Бръснари</a>
          <Link href="/dashboard" className="hover:text-bone">Демо панел</Link>
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
            Регистрирай бизнес
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
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
        <div className="flex flex-col justify-center">
          <span className="mb-4 w-fit rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-widest text-accent">
            За бръснари, от бръснари
          </span>
          <h1 className="font-display text-5xl leading-tight md:text-6xl">
            Записването на час,{" "}
            <span className="text-accent">опростено.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-bone-dim">
            BarberOS е operating system за твоя салон — онлайн записване,
            график, услуги и клиенти на едно място. Уеб + мобилно приложение.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-accent px-6 py-3 font-medium text-ink transition hover:bg-accent-hover"
            >
              Започни безплатно
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-bone-dim/30 px-6 py-3 font-medium text-bone transition hover:border-bone"
            >
              Виж демо панела →
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-bone-dim">
            <span>★ 4.9 средна оценка</span>
            <span className="h-1 w-1 rounded-full bg-bone-dim/50" />
            <span>+200 салона ползват BarberOS</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-accent/10 blur-2xl" />
          <div className="relative rounded-3xl border border-ink-muted bg-ink-soft p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-bone-dim">
                  Днешен график
                </p>
                <p className="font-display text-2xl">Петък, 23 май</p>
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">
                {upcomingAppointments.length} часа
              </span>
            </div>
            <ul className="space-y-3">
              {upcomingAppointments.map((a) => {
                const service = services.find((s) => s.id === a.serviceId)!;
                const barber = barbers.find((b) => b.id === a.barberId)!;
                return (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-xl border border-ink-muted bg-ink/60 p-4"
                  >
                    <div>
                      <p className="font-medium">{a.clientName}</p>
                      <p className="text-sm text-bone-dim">
                        {service.name} · {barber.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg">
                        {formatTime(a.startsAt)}
                      </p>
                      <span
                        className={`text-xs ${
                          a.status === "confirmed"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {a.status === "confirmed" ? "потвърдено" : "чакащо"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      title: "Онлайн записване 24/7",
      desc: "Клиентите резервират сами — без обаждания, без пропуснати часове.",
      icon: "📅",
    },
    {
      title: "Личен график",
      desc: "Работно време, почивки, блокиране на часове. Всичко под контрол.",
      icon: "⏱",
    },
    {
      title: "Услуги и цени",
      desc: "Подстригване, брада, комбо — управлявай услугите и цените лесно.",
      icon: "✂️",
    },
    {
      title: "База с клиенти",
      desc: "История на посещенията, любим бръснар, бележки.",
      icon: "👥",
    },
  ];
  return (
    <section id="features" className="border-t border-ink-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-4xl">Всичко, което салонът ти иска.</h2>
        <p className="mt-3 max-w-xl text-bone-dim">
          Четири основни модула в първа версия — без излишно усложнения.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ink-muted bg-ink-soft p-6 transition hover:border-accent/60"
            >
              <div className="mb-4 text-3xl">{item.icon}</div>
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-bone-dim">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  return (
    <section id="services" className="border-t border-ink-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl">Услуги</h2>
            <p className="mt-3 text-bone-dim">
              Пример как клиентите виждат каталога ти.
            </p>
          </div>
          <span className="text-xs uppercase tracking-widest text-accent">
            mock данни
          </span>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-2xl border border-ink-muted bg-ink-soft p-5"
            >
              <div>
                <p className="font-display text-lg">{s.name}</p>
                <p className="text-sm text-bone-dim">{s.description}</p>
                <p className="mt-1 text-xs text-bone-dim">
                  {s.durationMin} мин.
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl text-accent">{s.price} лв.</p>
                <Link
                  href="/book"
                  className="mt-2 inline-block rounded-full border border-bone-dim/30 px-3 py-1 text-xs hover:border-bone"
                >
                  Запиши
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BarbersPreview() {
  return (
    <section id="barbers" className="border-t border-ink-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-4xl">Екипът</h2>
        <p className="mt-3 text-bone-dim">
          Всеки бръснар със своя профил, рейтинг и специалности.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-ink-muted bg-ink-soft p-6"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-accent/20 font-display text-xl text-accent">
                  {b.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-display text-lg">{b.name}</p>
                  <p className="text-sm text-bone-dim">{b.title}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-accent">★ {b.rating}</span>
                <span className="text-bone-dim">
                  ({b.reviewsCount} ревюта)
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {b.specialties.map((sp) => (
                  <span
                    key={sp}
                    className="rounded-full border border-ink-muted px-3 py-1 text-xs text-bone-dim"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPeek() {
  return (
    <section className="border-t border-ink-muted/40 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <span className="mb-3 w-fit rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-widest text-accent">
            За собственика
          </span>
          <h2 className="font-display text-4xl">
            Един изглед — целия бизнес.
          </h2>
          <p className="mt-4 text-bone-dim">
            Календар, приходи, активни клиенти, най-търсени услуги. Решенията
            се вземат лесно, когато данните са пред теб.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-bone-dim">
            <li>· Седмичен и месечен изглед на графика</li>
            <li>· Автоматични напомняния към клиенти</li>
            <li>· Експорт на отчети (скоро)</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-ink-muted bg-ink-soft p-6">
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Часове днес" value="12" />
            <Stat label="Приход днес" value="320 лв" />
            <Stat label="Нови клиенти" value="3" />
          </div>
          <div className="mt-6 rounded-2xl border border-ink-muted bg-ink p-4">
            <p className="text-xs uppercase tracking-widest text-bone-dim">
              Топ услуги тази седмица
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Подстригване + брада</span>
                <span className="text-accent">38 пъти</span>
              </li>
              <li className="flex justify-between">
                <span>Класическо подстригване</span>
                <span className="text-accent">29 пъти</span>
              </li>
              <li className="flex justify-between">
                <span>Оформяне на брада</span>
                <span className="text-accent">17 пъти</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink-muted bg-ink p-4">
      <p className="text-xs uppercase tracking-widest text-bone-dim">{label}</p>
      <p className="mt-2 font-display text-2xl text-accent">{value}</p>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Регистрирай салона",
      desc: "За 2 минути добавяш бръснарите и услугите си.",
    },
    {
      n: "02",
      title: "Сподели линк",
      desc: "Дай линка на клиентите си — резервират сами 24/7.",
    },
    {
      n: "03",
      title: "Управлявай отвсякъде",
      desc: "Уеб и мобилно приложение — графикът е винаги под ръка.",
    },
  ];
  return (
    <section id="how" className="border-t border-ink-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-4xl">Как работи</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-ink-muted bg-ink-soft p-6"
            >
              <p className="font-display text-3xl text-accent">{s.n}</p>
              <h3 className="mt-3 font-display text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-bone-dim">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section
      id="cta"
      className="border-t border-ink-muted/40 py-24"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl">
          Готов ли си да дигитализираш салона си?
        </h2>
        <p className="mt-4 text-bone-dim">
          Започни безплатно. Без карта, без обвързване.
        </p>
        <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="твоя@имейл.bg"
            className="flex-1 rounded-full border border-ink-muted bg-ink-soft px-5 py-3 text-bone placeholder:text-bone-dim/60 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 font-medium text-ink transition hover:bg-accent-hover"
          >
            Заявка за достъп
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-ink-muted/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-sm text-bone-dim md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} BarberOS. Всички права запазени.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-bone">Условия</a>
          <a href="#" className="hover:text-bone">Поверителност</a>
          <a href="#" className="hover:text-bone">Контакти</a>
        </div>
      </div>
    </footer>
  );
}
