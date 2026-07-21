"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, FileText, Eye, CheckCircle2, Gauge, Loader2, X } from "lucide-react";
import TopBar from "@/components/TopBar";
import { Field, Input, Button, StatusPill, Modal, Toast, useToast } from "@/components/UI";

export default function SuperAdminPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [me, setMe] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quotaEdit, setQuotaEdit] = useState(null);

  const load = useCallback(async () => {
    const meRes = await fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json());
    if (!meRes.user) { router.push("/login"); return; }
    if (meRes.user.role !== "superadmin") { router.push("/admin"); return; }
    setMe(meRes.user);
    const data = await fetch("/api/admins", { cache: "no-store" }).then((r) => r.json());
    setAdmins(data.admins || []);
    setStats(data.stats || null);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  if (loading || !me) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 size={26} className="spin text-brand-teal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <TopBar title="Super Administration" subtitle={`Connecté en tant que ${me.username}`} icon={<Users size={20} color="#fff" />} color="#432244" />
      <div className="max-w-[1080px] mx-auto px-5 py-8 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          <StatCard label="Administrateurs" value={stats?.totalAdmins ?? 0} color="#432244" bg="#EFE6EF" icon={Users} />
          <StatCard label="Dossiers générés" value={stats?.totalLinks ?? 0} color="#0E5A56" bg="#E4EFEC" icon={FileText} />
          <StatCard label="Dossiers vus" value={stats?.viewed ?? 0} color="#B8873A" bg="#F4EBD8" icon={Eye} />
          <StatCard label="Dossiers validés" value={stats?.validated ?? 0} color="#1E7A52" bg="#E4EFEC" icon={CheckCircle2} />
        </div>

        <h3 className="font-display text-base text-brand-ink mb-3.5">Administrateurs inscrits</h3>

        {admins.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border-[1.5px] border-dashed border-brand-line text-brand-inkFaint">
            Aucun administrateur inscrit pour l'instant. Ils apparaîtront ici dès leur inscription.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {admins.map((a) => (
              <div key={a.username} className="bg-white rounded-[14px] px-5 py-4 border border-brand-line flex items-center justify-between flex-wrap gap-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-brand-plumSoft flex items-center justify-center text-brand-plum font-bold font-display">
                    {a.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-display font-bold text-[15px] text-brand-ink">{a.username}</p>
                    <p className="text-[12.5px] text-brand-inkFaint">{a.linkCount} lien{a.linkCount !== 1 ? "s" : ""} généré{a.linkCount !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <StatusPill label={`Quota : ${a.quota}`} color={a.quota === 0 ? "#BE4141" : "#0E5A56"} bg={a.quota === 0 ? "#F8E7E5" : "#E4EFEC"} icon={Gauge} />
                  <Button variant="ghost" className="px-3.5 py-2 text-[13px]" onClick={() => setQuotaEdit(a)}>
                    <Plus size={14} /> Ajouter quota
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {quotaEdit && (
        <AddQuotaModal
          admin={quotaEdit}
          onClose={() => setQuotaEdit(null)}
          onSaved={async () => { setQuotaEdit(null); await load(); showToast("Quota mis à jour.", "success"); }}
        />
      )}
      <Toast toast={toast} />
    </div>
  );
}

function StatCard({ label, value, color, bg, icon: Icon }) {
  return (
    <div className="bg-white rounded-[14px] p-4.5 border border-brand-line">
      <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center mb-3" style={{ background: bg }}>
        <Icon size={17} color={color} />
      </div>
      <p className="font-mono text-2xl font-bold text-brand-ink">{value}</p>
      <p className="text-[12.5px] text-brand-inkFaint">{label}</p>
    </div>
  );
}

function AddQuotaModal({ admin, onClose, onSaved }) {
  const [amount, setAmount] = useState(5);
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admins/quota", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: admin.username, amount: Number(amount) }),
    });
    setSaving(false);
    onSaved();
  };
  return (
    <Modal maxWidth={380}>
      <div className="flex justify-between items-center mb-4.5">
        <h3 className="font-display text-[17px] text-brand-ink">Quota — {admin.username}</h3>
        <X size={20} className="cursor-pointer text-brand-inkFaint" onClick={onClose} />
      </div>
      <p className="text-[13.5px] text-brand-inkSoft mb-3.5">
        Quota actuel : <b className="text-brand-ink">{admin.quota}</b>
      </p>
      <form onSubmit={submit}>
        <Field label="Liens à ajouter">
          <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
          Ajouter
        </Button>
      </form>
    </Modal>
  );
}
