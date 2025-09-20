import * as React from "react";
import type { ReactElement } from "react";

export type PixelCfg = {
  size?: number;                 // taille finale en px
  skin: "light" | "tan" | "brown" | "dark";
  hairStyle: "long" | "bun" | "short";
  hairColor: "black" | "brown" | "blonde" | "red";
  top: "sweater" | "hoodie" | "tshirt";
  topColor: "pink" | "blue" | "green" | "purple";
  bottom: "shorts" | "skirt" | "pants";
  glasses?: boolean;
  scarf?: boolean;
};

const PAL = {
  skin: {
    light:  "#FFE0C6",
    tan:    "#F1C27D",
    brown:  "#D1A374",
    dark:   "#916A4A",
  },
  hair: {
    black:  "#2B2B2B",
    brown:  "#5B3A29",
    blonde: "#D6A64B",
    red:    "#B5462D",
  },
  top: {
    pink:   "#FF8BC8",
    blue:   "#4C6EF5",
    green:  "#2FB36A",
    purple: "#7C4DFF",
  },
  gray:    "#8C8C8C",
  white:   "#FFFFFF",
  sock:    "#F8F8F8",
  shoe:    "#333333",
  outline: "#1C1C1C",
};

// util : rend une grille 24x24 depuis une matrice de codes
type Cell = "." | "O" | "S" | "H" | "T" | "B" | "K" | "G" | "F"; 
// . vide, O contour, S peau, H cheveux, T top (haut), B bottom (bas),
// K chaussettes, G lunettes, F écharpe

function renderGrid(mat: string[], cfg: PixelCfg) {
  const px = (cfg.size ?? 240) / 24;
  const skin = PAL.skin[cfg.skin];
  const hair = PAL.hair[cfg.hairColor];
  const top  = PAL.top[cfg.topColor];
  const bottomColor = "#A0C4FF"; // couleur soft générique pour bas (short/jupe/pantalon)

  const fillFor = (c: Cell) => {
    if (c === "O") return PAL.outline;
    if (c === "S") return skin;
    if (c === "H") return hair;
    if (c === "T") return top;
    if (c === "B") return bottomColor;
    if (c === "K") return PAL.sock;
    if (c === "G") return PAL.gray;
    if (c === "F") return "#FFE6AA";
    return "transparent";
  };

  const rects: ReactElement[] = [];
  mat.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch !== ".") {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x * px}
            y={y * px}
            width={px}
            height={px}
            fill={fillFor(ch as Cell)}
          />
        );
      }
    });
  });
  return (
    <svg
      width={cfg.size ?? 240}
      height={cfg.size ?? 240}
      viewBox={`0 0 ${cfg.size ?? 240} ${cfg.size ?? 240}`}
      style={{ imageRendering: "pixelated" } as React.CSSProperties}
      role="img"
      aria-label="Pixel avatar"
    >
      {rects}
    </svg>
  );
}

// matrices de base (24 colonnes × 24 lignes)
// Corps + visage (sans cheveux, sans habits)
const BASE: string[] = [
  "........................",
  ".........OOOOOO.........",
  ".......OOOSSSSOO........",
  "......OOSSSSSSSOO.......",
  "......OSSSSSSSSSO.......",
  ".....OSSSSSSSSSSSO......",
  ".....OSSSSOSS SSSO......".replace(" ","S"),
  ".....OSSSSSSSSSSSO......",
  "......OSSSSSSSSSO.......",
  ".......OOSSSSSOO........",
  ".........OOOOOO.........",
  ".........SS..SS.........",
  ".........SS..SS.........",
  "..........S..S..........",
  ".........S....S.........",  
  "........S......S........",
  "........SSSSSSSS........",
  "........SSSSSSSS........",
  ".......K SSSSSS K.......".replace(/ /g,"K"),
  ".......K SSSSSS K.......".replace(/ /g,"K"),
  "........  BBBB  ........".replace(/ /g,"."),
  "........  BBBB  ........".replace(/ /g,"."),
  "........  K  K  ........",
  "........  K  K  ........",
];

// Cheveux : 3 styles
const HAIR_LONG = [
  "......HHHHHHHHHH........",
  ".....HHHHHHHHHHHH.......",
  "....HHHHHHHHHHHHHH......",
  "...HHHHHHHHHHHHHHHH.....",
  "...HHHHHHHHHHHHHHHH.....",
  "...HHHHHHHHHHHHHHHH.....",
  "....HHHHHHHHHHHHHH......",
  ".....HHHHHHHHHHHH.......",
  "......HHHHHHHHHH........",
];

