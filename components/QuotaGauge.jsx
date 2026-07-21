"use client";
export default function QuotaGauge({ value, max }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = 46;
  const c = 2 * Math.PI * r;
  const color = value === 0 ? "#BE4141" : value <= 2 ? "#B8873A" : "#0E5A56";
  return (
    <div className="relative w-[118px] h-[118px]">
      <svg width={118} height={118} className="-rotate-90">
        <circle cx={59} cy={59} r={r} fill="none" stroke="#EFEAE0" strokeWidth={10} />
        <circle
          cx={59} cy={59} r={r} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - pct * c}
          style={{ transition: "stroke-dashoffset .6s ease, stroke .3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[26px] font-semibold text-brand-ink">{value}</span>
        <span className="text-[10.5px] text-brand-inkFaint tracking-wide uppercase">restants</span>
      </div>
    </div>
  );
}
