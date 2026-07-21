import { createClient } from "@supabase/supabase-js";

// Client Supabase côté serveur uniquement (clé service role).
// Ce fichier n'est importé que par des routes API / composants serveur —
// jamais par du code client — donc la clé n'est jamais exposée au navigateur.

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "[supabase] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant(e). " +
    "Copiez .env.example vers .env.local et renseignez vos identifiants Supabase."
  );
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
