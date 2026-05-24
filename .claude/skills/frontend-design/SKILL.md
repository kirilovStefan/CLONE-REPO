---
name: frontend-design
description: Use when building or restyling any UI in the BarberOS web app (app/**). Runs a short design-thinking pass before writing components and checks the output against the project's design system, theming, i18n and currency conventions.
---

# Frontend design pass for BarberOS

Before writing any UI code, answer these briefly (out loud, 30 seconds):

1. **Purpose** — what is the ONE job of this screen/component? What
   should the user do or grasp in the first 3 seconds?
2. **Audience** — owner (full data) or barber (restricted, no client
   contacts)? Mobile-first or desktop-first?
3. **Tone** — BarberOS is dark, premium, gold-accented, confident.
   No playful/childish styling. Generous spacing, large display
   headings, muted body text.
4. **Differentiation** — what makes this feel like a real product,
   not a template? (live data, status colours, micro-interactions)

## Use the existing design system — never invent

- **Colours**: only semantic tokens — `bg-ink` / `bg-ink-soft` /
  `border-ink-muted` / `text-bone` / `text-bone-dim` / `text-accent`
  / `bg-accent` / `bg-accent-hover`. They resolve through CSS
  variables, so the same classes work in light + dark. Never
  hardcode hex.
- **Type**: `font-display` for headings, default sans for body.
  Stick to the existing scale (text-4xl/5xl heroes, text-sm/xs
  metadata).
- **Shape**: rounded-2xl cards, rounded-xl inputs, rounded-full
  pills/buttons. `border border-ink-muted bg-ink-soft` is the
  standard card.
- **Spacing**: generous — py-20 landing sections, p-5/p-6 cards,
  gap-3/gap-4 grids.

## Verify before declaring done

- [ ] Renders correctly in BOTH dark and light theme.
- [ ] All user-facing text goes through `useT().t(...)` — nothing
      hardcoded.
- [ ] Prices go through `useCurrency().format(amountEur)` — never
      `${x} лв`.
- [ ] Dates/times use `useT().localeTag`, never hardcoded "bg-BG".
- [ ] Responsive at 375px (phone) and 1280px (desktop).
- [ ] `cd web && npm run build` passes.

## Anti-patterns

- Dropdown items with `onClick` (use `onMouseDown` +
  `e.preventDefault()` so the input doesn't blur first).
- New raw colours / one-off hex values.
- Missing `"use client"` on components that use hooks.
- Dynamic Tailwind class names that aren't in the safelist.
