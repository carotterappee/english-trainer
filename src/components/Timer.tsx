"use client";
import { useEffect, useState } from "react";

export default function Timer({
  durationSec = 900,
  onElapsed,
}: { durationSec?: number; onElapsed: () => void }) {
  const [left, setLeft] = useState<number>(durationSec);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onElapsed();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onElapsed]);

  const mm = Math.floor(left / 60).toString().padStart(2, "0");
  const ss = (left % 60).toString().padStart(2, "0");
  const pct = Math.round(((durationSec - left) / durationSec) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="w-40 h-2 rounded-full bg-gray-200 overflow-hidden">
        <div className="h-2 bg-indigo-600" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium tabular-nums">{mm}:{ss}</span>
    </div>
  );
}
