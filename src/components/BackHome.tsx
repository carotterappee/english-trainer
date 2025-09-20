"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BackHome({ label = "Accueil" }: { label?: string }) {
  const pathname = usePathname();
  if (pathname === "/") return null; // pas de bouton sur la home

  return (
    <Link
      href="/"
      className="fixed left-4 top-4 z-50 inline-flex items-center gap-2
                 rounded-2xl border bg-white/90 backdrop-blur px-3 py-2
                 shadow hover:bg-indigo-50 transition"
      aria-label="Revenir à l'accueil"
    >
      {/* icône flèche */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           className="-ml-1">
        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {label}
    </Link>
  );
}
