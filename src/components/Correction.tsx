"use client";
export default function Correction({
  expected,
  user,
  notes = [],
  onRetry,
  onNext,
}: {
  expected: string;
  user: string;
  notes?: string[];
  onRetry: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-4 rounded-2xl border bg-white/85 backdrop-blur p-4 space-y-3">
      <div className="text-sm text-gray-600">Correction</div>
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
        <div className="text-emerald-900 font-medium">{expected}</div>
      </div>
      {user && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2">
          <div className="text-rose-900">{user}</div>
        </div>
      )}
      {notes.length > 0 && (
        <ul className="text-sm text-gray-700 list-disc pl-5">
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
      <div className="flex gap-2">
        <button onClick={onRetry} className="rounded-2xl border px-3 py-2 hover:bg-gray-50">Réessayer</button>
        <button onClick={onNext} className="rounded-2xl bg-indigo-600 text-white px-3 py-2">Phrase suivante ➜</button>
      </div>
    </div>
  );
}
