"use client";
import { useState } from "react";

export type McqProps = {
  q: string;
  choices: string[];
  answer: number;            // index correct
  onScore: (s: number) => void; // 0..1
};

export default function Mcq({ q, choices, answer, onScore }: McqProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const handlePick = (i: number) => {
    setPicked(i);
    onScore(i === answer ? 1 : 0);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl border">
      <p className="font-medium">🧐 {q}</p>
      <div className="grid gap-2">
        {choices.map((c, i) => (
          <button
            key={i}
            onClick={() => handlePick(i)}
            className={`text-left px-4 py-2 rounded-xl border hover:bg-indigo-50 ${
              picked === i ? (i === answer ? "border-green-500" : "border-rose-400") : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
