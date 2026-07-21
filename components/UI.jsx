"use client";
import { useState } from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";

export function Field({ label, hint, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-[12.5px] font-semibold tracking-wide text-brand-inkSoft mb-1.5 uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-brand-inkFaint mt-1">{hint}</span>}
    </label>
  );
}

const baseInput =
  "w-full box-border px-3.5 py-3 rounded-[10px] border-[1.5px] border-brand-line bg-white text-[15px] text-brand-ink outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-brand-tealSoft";

export function Input(props) {
  return <input {...props} className={`${baseInput} ${props.className || ""}`} />;
}

export function Textarea(props) {
  return <textarea {...props} className={`${baseInput} resize-y ${props.className || ""}`} />;
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${baseInput} cursor-pointer ${props.className || ""}`}>
      {children}
    </select>
  );
}

const variants = {
  primary: "bg-brand-teal text-white shadow-[0_4px_14px_rgba(14,90,86,0.25)]",
  gold: "bg-brand-gold text-white shadow-[0_4px_14px_rgba(184,135,58,0.3)]",
  ghost: "bg-transparent text-brand-teal border-[1.5px] border-brand-line",
  danger: "bg-brand-danger text-white",
  plum: "bg-brand-plum text-white",
  subtle: "bg-brand-bgAlt text-brand-ink",
};

export function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 font-display font-semibold text-[14.5px] px-5 py-3 rounded-[10px] tracking-wide transition active:scale-[0.97] disabled:opacity-55 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function StatusPill({ label, color, bg, icon: Icon }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-2.5 py-1.5 rounded-full"
      style={{ color, background: bg }}
    >
      <Icon size={13} /> {label}
    </span>
  );
}

export function Modal({ children, maxWidth = 420 }) {
  return (
    <div className="fixed inset-0 bg-[#1B2130]/55 backdrop-blur-[3px] flex items-center justify-center z-[1000] p-4">
      <div
        className="bg-white rounded-[18px] p-8 w-full shadow-[0_24px_60px_rgba(27,33,48,0.25)] animate-popIn"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  const Icon = isError ? XCircle : CheckCircle2;
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4.5 py-3 rounded-xl flex items-center gap-2.5 text-sm font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.12)] z-[999] animate-riseIn"
      style={{
        background: isError ? "#F8E7E5" : "#E4EFEC",
        color: isError ? "#BE4141" : "#0E5A56",
      }}
    >
      <Icon size={18} /> {toast.msg}
      <X size={14} className="cursor-pointer opacity-60 ml-1" onClick={onClose} />
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };
  return { toast, showToast, hideToast: () => setToast(null) };
}

export function fmt(n) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(Number(n) || 0));
}
