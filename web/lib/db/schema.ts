import {
  pgTable,
  uuid,
  text,
  integer,
  real,
  timestamp,
  date,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

/**
 * Multi-tenant schema for BarberOS.
 *
 * Every business-owned row carries `organizationId` so a salon only
 * ever sees its own data (enforced in queries + future row-level
 * security). Prices are stored in EUR cents-free reals to match the
 * front-end's EUR base; format on the client with useCurrency().
 */

export const userRoleEnum = pgEnum("user_role", ["owner", "barber"]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "confirmed",
  "in-progress",
  "completed",
  "no-show",
  "cancelled",
]);
export const timeOffReasonEnum = pgEnum("time_off_reason", [
  "course",
  "vacation",
  "sick",
  "personal",
  "other",
]);
export const timeOffStatusEnum = pgEnum("time_off_status", [
  "pending",
  "approved",
  "rejected",
]);

// The tenant — one row per barbershop business (the owner's account).
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  defaultCurrency: text("default_currency").notNull().default("EUR"),
  defaultLocale: text("default_locale").notNull().default("bg"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Auth accounts — the owner plus any barbers given a personal login.
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("owner"),
    // When role = "barber", links to the barber profile they manage.
    barberId: uuid("barber_id"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    orgIdx: index("users_org_idx").on(t.organizationId),
  })
);

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    address: text("address").notNull().default(""),
    city: text("city").notNull().default(""),
    street: text("street").notNull().default(""),
    lat: real("lat"),
    lng: real("lng"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    orgIdx: index("locations_org_idx").on(t.organizationId),
  })
);

export const barbers = pgTable(
  "barbers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    title: text("title").notNull().default("Barber"),
    rating: real("rating").notNull().default(5),
    reviewsCount: integer("reviews_count").notNull().default(0),
    // Working hours as decimal hours (e.g. 9.5 = 09:30).
    workStart: real("work_start").notNull().default(9),
    workEnd: real("work_end").notNull().default(18),
    specialties: text("specialties").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    orgIdx: index("barbers_org_idx").on(t.organizationId),
    locIdx: index("barbers_loc_idx").on(t.locationId),
  })
);

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    durationMin: integer("duration_min").notNull().default(30),
    priceEur: real("price_eur").notNull().default(0),
    active: integer("active").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    orgIdx: index("services_org_idx").on(t.organizationId),
  })
);

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull().default(""),
    phone: text("phone").notNull(),
    email: text("email"),
    notes: text("notes"),
    phoneVerifiedAt: timestamp("phone_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    orgIdx: index("clients_org_idx").on(t.organizationId),
    phoneIdx: index("clients_phone_idx").on(t.organizationId, t.phone),
  })
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    brand: text("brand").notNull().default(""),
    category: text("category").notNull().default(""),
    barcode: text("barcode"),
    costPriceEur: real("cost_price_eur").notNull().default(0),
    priceEur: real("price_eur").notNull().default(0),
    commissionPct: real("commission_pct").notNull().default(10),
    stockQty: integer("stock_qty").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(3),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    orgIdx: index("products_org_idx").on(t.organizationId),
    barcodeIdx: index("products_barcode_idx").on(t.organizationId, t.barcode),
  })
);

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id, { onDelete: "cascade" }),
    barberId: uuid("barber_id")
      .notNull()
      .references(() => barbers.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "restrict" }),
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    // Denormalised client fields for walk-ins booked without a client row.
    clientName: text("client_name").notNull(),
    clientPhone: text("client_phone").notNull().default(""),
    clientEmail: text("client_email"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    durationMinOverride: integer("duration_min_override"),
    status: appointmentStatusEnum("status").notNull().default("confirmed"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    orgIdx: index("appointments_org_idx").on(t.organizationId),
    barberDayIdx: index("appointments_barber_day_idx").on(
      t.barberId,
      t.startsAt
    ),
  })
);

export const productSales = pgTable(
  "product_sales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    appointmentId: uuid("appointment_id").references(() => appointments.id, {
      onDelete: "set null",
    }),
    barberId: uuid("barber_id")
      .notNull()
      .references(() => barbers.id, { onDelete: "cascade" }),
    priceEur: real("price_eur").notNull(),
    commissionPct: real("commission_pct").notNull(),
    soldAt: timestamp("sold_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    orgIdx: index("product_sales_org_idx").on(t.organizationId),
    barberIdx: index("product_sales_barber_idx").on(t.barberId),
  })
);

export const timeOffRequests = pgTable(
  "time_off_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    barberId: uuid("barber_id")
      .notNull()
      .references(() => barbers.id, { onDelete: "cascade" }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    reason: timeOffReasonEnum("reason").notNull().default("vacation"),
    notes: text("notes"),
    status: timeOffStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
  },
  (t) => ({
    orgIdx: index("time_off_org_idx").on(t.organizationId),
    barberIdx: index("time_off_barber_idx").on(t.barberId),
  })
);

// Which services a barber is allowed to perform (junior-barber limiting).
// Absence of any rows for a barber = can perform all services.
export const barberServices = pgTable(
  "barber_services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    barberId: uuid("barber_id")
      .notNull()
      .references(() => barbers.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (t) => ({
    orgIdx: index("barber_services_org_idx").on(t.organizationId),
    barberIdx: index("barber_services_barber_idx").on(t.barberId),
  })
);
