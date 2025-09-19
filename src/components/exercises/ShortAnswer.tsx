"use client";
import { useState } from "react";
import { keywordScore } from "@/lib/textUtils";

export type ShortAnswerProps = {
  q: string;
  keywords: string[];
  onScore: (s: number) => void; // 0..1
};

export default function ShortAnswer({ q, keywords, onScore }: ShortAnswerProps) {
  const [text, setText] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);

  const check = () => {
    const s = keywordScore(text, keywords);
    onScore(s);
    setMsg(s >= 0.6 ? "✅ Réponse satisfaisante" : "🟨 Presque : reformule ou précise");
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl border">
      <p className="font-medium">📝 {q}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écris ta réponse en anglais (1–2 phrases)"
        className="w-full rounded-xl border p-3 min-h-[88px]"
      />
      <button onClick={check} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">
        Vérifier
      </button>
      {msg && <p className="text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
