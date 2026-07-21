"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Link2, Plus, Copy, Eye, EyeOff, CheckCircle2, Gauge, FileText, Loader2, Sparkles, X,
} from "lucide-react";
import TopBar from "@/components/TopBar";
import QuotaGauge from "@/components/QuotaGauge";
import { Field, Input, Textarea, Button, StatusPill, Modal, Toast, useToast, fmt } from "@/components/UI";

export default function AdminPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [me, setMe] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [origin, setOrigin] = useState("");

  const load = useCallback(async () => {
    const meRes = await fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json());
    if (!meRes.user) { router.push("/login"); return; }
    if (meRes.user.role !== "admin") { router.push("/superadmin"); return; }
    setMe(meRes.user);
    const linksRes = await fetch("/api/links", { cache: "no-store" }).then((r) => r.json());
    setLinks(linksRes.links || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); setOrigin(window.location.origin); }, [load]);

  if (loading || !me) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 size={26} className="spin text-brand-teal" />
      </div>
    );
  }

  const viewedCount = links.filter((l) => l.viewed).length;

  return (
    <div className="min-h-screen bg-brand-bg">
      <TopBar
        title="Espace Administrateur"
        subtitle={`Connecté en tant que ${me.username}`}
        icon={<Link2 size={20} color="#fff" />}
        color="#0A3E3C"
      />
      <div className="max-w-[1040px] mx-auto px-5 py-8 pb-20">
        <div className="grid grid-cols-[auto,1fr] gap-6 items-center bg-white rounded-[18px] p-6 mb-7 border border-brand-line shadow-[0_10px_30px_rgba(27,33,48,0.05)]">
          <QuotaGauge value={me.quota} max={Math.max(me.quota, me.quotaInitial || me.quota || 1)} />
          <div>
            <p className="text-[13px] text-brand-inkSoft font-semibold uppercase tracking-wide mb-1">Quota de génération</p>
            <h2 className="font-display text-[22px] text-brand-ink mb-2.5">
              {me.quota} lien{me.quota !== 1 ? "s" : ""} disponible{me.quota !== 1 ? "s" : ""}
            </h2>
            <p className="text-[13.5px] text-brand-inkFaint">
              {links.length} dossier{links.length !== 1 ? "s" : ""} généré{links.length !== 1 ? "s" : ""} au total · {viewedCount} consulté{viewedCount !== 1 ? "s" : ""}
            </p>
            {me.quota === 0 && (
              <p className="text-[12.5px] text-brand-gold bg-brand-goldSoft inline-block px-3 py-1.5 rounded-full mt-2.5">
                En attente d'attribution de quota par le super administrateur
              </p>
            )}
            <div>
              <Button
                className="mt-3.5"
                onClick={() => (me.quota <= 0 ? setShowQuotaModal(true) : setShowForm(true))}
              >
                <Plus size={17} /> Générer un lien de dossier
              </Button>
            </div>
          </div>
        </div>

        <h3 className="font-display text-base text-brand-ink mb-3.5">Dossiers générés</h3>

        {links.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border-[1.5px] border-dashed border-brand-line text-brand-inkFaint">
            <FileText size={28} className="mx-auto mb-2.5 opacity-50" />
            <p className="text-[14.5px]">Aucun dossier généré pour l'instant.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <LinkRow key={l.id} link={l} origin={origin} showToast={showToast} />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <NewLinkModal
          origin={origin}
          onClose={() => setShowForm(false)}
          onCreated={async () => { setShowForm(false); await load(); showToast("Lien de dossier généré avec succès.", "success"); }}
          showToast={showToast}
          onQuotaExhausted={() => { setShowForm(false); setShowQuotaModal(true); }}
        />
      )}
      {showQuotaModal && (
        <Modal maxWidth={400}>
          <div className="text-center">
            <div className="w-[76px] h-[76px] mx-auto mb-4.5 rounded-full bg-brand-dangerSoft flex items-center justify-center animate-shake">
              <Gauge size={34} color="#BE4141" />
            </div>
            <h3 className="font-display text-xl text-brand-ink mb-2">Quota épuisé</h3>
            <p className="text-brand-inkSoft text-[14.5px] leading-relaxed mb-5">
              Vous n'avez plus de crédits pour générer un nouveau lien de dossier. Contactez le super administrateur pour recevoir un quota supplémentaire.
            </p>
            <Button variant="danger" className="w-full" onClick={() => setShowQuotaModal(false)}>Compris</Button>
          </div>
        </Modal>
      )}
      <Toast toast={toast} />
    </div>
  );
}

