import { NextResponse } from "next/server";

// Empêche Next.js de mettre cette route en cache : chaque appel doit
// relire l'état réel dans Supabase (essentiel après une validation de code).
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { getLink, saveLink } from "@/lib/db";

// Route publique : consultée par le destinataire du lien.
// Le code n'est jamais renvoyé au client.
export async function GET(_req, { params }) {
  const link = await getLink(params.id);
  if (!link) {
    return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  }
  if (!link.viewed) {
    link.viewed = true;
    link.viewedAt = Date.now();
    await saveLink(link);
  }
  const { code, ...publicLink } = link;
  return NextResponse.json({ link: publicLink });
}
