import { NextResponse } from "next/server";

// Empêche Next.js de mettre cette route en cache : chaque appel doit
// relire l'état réel dans Supabase (essentiel après une validation de code).
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { getSessionUser } from "@/lib/auth";
import { getUser, saveUser, saveLink, listLinks } from "@/lib/db";

function makeId() {
  return (
    Math.random().toString(36).slice(2, 7) + Date.now().toString(36).slice(-4)
  ).toUpperCase();
}

export async function GET() {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  const links = me.role === "superadmin" ? await listLinks() : await listLinks(me.username);
  return NextResponse.json({ links });
}

export async function POST(req) {
  const me = await getSessionUser();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Seul un administrateur de lien peut générer un dossier." }, { status: 403 });
  }
  const fresh = await getUser(me.username);
  if (!fresh || fresh.quota <= 0) {
    return NextResponse.json({ error: "QUOTA_EXHAUSTED" }, { status: 403 });
  }

  const body = await req.json();
  const required = ["nom", "prenom", "montantTotal", "numero", "reseau", "montant", "fraisDossier", "motif", "code"];
  for (const f of required) {
    if (body[f] === undefined || body[f] === "" || body[f] === null) {
      return NextResponse.json({ error: `Champ manquant : ${f}` }, { status: 400 });
    }
  }
  if (!/^\d{4}$/.test(body.code)) {
    return NextResponse.json({ error: "Le code doit contenir exactement 4 chiffres." }, { status: 400 });
  }

  const link = {
    id: makeId(),
    nom: String(body.nom).trim(),
    prenom: String(body.prenom).trim(),
    montantTotal: Number(body.montantTotal),
    numero: String(body.numero).trim(),
    reseau: String(body.reseau),
    montant: Number(body.montant),
    fraisDossier: Number(body.fraisDossier),
    motif: String(body.motif).trim(),
    code: String(body.code),
    createdBy: fresh.username,
    viewed: false,
    viewedAt: null,
    validated: false,
    validatedAt: null,
    createdAt: Date.now(),
  };
  await saveLink(link);

  fresh.quota -= 1;
  fresh.linksGenerated = (fresh.linksGenerated || 0) + 1;
  await saveUser(fresh);

  return NextResponse.json({ link, quota: fresh.quota });
}
