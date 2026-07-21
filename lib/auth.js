import { cookies } from "next/headers";
import { getUser } from "./db";

const COOKIE_NAME = "dossier_session";

// Session simple (non chiffrée) stockée dans un cookie httpOnly.
// Suffisant pour un prototype interne. Pour la production, remplacez
// par une vraie solution de session/JWT signée (ex. next-auth, iron-session),
// ou par Supabase Auth directement.

export function createSessionCookie(username) {
  const value = Buffer.from(JSON.stringify({ username })).toString("base64");
  return { name: COOKIE_NAME, value };
}

export async function getSessionUser() {
  const store = cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const { username } = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    const user = await getUser(username);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
