import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { barbers, barberServices } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  const org = session.organizationId;
  try {
    const [row] = await db
      .update(barbers)
      .set({
        name: body.name?.trim(),
        title: body.title?.trim(),
        locationId: body.locationId,
        workStart: body.workStart,
        workEnd: body.workEnd,
        specialties: body.specialties,
      })
      .where(and(eq(barbers.id, params.id), eq(barbers.organizationId, org)))
      .returning();
    if (!row) {
      return NextResponse.json({ error: "Не е намерен." }, { status: 404 });
    }

    if (body.serviceIds !== undefined) {
      await db
        .delete(barberServices)
        .where(
          and(
            eq(barberServices.barberId, params.id),
            eq(barberServices.organizationId, org)
          )
        );
      if (body.serviceIds.length > 0) {
        await db.insert(barberServices).values(
          body.serviceIds.map((serviceId) => ({
            organizationId: org,
            barberId: params.id,
            serviceId,
          }))
        );
      }
    }

    const joinRows = await db
      .select({ serviceId: barberServices.serviceId })
      .from(barberServices)
      .where(
        and(
          eq(barberServices.barberId, params.id),
          eq(barberServices.organizationId, org)
        )
      );

    return NextResponse.json({
      barber: { ...row, serviceIds: joinRows.map((r) => r.serviceId) },
    });
  } catch (err) {
    console.error("[barbers PATCH] failed", err);
    return NextResponse.json({ error: "Грешка при обновяване." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }
  try {
    await db
      .delete(barbers)
      .where(
        and(
          eq(barbers.id, params.id),
          eq(barbers.organizationId, session.organizationId)
        )
      );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[barbers DELETE] failed", err);
    return NextResponse.json({ error: "Грешка при изтриване." }, { status: 500 });
  }
}
