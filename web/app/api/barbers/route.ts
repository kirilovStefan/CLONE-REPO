import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { barbers, barberServices } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }
  try {
    const org = session.organizationId;
    const [rows, joinRows] = await Promise.all([
      db
        .select()
        .from(barbers)
        .where(eq(barbers.organizationId, org))
        .orderBy(asc(barbers.createdAt)),
      db
        .select()
        .from(barberServices)
        .where(eq(barberServices.organizationId, org)),
    ]);

    const byBarber = new Map<string, string[]>();
    for (const r of joinRows) {
      const list = byBarber.get(r.barberId) ?? [];
      list.push(r.serviceId);
      byBarber.set(r.barberId, list);
    }

    const result = rows.map((b) => ({
      ...b,
      serviceIds: byBarber.get(b.id) ?? [],
    }));
    return NextResponse.json({ barbers: result });
  } catch (err) {
    console.error("[barbers GET] failed", err);
    return NextResponse.json({ error: "Грешка при зареждане." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }

  let body: {
    name?: string;
    title?: string;
    locationId?: string;
    workStart?: number;
    workEnd?: number;
    specialties?: string[];
    serviceIds?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name || !body.locationId) {
    return NextResponse.json(
      { error: "Име и локация са задължителни." },
      { status: 400 }
    );
  }

  try {
    const [row] = await db
      .insert(barbers)
      .values({
        organizationId: session.organizationId,
        locationId: body.locationId,
        name,
        title: body.title?.trim() || "Barber",
        workStart: body.workStart ?? 9,
        workEnd: body.workEnd ?? 18,
        specialties: body.specialties ?? [],
      })
      .returning();

    const serviceIds = body.serviceIds ?? [];
    if (serviceIds.length > 0) {
      await db.insert(barberServices).values(
        serviceIds.map((serviceId) => ({
          organizationId: session.organizationId,
          barberId: row.id,
          serviceId,
        }))
      );
    }

    return NextResponse.json({ barber: { ...row, serviceIds } }, { status: 201 });
  } catch (err) {
    console.error("[barbers POST] failed", err);
    return NextResponse.json({ error: "Грешка при запазване." }, { status: 500 });
  }
}