function LinkRow({ link, origin, showToast }) {
  const url = `${origin}/dossier/${link.id}`;
  const copy = () => {
    navigator.clipboard?.writeText(url);
    showToast("Lien copié dans le presse-papiers.", "success");
  };
  return (
    <div className="bg-white rounded-[14px] px-5 py-4 border border-brand-line flex items-center justify-between gap-4 flex-wrap">
      <div className="min-w-[200px]">
        <p className="font-display font-bold text-[15px] text-brand-ink mb-0.5">{link.prenom} {link.nom}</p>
        <p className="font-mono text-[12.5px] text-brand-inkFaint">Réf. {link.id} · {fmt(link.montant)} FCFA</p>
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <StatusPill label={link.viewed ? "Vu" : "Non vu"} color={link.viewed ? "#0E5A56" : "#8B90A0"} bg={link.viewed ? "#E4EFEC" : "#EFEAE0"} icon={link.viewed ? Eye : EyeOff} />
        <StatusPill label={link.validated ? "Validé" : "En attente"} color={link.validated ? "#1E7A52" : "#B8873A"} bg={link.validated ? "#E4EFEC" : "#F4EBD8"} icon={link.validated ? CheckCircle2 : Gauge} />
        <Button variant="ghost" onClick={copy} className="px-3.5 py-2 text-[13px]">
          <Copy size={14} /> Copier le lien
        </Button>
      </div>
    </div>
  );
}

function NewLinkModal({ origin, onClose, onCreated, showToast, onQuotaExhausted }) {
  const [form, setForm] = useState({
    nom: "", prenom: "", montantTotal: "", numero: "", reseau: "",
    montant: "", fraisDossier: "", motif: "", code: "",
  });
  const [created, setCreated] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      if (data.error === "QUOTA_EXHAUSTED") { onQuotaExhausted(); return; }
      showToast(data.error || "Erreur lors de la génération.", "error");
      return;
    }
    setCreated(data.link);
  };

  if (created) {
    const url = `${origin}/dossier/${created.id}`;
    return (
      <Modal maxWidth={460}>
        <div className="text-center">
          <div className="w-[66px] h-[66px] rounded-full bg-brand-tealSoft mx-auto mb-4 flex items-center justify-center animate-popIn">
            <CheckCircle2 size={30} color="#0E5A56" />
          </div>
          <h3 className="font-display text-brand-ink mb-2 text-lg">Lien généré</h3>
          <p className="text-brand-inkSoft text-sm mb-4.5">
            Partagez ce lien avec {created.prenom} {created.nom}. Le code à 4 chiffres lui sera demandé pour valider le dossier.
          </p>
          <div className="bg-brand-bgAlt rounded-[10px] px-3.5 py-3 font-mono text-[13px] text-brand-ink break-all text-left mb-4">
            {url}
          </div>
          <div className="flex gap-2.5">
            <Button className="flex-1" onClick={() => { navigator.clipboard?.writeText(url); showToast("Lien copié.", "success"); }}>
              <Copy size={15} /> Copier
            </Button>
            <Button variant="ghost" className="flex-1" onClick={() => onCreated()}>Fermer</Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal maxWidth={540}>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-display text-[19px] text-brand-ink">Nouveau dossier</h3>
        <X size={20} className="cursor-pointer text-brand-inkFaint" onClick={onClose} />
      </div>
      <form onSubmit={submit} className="max-h-[68vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Nom"><Input value={form.nom} onChange={set("nom")} placeholder="Kouassi" required /></Field>
          <Field label="Prénom"><Input value={form.prenom} onChange={set("prenom")} placeholder="Aïcha" required /></Field>
        </div>
        <Field label="Montant total (FCFA)">
          <Input type="number" value={form.montantTotal} onChange={set("montantTotal")} placeholder="150000" required />
        </Field>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Numéro"><Input value={form.numero} onChange={set("numero")} placeholder="01 97 00 00 00" required /></Field>
          <Field label="Réseau">
            <Input value={form.reseau} onChange={set("reseau")} placeholder="Ex. MTN Mobile Money" required />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Montant (FCFA)" hint="Montant principal affiché">
            <Input type="number" value={form.montant} onChange={set("montant")} placeholder="45000" required />
          </Field>
          <Field label="Frais de dossier (FCFA)" hint="Frais à payer, affichés dans un cadre à part">
            <Input type="number" value={form.fraisDossier} onChange={set("fraisDossier")} placeholder="2500" required />
          </Field>
        </div>
        <Field label="Motif du dossier">
          <Textarea rows={3} value={form.motif} onChange={set("motif")} placeholder="Ex : Frais de dossier — traitement administratif" required />
        </Field>
        <Field label="Code de vérification (4 chiffres)" hint="Ce code sera demandé au destinataire pour valider le dossier">
          <Input
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
            placeholder="••••" inputMode="numeric" required
            className="font-mono tracking-[6px] text-lg text-center max-w-[160px]"
          />
        </Field>
        <Button type="submit" disabled={saving} className="w-full mt-2">
          {saving ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />}
          Générer le lien
        </Button>
      </form>
    </Modal>
  );
}
