# BarberOS — Progress tracker

> Living checklist of where we are. Update at the END of every session
> so the next one starts without re-discovering state. Newest notes at
> the bottom of "Session log".

## Phase status

- [x] Backend foundation — Drizzle schema + Neon Postgres client (`lib/db/`)
- [x] Migrations generated & applied to Neon production (11 app tables live)
- [x] Auth — signup / login / logout / me, JWT sessions, `/dashboard/*` gated by middleware
- [x] Salon real name wired into dashboard
- [x] Clients (CRM) → database (`use-clients.ts` + `/api/clients`)
- [x] Services → database (management + hours/minutes picker) (`use-services.ts` + `/api/services`)
- [x] Calendar backend (seed + read APIs)
- [x] Schema for `barber_services` + locations with city/street/geo
- [x] Verify `barber_services` exists in Neon production — confirmed 2026-05-25 (12 rows)
- [~] **Big integration** (split into 4 sub-steps, sequential, QA between each):
  - [x] 1. Barbers + Locations → database (Team CRUD, location switcher, View As)
  - [x] 2. Per-barber service checkboxes (`barber_services`) — **awaiting QA**
  - [ ] 3. Calendar reads barbers/services/appointments from database
  - [ ] 4. Appointments write-path (create / update / cancel via `/api/appointments`)
- [ ] Inventory → database (`products` table exists; `inventory-store.ts` still localStorage)
- [ ] Reports / sales → database (`product_sales` table exists; `sales-store.ts` still localStorage)
- [ ] Team & Time-off → database (`time_off_requests` table exists; `team-store.ts` / `time-off-store.ts` still localStorage)
- [ ] Appointments write-path (create / update / cancel through `/api/appointments`)

## Decisions

- _2026-05-25_: After step 1 QA the user requested a richer salon profile (location
  city/street, account/business settings wired to the DB, more fields at signup).
  Agreed to do this as a dedicated "Salon profile & settings" step AFTER finishing the
  calendar integration (steps 2-4). Schema already has `city`/`street`/`lat`/`lng` on
  locations — mostly a UI + `PATCH /api/locations/[id]` job when we get to it.
- Per-barber services rule: a barber with NO `barber_services` rows can perform ALL
  services (seeded barbers); rows present = exactly those. UI defaults a new barber to
  all services checked.

## Known environment notes

- DB: Neon project `barberOS`, branch **`production`** (run SQL there).
- `.env.local` has `DATABASE_URL` set; **`AUTH_SECRET` is NOT set** → middleware
  falls back to `"dev-only-insecure-secret-change-me"`. Fine locally, must set before deploy.
- `web/out/` is a stale static-export artifact from the old demo; no longer used.

## Session log

- _2026-05-25_: Confirmed `barber_services` + all 11 tables live in Neon (production
  branch). Created this tracker and corrected stale claims in CLAUDE.md.
- _2026-05-25_: Big integration step 1 done — barbers + locations now load from the
  DB via `calendar-context` (new GET on `/api/barbers` + `/api/locations`); Team page,
  sidebar location switcher and View As all read real data; barber CRUD hits the API;
  deleted the obsolete `team-store.ts`. Interim: the calendar still reads mock
  appointments/services, so pre-seeded demo appointments won't line up with the real
  barber columns yet (fixed in steps 3-4). Awaiting QA before step 2.
- _2026-05-25_: Step 2 done — Team form has a service-checkbox list per barber, stored
  in `barber_services`. `/api/barbers` GET now returns each barber's `serviceIds`; POST
  and PATCH sync the join table. Barber cards show a services count. Awaiting QA.
