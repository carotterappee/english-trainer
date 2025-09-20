"use client";
import { ChangeEvent } from "react";

export type Option = { value: string; label: string; emoji?: string };

export default function PrettySelect({
  label, value, onChange, options, id, hint,
}: {
  id: string;
  label: string;
  value: string;
  options: Option[];
  hint?: string;
  onChange: (v: string) => void;
}) {
  const handle = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value);
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={handle}
          className="w-full appearance-none rounded-2xl border bg-white/90 backdrop-blur px-4 py-2 pr-10
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.emoji ? `${o.emoji} ` : ""}{o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {/* chevron */}
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
      </div>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
