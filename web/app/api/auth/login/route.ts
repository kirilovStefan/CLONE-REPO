import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import {
  signSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Въведи имейл и парола." },
      { status: 400 }
    );
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Same generic message whether the email or password is wrong.
    const invalid = NextResponse.json(
      { error: "Грешен имейл или парола." },
      { status: 401 }
    );
    if (!user) return invalid;

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return invalid;

    const token = await signSession({
      userId: user.id,
      organizationId: user.organizationId,
      role: user.role,
      email: user.email,
      barberId: user.barberId ?? undefined,
    });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role },
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[login] failed", err);
    return NextResponse.json(
      { error: "Грешка при вход. Опитай отново." },
      { status: 500 }
    );
  }
}
