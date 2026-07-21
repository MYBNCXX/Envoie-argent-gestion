import { NextResponse } from "next/server";
import { getUser, saveUser } from "@/lib/db";
import { createSessionCookie } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password || password.length < 4) {
    return NextResponse.json(
      { error: "Identifiant et mot de passe (4 caractères min.) requis." },
      { status: 400 }
    );
  }
  const clean = username.trim().toLowerCase();
  if (await getUser(clean)) {
    return NextResponse.json({ error: "Cet identifiant est déjà utilisé." }, { status: 409 });
  }
  const user = {
    username: clean,
    password,
    role: "admin",
    quota: 0,
    quotaInitial: 0,
    linksGenerated: 0,
    createdAt: Date.now(),
  };
  await saveUser(user);

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
