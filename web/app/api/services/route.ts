import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
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
      .from(services)
      .where(eq(services.organizationId, session.organizationId))
      .orderBy(asc(services.createdAt));
    return NextResponse.json({ services: rows });
  } catch (err) {
    console.error("[services GET] failed", err);
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
    description?: string;
    durationMin?: number;
    priceEur?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json(
      { error: "Името на услугата е задължително." },
      { status: 400 }
    );
  }

  try {
    const [row] = await db
      .insert(services)
      .values({
        organizationId: session.organizationId,
        name,
        description: body.description?.trim() ?? "",
        durationMin: Math.max(5, Math.round(body.durationMin ?? 30)),
        priceEur: Math.max(0, body.priceEur ?? 0),
      })
      .returning();
    return NextResponse.json({ service: row }, { status: 201 });
  } catch (err) {
    console.error("[services POST] failed", err);
    return NextResponse.json({ error: "Грешка при запазване." }, { status: 500 });
  }
}
