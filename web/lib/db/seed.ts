import { db } from "./index";
import { locations, services, barbers, appointments } from "./schema";

/**
 * Populate a freshly-created organization with a starter set so the
 * dashboard is alive on first login: one location, the standard
 * service menu, a few barbers, and a handful of demo appointments
 * for today. Everything is keyed to the real generated UUIDs so the
 * calendar renders consistently.
 *
 * Prices are EUR (the base currency).
 */
export async function seedOrganization(
  organizationId: string,
  businessName: string
): Promise<void> {
  // 1. Default location
  const [location] = await db
    .insert(locations)
    .values({ organizationId, name: businessName, address: "" })
    .returning();

  // 2. Service menu
  const serviceRows = await db
    .insert(services)
    .values([
      { organizationId, name: "Класическо подстригване", description: "Машинка и ножица, оформяне на линии.", durationMin: 30, priceEur: 13 },
      { organizationId, name: "Оформяне на брада", description: "Подравняване, бръснене с бръснач, гореща кърпа.", durationMin: 30, priceEur: 10 },
      { organizationId, name: "Подстригване + брада", description: "Комплексна услуга, най-търсеният пакет.", durationMin: 60, priceEur: 22 },
      { organizationId, name: "Детска прическа", description: "До 12 години, с търпение и усмивка.", durationMin: 30, priceEur: 9 },
      { organizationId, name: "Skin fade", description: "Преход до кожа, прецизна работа с машинка.", durationMin: 45, priceEur: 16 },
      { organizationId, name: "Hot towel бръснене", description: "Класическо мокро бръснене с гореща кърпа.", durationMin: 45, priceEur: 14 },
    ])
    .returning();

  // 3. Barbers
  const barberRows = await db
    .insert(barbers)
    .values([
      { organizationId, locationId: location.id, name: "Иван Петров", title: "Senior Barber", rating: 4.9, reviewsCount: 312, workStart: 9, workEnd: 18, specialties: ["Fade", "Брада", "Класика"] },
      { organizationId, locationId: location.id, name: "Георги Стоянов", title: "Master Barber", rating: 4.8, reviewsCount: 188, workStart: 10, workEnd: 19, specialties: ["Скин фейд", "Hot towel"] },
      { organizationId, locationId: location.id, name: "Мартин Колев", title: "Barber", rating: 4.7, reviewsCount: 94, workStart: 11, workEnd: 17, specialties: ["Детски", "Класика"] },
    ])
    .returning();

  // 4. A few demo appointments for today
  function todayAt(hour: number, minute: number): Date {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  const svc = (i: number) => serviceRows[i].id;
  const br = (i: number) => barberRows[i].id;

  await db.insert(appointments).values([
    { organizationId, locationId: location.id, barberId: br(0), serviceId: svc(2), clientName: "Петър Костов", clientPhone: "+359 88 100 0001", startsAt: todayAt(9, 0), status: "completed" },
    { organizationId, locationId: location.id, barberId: br(0), serviceId: svc(4), clientName: "Стоян Иванов", clientPhone: "+359 88 100 0002", startsAt: todayAt(10, 30), status: "confirmed" },
    { organizationId, locationId: location.id, barberId: br(0), serviceId: svc(1), clientName: "Иво Стоянов", clientPhone: "+359 88 100 0004", startsAt: todayAt(14, 0), status: "confirmed" },
    { organizationId, locationId: location.id, barberId: br(1), serviceId: svc(4), clientName: "Калоян Д.", clientPhone: "+359 88 100 1001", startsAt: todayAt(10, 30), status: "completed" },
    { organizationId, locationId: location.id, barberId: br(1), serviceId: svc(2), clientName: "Емил Х.", clientPhone: "+359 88 100 1004", startsAt: todayAt(16, 0), status: "confirmed" },
    { organizationId, locationId: location.id, barberId: br(2), serviceId: svc(3), clientName: "Иво (8г)", clientPhone: "+359 88 100 2001", startsAt: todayAt(11, 0), status: "completed" },
    { organizationId, locationId: location.id, barberId: br(2), serviceId: svc(0), clientName: "Симеон Й.", clientPhone: "+359 88 100 2004", startsAt: todayAt(15, 30), status: "confirmed" },
  ]);
}