const HAIR_BUN = [
  ".........HHHH...........",
  "........HHHHHH..........",
  ".........HHHH...........",
  "........................",
  "......HHHHHHHHHHH.......",
  ".....HHHHHHHHHHHHH......",
];

const HAIR_SHORT = [
  "......HHHHHHHHHH........",
  ".....HHHHHHHHHHHH.......",
  "....HHHHHHHHHHHHHH......",
  "...HHHHHHHHHHHHHHHH.....",
  "....HHHHHHHHHHHHHH......",
];

// Hauts (sweater/hoodie/tshirt)
const TOP_SWEATER = [
  ".....TTTTTTTTTTTT.......",
  "....TTTTTTTTTTTTTT......",
  "....TTTTTTTTTTTTTT......",
  "....TTTTTTTTTTTTTT......",
  "....TTTTTTTTTTTTTT......",
  ".....TTTTTTTTTTTT.......",
];

const TOP_HOODIE = [
  "....TTTTTTTTTTTTTT......",
  "....TTTTTTTTTTTTTT......",
  "....TTTTTTTTTTTTTT......",
  "...TTTTTTTTTTTTTTTT.....",
  "...TTT TTTTTT TTTT.....".replace(/ /g,"."),
  "....TTTTTTTTTTTTTT......",
];

const TOP_TSHIRT = [
  ".....TTTTTTTTTTTT.......",
  ".....TTTTTTTTTTTT.......",
  ".....TTTTTTTTTTTT.......",
  ".....TTTTTTTTTTTT.......",
  ".....TTTTTTTTTTTT.......",
  ".....TTTTTTTTTTTT.......",
];

// Bas (short/skirt/pants)
const BOTTOM_SHORTS = [
  "........  BBBB  ........".replace(/ /g,"."),
  "........  BBBB  ........".replace(/ /g,"."),
  "........  BBBB  ........".replace(/ /g,"."),
  "........  ....  ........",
];

const BOTTOM_SKIRT = [
  "........  BBBB  ........".replace(/ /g,"."),
  "........ BBBBBB ........",
  "........BBBBBBBB........",
  "........BBBBBBBB........",
];

const BOTTOM_PANTS = [
  "........  BBBB  ........".replace(/ /g,"."),
  "........  BBBB  ........".replace(/ /g,"."),
  "........  BBBB  ........".replace(/ /g,"."),
  "........  BBBB  ........".replace(/ /g,"."),
];

// Lunettes & écharpe (simples overlays)
const GLASSES = [
  ".........GG..GG.........",
  ".........GG..GG.........",
  "..........GGGG..........",
];
const SCARF = [
  "........FFFFFFFF........",
  "........FFFFFFFF........",
  ".........FFFFF..........",
];

function merge(base: string[], overlay: string[], yStart: number) {
  const out = base.slice();
  for (let y = 0; y < overlay.length; y++) {
    const row = overlay[y];
    const yy = yStart + y;
    if (yy < 0 || yy >= out.length) continue;
    const baseRow = out[yy].split("");
    for (let x = 0; x < Math.min(24, row.length); x++) {
      if (row[x] !== ".") baseRow[x] = row[x];
    }
    out[yy] = baseRow.join("");
  }
  return out;
}

export default function PixelAvatar(cfg: PixelCfg) {
  let mat = BASE;

  // cheveux (au-dessus du crâne)
  if (cfg.hairStyle === "long")  mat = merge(mat, HAIR_LONG, 2);
  if (cfg.hairStyle === "bun")   mat = merge(mat, HAIR_BUN, 0);
  if (cfg.hairStyle === "short") mat = merge(mat, HAIR_SHORT, 2);

  // haut
  const top = cfg.top === "hoodie" ? TOP_HOODIE : cfg.top === "tshirt" ? TOP_TSHIRT : TOP_SWEATER;
  mat = merge(mat, top, 16);

  // bas
  const bot = cfg.bottom === "skirt" ? BOTTOM_SKIRT : cfg.bottom === "pants" ? BOTTOM_PANTS : BOTTOM_SHORTS;
  mat = merge(mat, bot, 20);

  // accessoires
  if (cfg.glasses) mat = merge(mat, GLASSES, 11);
  if (cfg.scarf)   mat = merge(mat, SCARF, 15);

  return renderGrid(mat, cfg);
}
