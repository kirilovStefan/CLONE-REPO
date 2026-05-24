import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const [org] = await db
      .select({ id: organizations.id, name: organizations.name })
      .from(organizations)
      .where(eq(organizations.id, session.organizationId))
      .limit(1);

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
      organization: org ?? null,
    });
  } catch (err) {
    console.error("[me] failed", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
