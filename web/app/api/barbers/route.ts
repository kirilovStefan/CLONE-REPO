import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { barbers } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

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
    return NextResponse.json({ barber: row }, { status: 201 });
  } catch (err) {
    console.error("[barbers POST] failed", err);
    return NextResponse.json({ error: "Грешка при запазване." }, { status: 500 });
  }
}
