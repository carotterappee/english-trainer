"use client";
import React from "react";

/** Rend chaque mot cliquable, ignore la ponctuation.
 *  - text : la phrase source (EN ou FR)
 *  - selected : mot actuellement sélectionné
 *  - onSelect : callback quand on clique un mot
 */
export default function ClickableSentence({
  text,
  selected,
  onSelect,
}: {
  text: string;
  selected?: string | null;
  onSelect: (token: string) => void;
}) {
  // Découpe : [mots]|[ponctuation]|[espaces]
  const parts = React.useMemo(
    () => text.match(/[\p{Letter}’']+|[^\s\p{Letter}]+|\s+/gu) || [text],
    [text]
  );

  const isWord = (tok: string) => /[\p{Letter}]/u.test(tok);

  return (
    <p className="leading-8 text-lg">
      {parts.map((tok, i) => {
        if (/\s+/.test(tok)) {
          return <span key={i}>{tok}</span>;
        }
        if (isWord(tok)) {
          const active = selected && tok === selected;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(tok)}
              className={`inline rounded-xl px-1.5 -mx-0.5 transition
                ${active ? "bg-indigo-600 text-white" : "hover:bg-indigo-50"}`}
              title="Cliquer pour traduire"
            >
              {tok}
            </button>
          );
        }
        // Ponctuation : non cliquable
        return <span key={i}>{tok}</span>;
      })}
    </p>
  );
}
