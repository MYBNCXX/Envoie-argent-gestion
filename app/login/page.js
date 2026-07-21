"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Eye, EyeOff, User as UserIcon, Lock, ChevronRight, Loader2 } from "lucide-react";
import { Field, Input, Button, Toast, useToast } from "@/components/UI";

export default function LoginPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      showToast(data.error || "Erreur de connexion.", "error");
      return;
    }
    router.push(data.user.role === "superadmin" ? "/superadmin" : "/admin");
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-5">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="w-[58px] h-[58px] rounded-2xl bg-brand-tealDeep mx-auto mb-4 flex items-center justify-center shadow-[0_10px_24px_rgba(10,62,60,0.28)]">
            <ShieldCheck size={28} color="#fff" />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-ink mb-1.5 tracking-tight">
            Dossiers &amp; Liens
          </h1>
          <p className="text-brand-inkSoft text-sm">Connexion à l'espace administrateur</p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-[18px] p-7 shadow-[0_14px_40px_rgba(27,33,48,0.08)] border border-brand-line"
        >
          <Field label="Identifiant">
            <div className="relative">
              <UserIcon size={16} className="absolute left-3.5 top-3.5 text-brand-inkFaint" />
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ex. admin" className="pl-9" autoFocus />
            </div>
          </Field>
          <Field label="Mot de passe">
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
          <Button type="submit" disabled={loading} className="w-full mt-1.5">
            {loading ? <Loader2 size={17} className="spin" /> : <ChevronRight size={17} />}
            Se connecter
          </Button>
        </form>

        <p className="text-center text-[13px] text-brand-inkSoft mt-5">
          Pas encore de compte administrateur ?{" "}
          <Link href="/register" className="text-brand-teal font-semibold">
            S'inscrire
          </Link>
        </p>
        <p className="text-center text-xs text-brand-inkFaint mt-3 leading-relaxed">
          Super Admin de démonstration : <b>admin</b> / <b>admin123</b>
        </p>
      </div>
      <Toast toast={toast} />
    </div>
  );
}
