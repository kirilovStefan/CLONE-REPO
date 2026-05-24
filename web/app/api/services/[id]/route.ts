import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
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
    description?: string;
    durationMin?: number;
    priceEur?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  try {
    const [row] = await db
      .update(services)
      .set({
        name: body.name?.trim(),
        description: body.description?.trim() ?? "",
        durationMin:
          body.durationMin !== undefined
            ? Math.max(5, Math.round(body.durationMin))
            : undefined,
        priceEur:
          body.priceEur !== undefined ? Math.max(0, body.priceEur) : undefined,
      })
      .where(
        and(
          eq(services.id, params.id),
          eq(services.organizationId, session.organizationId)
        )
      )
      .returning();
    if (!row) {
      return NextResponse.json({ error: "Не е намерена." }, { status: 404 });
    }
    return NextResponse.json({ service: row });
  } catch (err) {
    console.error("[services PATCH] failed", err);
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
      .delete(services)
      .where(
        and(
          eq(services.id, params.id),
          eq(services.organizationId, session.organizationId)
        )
      );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[services DELETE] failed", err);
    return NextResponse.json({ error: "Грешка при изтриване." }, { status: 500 });
  }
}
