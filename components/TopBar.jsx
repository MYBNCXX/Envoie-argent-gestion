"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/UI";

export default function TopBar({ title, subtitle, icon, color }) {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };
  return (
    <div className="bg-white border-b border-brand-line px-5 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center" style={{ background: color }}>
          {icon}
        </div>
        <div>
          <p className="font-display font-bold text-[15.5px] text-brand-ink leading-tight">{title}</p>
          <p className="text-[12.5px] text-brand-inkFaint">{subtitle}</p>
        </div>
      </div>
      <Button variant="ghost" onClick={logout} className="px-4 py-2.5 text-[13px]">
        <LogOut size={15} /> Déconnexion
      </Button>
    </div>
  );
}
