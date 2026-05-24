import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appointments } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

type Status =
  | "confirmed"
  | "in-progress"
  | "completed"
  | "no-show"
  | "cancelled";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }

  let body: {
    barberId?: string;
    startsAt?: string;
    durationMinOverride?: number | null;
    status?: Status;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (body.barberId !== undefined) patch.barberId = body.barberId;
  if (body.startsAt !== undefined) patch.startsAt = new Date(body.startsAt);
  if (body.durationMinOverride !== undefined)
    patch.durationMinOverride = body.durationMinOverride;
  if (body.status !== undefined) patch.status = body.status;

  try {
    const [row] = await db
      .update(appointments)
      .set(patch)
      .where(
        and(
          eq(appointments.id, params.id),
          eq(appointments.organizationId, session.organizationId)
        )
      )
      .returning();
    if (!row) {
      return NextResponse.json({ error: "Не е намерен." }, { status: 404 });
    }
    return NextResponse.json({ appointment: row });
  } catch (err) {
    console.error("[appointments PATCH] failed", err);
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
      .delete(appointments)
      .where(
        and(
          eq(appointments.id, params.id),
          eq(appointments.organizationId, session.organizationId)
        )
      );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[appointments DELETE] failed", err);
    return NextResponse.json({ error: "Грешка при изтриване." }, { status: 500 });
  }
}
