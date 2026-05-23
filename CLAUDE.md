# BarberOS — Project memory

> Operating system for barber shops. Currently a high-fidelity demo
> (web only, no backend yet). This file is read at the start of every
> Claude Code session — keep it under 200 lines, append a new entry to
> the "Recent gotchas" section whenever something gets misunderstood
> twice.

## What this is

- **Product**: BarberOS — multi-tenant SaaS for barber shops. Owner
  manages locations / barbers / clients / inventory; clients book via
  a public link. Three pricing tiers (€19 / €49 / €99 per month).
- **State**: front-end only demo. Real backend, auth, payments and
  mobile app are explicitly out of scope until the next phase.
- **Target launch markets**: Bulgaria first (post-Euro adoption),
  then Turkey + Germany via the Turkish-speaking barber community.

## Repo layout

```
/web                      Next.js 14 app (App Router, TS, Tailwind)
  /app                    pages (landing, dashboard, login, signup, book)
  /lib                    shared types, contexts, stores
/docs                     static export — published via GitHub Pages
                          (do not edit by hand; rebuilt on each push)
/chapter-*.md, cover.jpg  legacy GitBook content at the root —
                          unrelated to BarberOS, leave it alone
```

## Stack

- **Next.js 14** (App Router) on **React 18** + **TypeScript** strict.
- **Tailwind 3** with the custom palette driven by CSS variables so
  light + dark share the same class names.
- **Static export** (`output: "export"`) — no server runtime, no API
  routes. All state lives in `localStorage`.
- **Mock data** in `web/lib/mock-data.ts`. Prices are stored as EUR
  (Bulgaria adopted the Euro in 2025; format with `useCurrency`).

## Commands

Run everything from `/web`:

```bash
cd web
npm install            # first time only
npm run dev            # local dev at http://localhost:3000
npm run build          # static export → web/out (no source map needed)
```

After a build that changes the deployed site, refresh `/docs`:

```bash
rm -rf docs && cp -r web/out docs && touch docs/.nojekyll
```

Then commit and push to `claude/barber-booking-app-sMtXL`.

## Conventions used in this codebase

- **One context per concern**, all in `web/lib/`:
  `ThemeProvider`, `I18nProvider`, `CurrencyProvider` (root) +
  `CalendarProvider` (dashboard only). Add new app-wide state to
  root `app/providers.tsx`; dashboard-specific state goes in
  `CalendarProvider`.
- **Tailwind colors**: only the semantic tokens — `bg-ink-soft`,
  `text-bone`, `border-ink-muted`, `text-accent`, `bg-accent-hover`.
  They resolve via `--ink` / `--bone` / `--accent` CSS variables,
  so the same component works in light + dark. Don't reach for raw
  hex.
- **Prices** always go through `useCurrency().format(amountEur)`.
  Stored values are EUR (the base). Translation strings use
  `{price}` placeholders, not hardcoded "лв" / "BGN".
- **Translations** in `web/lib/translations.ts`. `bg` + `en` are
  required, other locales (`tr` / `de` / `es` / `it` / `fr`) are
  optional and fall back to English then Bulgarian.
- **Dates / times** use `useT().localeTag` (e.g. "bg-BG", "en-GB")
  with `Date.prototype.toLocaleDateString` / `toLocaleTimeString`.
  Never hardcode "bg-BG".
- **Persistence** stores live in `lib/*-store.ts` — pure load/save
  functions guarded with `typeof window === "undefined"`. The
  associated React context wraps them and exposes mutators.
- **Dropdown menu items**: use `onMouseDown` + `e.preventDefault()`
  rather than `onClick`. Otherwise the parent input/button loses
  focus and the menu collapses before the click registers.
- **Modals**: outer backdrop has `onClick={onClose}`; inner content
  has `onClick={(e) => e.stopPropagation()}`.
- **No comments** unless the WHY is genuinely non-obvious. Prefer
  expressive identifiers.

## Known constraints / gotchas

These are things I have gotten wrong more than once — check before
making the same kind of change:

- **Tailwind purge** strips dynamic color classes built from the
  status palette. The fix: `lib/**` must stay in
  `web/tailwind.config.ts` `content`, and the status hues are also
  in `safelist`. Don't remove either.
- **Stacking context**: the dashboard topbar needs `relative z-40`
  so dropdowns (e.g. View As) render above the calendar grid. The
  calendar uses several layered z-indexes — header z-10, working
  hours overlay z-1, appointment z-5, hover marker z-3, now-line
  z-15, modals z-50, password modal z-60. Stay within this scheme.
- **`useRef<HTMLDivElement>(null)`** infers as
  `RefObject<HTMLDivElement | null>` under the current
  `@types/react`. If TS complains when passing the ref to a child,
  inline the JSX or widen the prop type instead of fighting it.
- **Hydration**: `<html>` carries `suppressHydrationWarning` because
  `ThemeProvider` swaps `light` / `dark` classes after mount. Don't
  remove it.
- **Static export quirks**: `next/navigation` `useRouter().push` is
  fine, but server-only APIs (cookies, headers) will break the
  build. Anything in `app/**` that uses hooks needs `"use client"`.
- **Mini calendar in the sidebar** must fit without scrolling on a
  768 px-tall laptop. If you add a sidebar section, check it still
  fits — h-6 day cells, py-1.5 nav rows are the negotiated sizes.

## Recent gotchas (rolling window)

- _2026-05-23_: switching to EUR forced a sweep of every `${X} лв`
  pattern. New code must use `useCurrency().format()`; the
  translation strings hold `{price}` placeholders only.
- _2026-05-23_: when the dashboard layout had no `z-index` on the
  header, the calendar grid painted over the View As dropdown —
  added `relative z-40` to the header.
- _2026-05-23_: `onMouseDown` + `preventDefault` on the product
  search dropdown fixed the "click does nothing" bug caused by the
  input's `onBlur` racing the dropdown removal.

## What's deliberately not here yet

Don't propose adding any of these as a side-quest. They are tracked
as the next major phase and need explicit user sign-off:

- Real backend / database / API
- Real authentication
- Multi-user realtime sync
- Mobile (Expo) app
- Payment processing
- Email/SMS gateways

## When in doubt

- For Claude Code / SDK / API questions, dispatch the
  `claude-code-guide` agent rather than guessing.
- For codebase navigation, dispatch `Explore` rather than running
  many ad-hoc greps.
