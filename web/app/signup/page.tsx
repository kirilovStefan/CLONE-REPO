"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageStrip } from "@/lib/i18n";

export default function SignupPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Паролите не съвпадат.");
      return;
    }
    if (password.length < 6) {
      setError("Паролата трябва да е поне 6 символа.");
      return;
    }
    if (!agreedToTerms) {
      setError("Трябва да приемеш условията за ползване.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, ownerName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Грешка при регистрация.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Няма връзка със сървъра. Опитай отново.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(201,163,106,0.18),_transparent_60%)]" />

      <header className="border-b border-ink-muted/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-display text-lg font-bold text-ink">
              B
            </span>
            <span className="font-display text-xl tracking-wide">BarberOS</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-bone-dim transition hover:text-bone"
          >
            ← Към сайта
          </Link>
        </div>
      </header>

      <LanguageStrip />

      <section className="flex items-center justify-center px-6 py-12 md:py-16">
        <div className="w-full max-w-lg">
          <div className="text-center">
            <span className="inline-block rounded-full border border-accent/40 px-3 py-1 text-xs uppercase tracking-widest text-accent">
              30 дни безплатно · без карта
            </span>
            <h1 className="mt-4 font-display text-4xl">Регистрирай бизнес</h1>
            <p className="mt-3 text-sm text-bone-dim">
              Създай BarberOS акаунт за салона си за 1 минута
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 rounded-2xl border border-ink-muted bg-ink-soft p-6 shadow-2xl"
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-bone-dim">
                Име на салона *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="напр. Витоша Барбършоп"
                className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-dim/50 focus:border-accent focus:outline-none"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-bone-dim">
                Име на собственика *
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="напр. Иван Петров"
                className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-dim/50 focus:border-accent focus:outline-none"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-bone-dim">
                  Имейл *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ti@example.bg"
                  className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-dim/50 focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-bone-dim">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+359 88 123 4567"
                  className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-dim/50 focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-bone-dim">
                  Парола *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="мин. 6 символа"
                  className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-dim/50 focus:border-accent focus:outline-none"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-bone-dim">
                  Потвърди парола *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="повторно"
                  className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-dim/50 focus:border-accent focus:outline-none"
                  required
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm text-bone-dim">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-accent"
              />
              <span>
                Съгласен съм с{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Скоро: условия за ползване");
                  }}
                  className="text-accent transition hover:text-accent-hover"
                >
                  условията за ползване
                </a>{" "}
                и{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Скоро: политика за поверителност");
                  }}
                  className="text-accent transition hover:text-accent-hover"
                >
                  политиката за поверителност
                </a>
                .
              </span>
            </label>

            {error && (
              <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-3 font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Създавам акаунт…" : "Създай акаунт"}
            </button>

            <p className="text-center text-sm text-bone-dim">
              Имаш акаунт?{" "}
              <Link
                href="/login"
                className="text-accent transition hover:text-accent-hover"
              >
                Влез
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-[11px] text-bone-dim/70">
            Акаунтът ти се създава в реална база данни. Получаваш 7 дни безплатен пробен период.
          </p>
        </div>
      </section>
    </main>
  );
}
