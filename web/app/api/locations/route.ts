import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { locations } from "@/lib/db/schema";
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
      .from(locations)
      .where(eq(locations.organizationId, session.organizationId))
      .orderBy(asc(locations.createdAt));
    return NextResponse.json({ locations: rows });
  } catch (err) {
    console.error("[locations GET] failed", err);
    return NextResponse.json({ error: "Грешка при зареждане." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }

  let body: { name?: string; address?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json(
      { error: "Името на локацията е задължително." },
      { status: 400 }
    );
  }

  try {
    const [row] = await db
      .insert(locations)
      .values({
        organizationId: session.organizationId,
        name,
        address: body.address?.trim() ?? "",
      })
      .returning();
    return NextResponse.json({ location: row }, { status: 201 });
  } catch (err) {
    console.error("[locations POST] failed", err);
    return NextResponse.json({ error: "Грешка при запазване." }, { status: 500 });
  }
}
