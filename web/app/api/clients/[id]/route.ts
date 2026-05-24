import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
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
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  try {
    const [row] = await db
      .update(clients)
      .set({
        firstName: body.firstName?.trim(),
        lastName: body.lastName?.trim() ?? "",
        phone: body.phone?.trim(),
        email: body.email?.trim() || null,
        notes: body.notes?.trim() || null,
      })
      .where(
        and(
          eq(clients.id, params.id),
          eq(clients.organizationId, session.organizationId)
        )
      )
      .returning();

    if (!row) {
      return NextResponse.json(
        { error: "Клиентът не е намерен." },
        { status: 404 }
      );
    }
    return NextResponse.json({ client: row });
  } catch (err) {
    console.error("[clients PATCH] failed", err);
    return NextResponse.json(
      { error: "Грешка при обновяване." },
      { status: 500 }
    );
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
      .delete(clients)
      .where(
        and(
          eq(clients.id, params.id),
          eq(clients.organizationId, session.organizationId)
        )
      );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[clients DELETE] failed", err);
    return NextResponse.json(
      { error: "Грешка при изтриване." },
      { status: 500 }
    );
  }
}
