"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsFab() {
  const pathname = usePathname();
  if (pathname === "/settings") return null; // pas sur la page réglages

  return (
    <Link
      href="/settings"
      aria-label="Ouvrir les réglages"
      className="fixed bottom-4 right-4 z-50 rounded-full border bg-white/90 backdrop-blur p-3 shadow-lg
                 hover:bg-indigo-50 transition"
      title="Réglages"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M19.4 15a7.9 7.9 0 0 0 .1-1 7.9 7.9 0 0 0-.1-1l2-1.5-2-3.4-2.3.9a7.8 7.8 0 0 0-1.7-1L13.5 3h-3L9.6 6a7.8 7.8 0 0 0-1.7 1L5.6 6.1l-2 3.4 2 1.5a7.9 7.9 0 0 0-.1 1 7.9 7.9 0 0 0 .1 1l-2 1.5 2 3.4 2.3-.9a7.8 7.8 0 0 0 1.7 1l.9 3h3l.9-3a7.8 7.8 0 0 0 1.7-1l2.3.9 2-3.4-2-1.5Z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
  );
}
