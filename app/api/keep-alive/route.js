import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

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
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", error: err.message },
      { status: 500 }
    );
  }
}
