// Devises disponibles pour les dossiers/liens.
// Chaque lien enregistre sa propre devise (colonne `devise` en base).

export const CURRENCIES = [
  { code: "XOF", label: "FCFA — Afrique de l'Ouest (XOF)", symbol: "FCFA" },
  { code: "XAF", label: "FCFA — Afrique Centrale (XAF)", symbol: "FCFA" },
  { code: "EUR", label: "Euro (EUR)", symbol: "€" },
  { code: "USD", label: "Dollar US (USD)", symbol: "$" },
];

export const DEFAULT_CURRENCY = "XOF";

export function currencySymbol(code) {
  return CURRENCIES.find((c) => c.code === code)?.symbol || code || "";
}

export function isValidCurrency(code) {
  return CURRENCIES.some((c) => c.code === code);
}

// Formate un montant avec le symbole/code adapté à la devise.
// Ex: formatMoney(45000, "XOF") -> "45 000 FCFA"
//     formatMoney(45000, "EUR") -> "45 000 €"
//     formatMoney(45000, "USD") -> "$45 000"
export function formatMoney(amount, code) {
  const n = new Intl.NumberFormat("fr-FR").format(Math.round(Number(amount) || 0));
  const symbol = currencySymbol(code);
  if (code === "USD") return `${symbol}${n}`;
  return `${n} ${symbol}`;
}
