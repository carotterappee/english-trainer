"use client";
import { useEffect, useState } from "react";


export default function Timer({
  durationSec = 900,
  initialLeft,
  onTick,
  onElapsed,
}: {
  durationSec?: number;
  initialLeft?: number;
  onTick?: (left: number) => void;
  onElapsed: () => void;
}) {
  const [left, setLeft] = useState<number>(initialLeft ?? durationSec);

  useEffect(() => {
    if (typeof initialLeft === "number") setLeft(initialLeft);
  }, [initialLeft]);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => {
        const n = s - 1;
        if (onTick) onTick(Math.max(0, n));
        if (n <= 0) {
          clearInterval(id);
          onElapsed();
          return 0;
        }
        return n;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onTick, onElapsed]);

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
