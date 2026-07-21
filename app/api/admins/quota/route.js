import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUser, saveUser } from "@/lib/db";

export async function POST(req) {
  const me = await getSessionUser();
  if (!me || me.role !== "superadmin") {
    return NextResponse.json({ error: "Accès réservé au super administrateur." }, { status: 403 });
  }
  const { username, amount } = await req.json();
  const target = await getUser(username);
  if (!target || target.role !== "admin") {
    return NextResponse.json({ error: "Administrateur introuvable." }, { status: 404 });
  }
  const add = Number(amount) || 0;
  target.quota = Math.max(0, (target.quota || 0) + add);
  target.quotaInitial = Math.max(target.quotaInitial || 0, target.quota);
  await saveUser(target);
  const { password, ...safe } = target;
  return NextResponse.json({ user: safe });
}
