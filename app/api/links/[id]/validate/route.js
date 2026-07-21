import { NextResponse } from "next/server";
import { getLink, saveLink } from "@/lib/db";

export async function POST(req, { params }) {
  const { code } = await req.json();
  const link = await getLink(params.id);
  if (!link) {
    return NextResponse.json({ error: "Dossier introuvable." }, { status: 404 });
  }
  if (link.validated) {
    const { code: _c, ...publicLink } = link;
    return NextResponse.json({ ok: true, link: publicLink });
  }
  if (String(code) !== link.code) {
    return NextResponse.json({ ok: false, error: "Code erroné." }, { status: 400 });
  }
  link.validated = true;
  link.validatedAt = Date.now();
  await saveLink(link);
  const { code: _c, ...publicLink } = link;
  return NextResponse.json({ ok: true, link: publicLink });
}
