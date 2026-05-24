import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

// Returns every appointment for the org; the client filters by day.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }
  try {
    const rows = await db
      .select()
      .from(appointments)
      .where(eq(appointments.organizationId, session.organizationId))
      .orderBy(asc(appointments.startsAt));
    return NextResponse.json({ appointments: rows });
  } catch (err) {
    console.error("[appointments GET] failed", err);
    return NextResponse.json({ error: "Грешка при зареждане." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }

  let body: {
    locationId?: string;
    barberId?: string;
    serviceId?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
    startsAt?: string;
    durationMinOverride?: number | null;
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  if (!body.barberId || !body.serviceId || !body.startsAt || !body.locationId) {
    return NextResponse.json(
      { error: "Липсват задължителни полета." },
      { status: 400 }
    );
  }

  try {
    const [row] = await db
      .insert(appointments)
      .values({
        organizationId: session.organizationId,
        locationId: body.locationId,
        barberId: body.barberId,
        serviceId: body.serviceId,
        clientName: body.clientName?.trim() || "Клиент",
        clientPhone: body.clientPhone?.trim() ?? "",
        clientEmail: body.clientEmail?.trim() || null,
        startsAt: new Date(body.startsAt),
        durationMinOverride: body.durationMinOverride ?? null,
        notes: body.notes?.trim() || null,
        status: "confirmed",
      })
      .returning();
    return NextResponse.json({ appointment: row }, { status: 201 });
  } catch (err) {
    console.error("[appointments POST] failed", err);
    return NextResponse.json({ error: "Грешка при запазване." }, { status: 500 });
  }
}
