---
name: structured-build
description: Use for any non-trivial coding task in this repo (new feature, multi-file change, refactor). Enforces a plan → build → verify → self-review loop so changes land correctly the first time. Inspired by the "superpowers" structured-workflow discipline.
---

# Structured build loop

For anything bigger than a one-line fix, follow this loop. Do not
jump straight to code.

## 1. Plan (before touching files)

- State what the change is and which files it touches.
- Note which contexts/stores are involved: Theme, I18n, Currency
  (root), Calendar (dashboard).
- Define the data shape first — add/extend types in
  `web/lib/mock-data.ts`.
- If it adds persisted state, plan the `lib/*-store.ts` + the React
  context wiring before the UI.

## 2. Build incrementally

- Order: types/data → store/context → UI.
- Reuse existing helpers (`useT`, `useCurrency`, `useCalendar`,
  `useTheme`).
- Keep each edit focused; prefer Edit over rewriting whole files.

## 3. Verify (always, before saying it's done)

- Run `cd web && npm run build` — it must compile and type-check.
- For UI changes, reason through dark + light, BG + EN, and a mobile
  width.
- Refresh `/docs` only when the deployed site must change:
  `rm -rf docs && cp -r web/out docs && touch docs/.nojekyll`.

## 4. Self-review against known gotchas

- Tailwind: any new dynamic colours safelisted? `lib/**` still in
  `content`?
- z-index within the documented scheme (topbar z-40, modals z-50,
  password modal z-60)?
- localStorage access guarded with `typeof window === "undefined"`?
- New user-facing strings added to `translations.ts` (bg + en at
  least; other locales optional)?

## 5. Commit

- One commit per coherent change, descriptive message, push to
  `claude/barber-booking-app-sMtXL`.
- Never commit secrets; only stage the files you changed.
