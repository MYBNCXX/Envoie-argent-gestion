"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff, User as UserIcon, Lock, Loader2, Gauge } from "lucide-react";
import { Field, Input, Button, Toast, useToast } from "@/components/UI";

export default function RegisterPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      showToast(data.error || "Erreur lors de l'inscription.", "error");
      return;
    }
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-5">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-[58px] h-[58px] rounded-2xl bg-brand-teal mx-auto mb-4 flex items-center justify-center shadow-[0_10px_24px_rgba(14,90,86,0.28)]">
            <UserPlus size={26} color="#fff" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-ink mb-1.5 tracking-tight">
            Créer un compte administrateur
          </h1>
          <p className="text-brand-inkSoft text-sm">Vous pourrez générer des liens dès qu'un quota vous sera attribué</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-[18px] p-7 shadow-[0_14px_40px_rgba(27,33,48,0.08)] border border-brand-line">
          <Field label="Identifiant">
            <div className="relative">
              <UserIcon size={16} className="absolute left-3.5 top-3.5 text-brand-inkFaint" />
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ex. jsmith" className="pl-9" autoFocus />
            </div>
          </Field>
          <Field label="Mot de passe" hint="4 caractères minimum">
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-brand-inkFaint" />
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 pr-10"
              />
              <span onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-3 cursor-pointer text-brand-inkFaint">
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </span>
            </div>
          </Field>

          <div className="flex items-start gap-2.5 bg-brand-goldSoft text-brand-gold rounded-xl px-3.5 py-3 text-[12.5px] mb-5 leading-relaxed">
            <Gauge size={16} className="mt-0.5 shrink-0" />
            Votre quota de départ est à 0. Le super administrateur doit vous attribuer des liens avant que vous puissiez en générer.
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 size={17} className="spin" /> : <UserPlus size={17} />}
            Créer mon compte
          </Button>
        </form>

        <p className="text-center text-[13px] text-brand-inkSoft mt-5">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-brand-teal font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
