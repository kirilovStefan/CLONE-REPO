import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { organizations, users, locations } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import {
  signSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    businessName?: string;
    ownerName?: string;
    email?: string;
    password?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Невалидна заявка." }, { status: 400 });
  }

  const businessName = body.businessName?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!businessName || !email || !password) {
    return NextResponse.json(
      { error: "Попълни име на салон, имейл и парола." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json(
      { error: "Невалиден имейл адрес." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Паролата трябва да е поне 6 символа." },
      { status: 400 }
    );
  }

  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Вече има акаунт с този имейл." },
        { status: 409 }
      );
    }

    const [org] = await db
      .insert(organizations)
      .values({ name: businessName })
      .returning();

    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        organizationId: org.id,
        email,
        passwordHash,
        role: "owner",
      })
      .returning();

    // Give the new salon a default location to start from.
    await db
      .insert(locations)
      .values({ organizationId: org.id, name: businessName, address: "" });

    const token = await signSession({
      userId: user.id,
      organizationId: org.id,
      role: "owner",
      email,
    });

    const res = NextResponse.json({
      user: { id: user.id, email, role: "owner" },
      organization: { id: org.id, name: org.name },
    });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[signup] failed", err);
    return NextResponse.json(
      { error: "Грешка при създаване на акаунта. Опитай отново." },
      { status: 500 }
    );
  }
}
