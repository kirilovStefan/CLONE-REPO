"use client";

import { useState } from "react";
import Link from "next/link";
import { services, barbers, type Service, type Barber } from "@/lib/mock-data";

type Step = 1 | 2 | 3 | 4 | 5;

type BookingState = {
  service: Service | null;
  barber: Barber | null;
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
};

const initialState: BookingState = {
  service: null,
  barber: null,
  date: null,
  time: null,
  name: "",
  phone: "",
};

export default function BookPage() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<BookingState>(initialState);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return <ConfirmedScreen data={data} />;
  }

  const canGoNext =
    (step === 1 && data.service !== null) ||
    (step === 2 && data.barber !== null) ||
    (step === 3 && data.date !== null && data.time !== null) ||
    (step === 4 && data.name.trim() !== "" && data.phone.trim() !== "");

  return (
    <main className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Progress step={step} />

        <div className="mt-10">
          {step === 1 && (
            <ServiceStep
              selected={data.service}
              onSelect={(s) => setData({ ...data, service: s })}
            />
          )}
          {step === 2 && (
            <BarberStep
              selected={data.barber}
              onSelect={(b) => setData({ ...data, barber: b })}
            />
          )}
          {step === 3 && (
            <DateTimeStep
              date={data.date}
              time={data.time}
              onDateChange={(d) => setData({ ...data, date: d, time: null })}
              onTimeChange={(t) => setData({ ...data, time: t })}
            />
          )}
          {step === 4 && (
            <ContactStep
              name={data.name}
              phone={data.phone}
              onNameChange={(name) => setData({ ...data, name })}
              onPhoneChange={(phone) => setData({ ...data, phone })}
            />
          )}
          {step === 5 && <ReviewStep data={data} />}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
            disabled={step === 1}
            className="rounded-full border border-bone-dim/30 px-6 py-3 text-sm font-medium text-bone transition hover:border-bone disabled:cursor-not-allowed disabled:opacity-30"
          >
            ← Назад
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canGoNext}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-30"
            >
              Напред →
            </button>
          ) : (
            <button
              onClick={() => setConfirmed(true)}
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink transition hover:bg-accent-hover"
            >
              Потвърди резервацията
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function TopBar() {
  return (
    <nav className="border-b border-ink-muted/40">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-display text-lg font-bold text-ink">
            B
          </span>
          <span className="font-display text-xl tracking-wide">Barberly</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-bone-dim transition hover:text-bone"
        >
          Отказ
        </Link>
      </div>
    </nav>
  );
}

function Progress({ step }: { step: Step }) {
  const labels = ["Услуга", "Бръснар", "Дата и час", "Контакт", "Преглед"];
  return (
    <div>
      <div className="flex items-center justify-between">
        {labels.map((label, i) => {
          const n = (i + 1) as Step;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-medium transition ${
                  active
                    ? "border-accent bg-accent text-ink"
                    : done
                    ? "border-accent/60 bg-accent/20 text-accent"
                    : "border-ink-muted text-bone-dim"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`mt-2 hidden text-xs sm:block ${
                  active ? "text-bone" : "text-bone-dim"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-ink-muted/40">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}

function ServiceStep({
  selected,
  onSelect,
}: {
  selected: Service | null;
  onSelect: (s: Service) => void;
}) {
  return (
    <section>
      <h2 className="font-display text-3xl">Каква услуга желаеш?</h2>
      <p className="mt-2 text-bone-dim">Избери една, можеш да я смениш по-късно.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {services.map((s) => {
          const isSelected = selected?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`rounded-2xl border p-5 text-left transition ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-ink-muted bg-ink-soft hover:border-accent/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="font-display text-lg">{s.name}</p>
                <p className="font-display text-xl text-accent">{s.price} лв.</p>
              </div>
              <p className="mt-1 text-sm text-bone-dim">{s.description}</p>
              <p className="mt-3 text-xs text-bone-dim">{s.durationMin} мин.</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BarberStep({
  selected,
  onSelect,
}: {
  selected: Barber | null;
  onSelect: (b: Barber) => void;
}) {
  return (
    <section>
      <h2 className="font-display text-3xl">При кого?</h2>
      <p className="mt-2 text-bone-dim">Избери своя бръснар.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {barbers.map((b) => {
          const isSelected = selected?.id === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onSelect(b)}
              className={`rounded-2xl border p-5 text-left transition ${
                isSelected
                  ? "border-accent bg-accent/10"
                  : "border-ink-muted bg-ink-soft hover:border-accent/40"
              }`}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-accent/20 font-display text-xl text-accent">
                {b.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <p className="mt-3 font-display text-lg">{b.name}</p>
              <p className="text-sm text-bone-dim">{b.title}</p>
              <p className="mt-2 text-sm text-accent">★ {b.rating}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function generateDays() {
  const days: { iso: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      iso: d.toISOString().slice(0, 10),
      label: d.getDate().toString().padStart(2, "0"),
      weekday: d
        .toLocaleDateString("bg-BG", { weekday: "short" })
        .replace(".", ""),
    });
  }
  return days;
}

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const BUSY_SLOTS = new Set(["10:00", "11:30", "14:00", "15:30"]);

function DateTimeStep({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string | null;
  time: string | null;
  onDateChange: (d: string) => void;
  onTimeChange: (t: string) => void;
}) {
  const days = generateDays();
  return (
    <section>
      <h2 className="font-display text-3xl">Кога?</h2>
      <p className="mt-2 text-bone-dim">Избери дата, после свободен час.</p>

      <div className="mt-8">
        <p className="text-xs uppercase tracking-widest text-bone-dim">Дата</p>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {days.map((d) => {
            const isSelected = d.iso === date;
            return (
              <button
                key={d.iso}
                onClick={() => onDateChange(d.iso)}
                className={`flex flex-col items-center rounded-xl border py-3 transition ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-ink-muted bg-ink-soft hover:border-accent/40"
                }`}
              >
                <span className="text-xs uppercase text-bone-dim">
                  {d.weekday}
                </span>
                <span className="mt-1 font-display text-xl">{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {date && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest text-bone-dim">Час</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TIME_SLOTS.map((slot) => {
              const isBusy = BUSY_SLOTS.has(slot);
              const isSelected = slot === time;
              return (
                <button
                  key={slot}
                  disabled={isBusy}
                  onClick={() => onTimeChange(slot)}
                  className={`rounded-xl border py-3 text-sm transition ${
                    isBusy
                      ? "cursor-not-allowed border-ink-muted/40 bg-ink-soft/40 text-bone-dim/40 line-through"
                      : isSelected
                      ? "border-accent bg-accent/10 text-bone"
                      : "border-ink-muted bg-ink-soft hover:border-accent/40"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-bone-dim">
            Зачеркнатите часове са вече заети.
          </p>
        </div>
      )}
    </section>
  );
}

function ContactStep({
  name,
  phone,
  onNameChange,
  onPhoneChange,
}: {
  name: string;
  phone: string;
  onNameChange: (n: string) => void;
  onPhoneChange: (p: string) => void;
}) {
  return (
    <section>
      <h2 className="font-display text-3xl">Твоите данни</h2>
      <p className="mt-2 text-bone-dim">
        За да можем да те потвърдим и да ти изпратим напомняне.
      </p>
      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-bone-dim">
            Име
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Иван Петров"
            className="mt-2 w-full rounded-xl border border-ink-muted bg-ink-soft px-5 py-3 text-bone placeholder:text-bone-dim/60 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-bone-dim">
            Телефон
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+359 88 123 4567"
            className="mt-2 w-full rounded-xl border border-ink-muted bg-ink-soft px-5 py-3 text-bone placeholder:text-bone-dim/60 focus:border-accent focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}

function ReviewStep({ data }: { data: BookingState }) {
  const rows = [
    { label: "Услуга", value: data.service?.name },
    { label: "Цена", value: `${data.service?.price} лв.` },
    { label: "Продължителност", value: `${data.service?.durationMin} мин.` },
    { label: "Бръснар", value: data.barber?.name },
    {
      label: "Дата",
      value: data.date
        ? new Date(data.date).toLocaleDateString("bg-BG", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
        : null,
    },
    { label: "Час", value: data.time },
    { label: "Име", value: data.name },
    { label: "Телефон", value: data.phone },
  ];
  return (
    <section>
      <h2 className="font-display text-3xl">Преглед</h2>
      <p className="mt-2 text-bone-dim">Провери дали всичко е наред.</p>
      <div className="mt-8 rounded-2xl border border-ink-muted bg-ink-soft p-6">
        <ul className="divide-y divide-ink-muted/60">
          {rows.map((r) => (
            <li key={r.label} className="flex justify-between py-3">
              <span className="text-sm text-bone-dim">{r.label}</span>
              <span className="text-sm font-medium">{r.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ConfirmedScreen({ data }: { data: BookingState }) {
  return (
    <main className="min-h-screen">
      <TopBar />
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent/20 text-4xl text-accent">
          ✓
        </div>
        <h1 className="mt-6 font-display text-4xl">Резервацията е готова!</h1>
        <p className="mt-3 text-bone-dim">
          Изпратихме SMS с потвърждение на {data.phone}.
        </p>

        <div className="mt-10 rounded-2xl border border-ink-muted bg-ink-soft p-6 text-left">
          <p className="text-xs uppercase tracking-widest text-bone-dim">
            Детайли
          </p>
          <p className="mt-3 font-display text-2xl">{data.service?.name}</p>
          <p className="mt-1 text-bone-dim">с {data.barber?.name}</p>
          <p className="mt-4 font-display text-lg text-accent">
            {data.date &&
              new Date(data.date).toLocaleDateString("bg-BG", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
            в {data.time}
          </p>
        </div>

        <Link
          href="/"
          className="mt-10 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink transition hover:bg-accent-hover"
        >
          Към началото
        </Link>
      </div>
    </main>
  );
}
