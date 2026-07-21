import { NextResponse } from "next/server";
import { getUser } from "@/lib/db";
import { createSessionCookie } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();
  const user = await getUser((username || "").trim());
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }
  const { password: _pw, ...safe } = user;
  const res = NextResponse.json({ user: safe });
  const cookie = createSessionCookie(user.username);
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
