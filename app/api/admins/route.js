import { NextResponse } from "next/server";

// Empêche Next.js de mettre cette route en cache : chaque appel doit
// relire l'état réel dans Supabase (essentiel après une validation de code).
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { getSessionUser } from "@/lib/auth";
import { listUsers, listLinks } from "@/lib/db";

export async function GET() {
  const me = await getSessionUser();
  if (!me || me.role !== "superadmin") {
    return NextResponse.json({ error: "Accès réservé au super administrateur." }, { status: 403 });
  }
  const users = await listUsers();
  const allLinks = await listLinks();

  const admins = [];
  for (const u of users.filter((u) => u.role === "admin")) {
    const { password, ...safe } = u;
    const count = allLinks.filter((l) => l.createdBy === u.username).length;
    admins.push({ ...safe, linkCount: count });
  }
  admins.sort((a, b) => b.createdAt - a.createdAt);

  return NextResponse.json({
    admins,
    stats: {
      totalAdmins: admins.length,
      totalLinks: allLinks.length,
      viewed: allLinks.filter((l) => l.viewed).length,
      validated: allLinks.filter((l) => l.validated).length,
    },
  });
}
