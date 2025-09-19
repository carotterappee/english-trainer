import type { EnglishVariant } from "./profile";

// mappages simples (tu pourras en ajouter)
const swaps: Record<EnglishVariant, Array<[from:string, to:string]>> = {
  british: [
    ["color","colour"], ["favorite","favourite"],
    ["elevator","lift"], ["apartment","flat"], ["cookie","biscuit"], ["fries","chips"],
  ],
  american: [
    ["colour","color"], ["favourite","favorite"],
    ["lift","elevator"], ["flat","apartment"], ["biscuit","cookie"], ["chips","fries"],
  ],
};

export function applyVariant(text: string, variant: EnglishVariant) {
  let out = text;
  for (const [from, to] of swaps[variant]) {
    out = out.replace(new RegExp(`\\b${from}\\b`, "gi"), to);
  }
  return out;
}
