import { supabase } from "./supabaseClient";

// Couche d'accès aux données — Supabase (Postgres).
// Toutes les fonctions sont asynchrones : pensez à les "await" partout.

function fromDbUser(row) {
  if (!row) return null;
  return {
    username: row.username,
    password: row.password,
    role: row.role,
    quota: row.quota,
    quotaInitial: row.quota_initial,
    linksGenerated: row.links_generated,
    createdAt: Number(row.created_at),
  };
}
function toDbUser(u) {
  return {
    username: u.username.toLowerCase(),
    password: u.password,
    role: u.role,
    quota: u.quota,
    quota_initial: u.quotaInitial,
    links_generated: u.linksGenerated,
    created_at: u.createdAt,
  };
}
function fromDbLink(row) {
  if (!row) return null;
  return {
    id: row.id,
    nom: row.nom,
    prenom: row.prenom,
    montantTotal: Number(row.montant_total),
    numero: row.numero,
    reseau: row.reseau,
    montant: Number(row.montant),
    fraisDossier: Number(row.frais_dossier),
    motif: row.motif,
    code: row.code,
    createdBy: row.created_by,
    viewed: row.viewed,
    viewedAt: row.viewed_at ? Number(row.viewed_at) : null,
    validated: row.validated,
    validatedAt: row.validated_at ? Number(row.validated_at) : null,
    createdAt: Number(row.created_at),
  };
}
function toDbLink(l) {
  return {
    id: l.id,
    nom: l.nom,
    prenom: l.prenom,
    montant_total: l.montantTotal,
    numero: l.numero,
    reseau: l.reseau,
    montant: l.montant,
    frais_dossier: l.fraisDossier,
    motif: l.motif,
    code: l.code,
    created_by: l.createdBy,
    viewed: l.viewed,
    viewed_at: l.viewedAt,
    validated: l.validated,
    validated_at: l.validatedAt,
    created_at: l.createdAt,
  };
}

export async function getUser(username) {
  if (!username) return null;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return fromDbUser(data);
}

export async function saveUser(user) {
  const { error } = await supabase.from("users").upsert(toDbUser(user));
  if (error) throw error;
  return user;
}

export async function listUsers() {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return (data || []).map(fromDbUser);
}

export async function getLink(id) {
  const { data, error } = await supabase.from("links").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return fromDbLink(data);
}

export async function saveLink(link) {
  const { error } = await supabase.from("links").upsert(toDbLink(link));
  if (error) throw error;
  return link;
}

export async function listLinks(createdBy) {
  let query = supabase.from("links").select("*").order("created_at", { ascending: false });
  if (createdBy) query = query.eq("created_by", createdBy);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(fromDbLink);
}
