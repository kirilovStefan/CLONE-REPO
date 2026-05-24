import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { locations, barbers, services } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

/**
 * One call that returns the org's locations, barbers and services so
 * the dashboard can hydrate its calendar context in a single request.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Неоторизиран." }, { status: 401 });
  }

  try {
    const org = session.organizationId;
    const [locationRows, barberRows, serviceRows] = await Promise.all([
      db
        .select()
        .from(locations)
        .where(eq(locations.organizationId, org))
        .orderBy(asc(locations.createdAt)),
      db
        .select()
        .from(barbers)
        .where(eq(barbers.organizationId, org))
        .orderBy(asc(barbers.createdAt)),
      db
        .select()
        .from(services)
        .where(eq(services.organizationId, org))
        .orderBy(asc(services.createdAt)),
    ]);

    return NextResponse.json({
      locations: locationRows,
      barbers: barberRows,
      services: serviceRows,
    });
  } catch (err) {
    console.error("[bootstrap] failed", err);
    return NextResponse.json(
      { error: "Грешка при зареждане." },
      { status: 500 }
    );
  }
}
