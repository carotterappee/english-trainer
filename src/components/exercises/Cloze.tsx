"use client";
import { useState } from "react";
import { normalize } from "@/lib/textUtils";

export type ClozeProps = {
  text: string;              // utiliser "___" pour chaque trou
  answers: string[];         // réponses attendues (ordre)
  onScore: (s: number) => void; // 0..1
};

export default function Cloze({ text, answers, onScore }: ClozeProps) {
  const [inputs, setInputs] = useState<string[]>(Array(answers.length).fill(""));
  const parts = text.split("___");

  const check = () => {
    const hits = answers.reduce(
      (acc: number, ans: string, i: number) => acc + (normalize(inputs[i]) === normalize(ans) ? 1 : 0),
      0
    );
    onScore(hits / Math.max(1, answers.length));
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl border">
      <p className="font-medium">✍️ Complète les blancs</p>
      <p className="leading-7">
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < answers.length && (
              <input
                className="mx-2 px-2 py-1 rounded-md border"
                placeholder={`mot ${i + 1}`}
                value={inputs[i]}
                onChange={(e) => {
                  const cp = [...inputs];
                  cp[i] = e.target.value;
                  setInputs(cp);
                }}
              />
            )}
          </span>
        ))}
      </p>
      <button onClick={check} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">
        Vérifier
      </button>
    </div>
  );
}
