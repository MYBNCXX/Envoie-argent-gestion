import { NextResponse } from "next/server";

// Empêche Next.js de mettre cette route en cache : chaque appel doit
// relire l'état réel dans Supabase (essentiel après une validation de code).
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user });
}
