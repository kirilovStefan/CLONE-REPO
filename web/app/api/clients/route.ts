import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }

  try {
    const rows = await db
      .select()
      .from(clients)
      .where(eq(clients.organizationId, session.organizationId))
      .orderBy(desc(clients.createdAt));
    return NextResponse.json({ clients: rows });
  } catch (err) {
    console.error("[clients GET] failed", err);
    return NextResponse.json(
      { error: "Грешка при зареждане." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

  const firstName = body.firstName?.trim();
  const phone = body.phone?.trim();
  if (!firstName || !phone) {
    return NextResponse.json(
      { error: "Име и телефон са задължителни." },
      { status: 400 }
    );
  }

  try {
    const [row] = await db
      .insert(clients)
      .values({
        organizationId: session.organizationId,
        firstName,
        lastName: body.lastName?.trim() ?? "",
        phone,
        email: body.email?.trim() || null,
        notes: body.notes?.trim() || null,
      })
      .returning();
    return NextResponse.json({ client: row }, { status: 201 });
  } catch (err) {
    console.error("[clients POST] failed", err);
    return NextResponse.json(
      { error: "Грешка при запазване." },
      { status: 500 }
    );
  }
}
