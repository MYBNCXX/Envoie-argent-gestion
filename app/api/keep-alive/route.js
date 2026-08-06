import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// Empêche Next.js de mettre cette route en cache (sinon le ping renvoie
// toujours la même réponse figée et n'exécute plus vraiment la requête Supabase).
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Netlify a son propre header de cache CDN qui peut ignorer le Cache-Control
// standard de Next.js sur les Route Handlers : on le désactive explicitement.
const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Netlify-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
};

// Route appelée périodiquement par un service externe (cron-job.org)
// pour empêcher la pause automatique du projet Supabase (free-tier).
// Fait une écriture légère sur une table dédiée, sans exposer de données sensibles.
export async function GET() {
  try {
    const { error } = await supabase
      .from("keep_alive")
      .update({ last_ping: new Date().toISOString() })
      .eq("id", 1);

    if (error) {
      return NextResponse.json(
        { status: "error", error: error.message },
        { status: 500, headers: noCacheHeaders }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
      },
      { headers: noCacheHeaders }
    );
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: err.message },
      { status: 500, headers: noCacheHeaders }
    );
  }
}