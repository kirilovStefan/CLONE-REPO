"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageStrip } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    // Mock login — accept anything, redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
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

      <section className="flex items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="font-display text-4xl">Вход в акаунта</h1>
            <p className="mt-3 text-sm text-bone-dim">
              Влез в твоя BarberOS бизнес профил
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 rounded-2xl border border-ink-muted bg-ink-soft p-6 shadow-2xl"
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-bone-dim">
                Имейл
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ti@my-barbershop.bg"
                className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-dim/50 focus:border-accent focus:outline-none"
                required
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-bone-dim">
                  Парола
                </label>
                <button
                  type="button"
                  className="text-[11px] text-accent transition hover:text-accent-hover"
                  onClick={() =>
                    alert("Скоро: ще ти изпратим имейл за смяна на паролата.")
                  }
                >
                  Забравена парола?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-ink-muted bg-ink px-4 py-3 text-sm text-bone placeholder:text-bone-dim/50 focus:border-accent focus:outline-none"
                required
              />
              <p className="mt-1.5 text-[10px] italic text-bone-dim/70">
                Демо: всеки имейл и парола ще те пуснат вътре.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full rounded-full bg-accent py-3 font-medium text-ink transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Влизам…" : "Влез"}
            </button>

            <p className="text-center text-sm text-bone-dim">
              Нямаш акаунт?{" "}
              <Link
                href="/signup"
                className="text-accent transition hover:text-accent-hover"
              >
                Регистрирай бизнес
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-[11px] text-bone-dim/70">
            За клиенти — попитай твоя салон за линк или QR код за резервация.
          </p>
        </div>
      </section>
    </main>
  );
}
