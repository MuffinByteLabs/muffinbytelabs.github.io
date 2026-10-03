import { MML01 } from "./layoutMML01";
import { splitLayers } from "./layerGeometry";

/* ════════════════════════════════════════════════════════════════════════
   The seven plates of the exploded layer stack, as standalone SVG files.

   These used to be inline <svg> in the homepage, which put ~70 KB of path
   data into the HTML and the same again into React's payload. As files
   (written at build time by src/app/layers/[plate]/route.ts) they cost the
   page one <img> tag each, load lazily, and stay in the browser cache.

   An SVG used as an image cannot reach the page's fonts or overflow its
   own viewBox, so the silk uses a system sans, and the viewBox carries a
   margin for the RF module's antenna, which overhangs the top edge.
   ════════════════════════════════════════════════════════════════════════ */

const L = splitLayers(MML01);
const { w: W, h: H } = MML01;

/** the margin around the board edge in every plate, in mm */
export const PLATE_PAD = { x: 2, top: 8, bottom: 2 };
const VB = `${-PLATE_PAD.x} ${-PLATE_PAD.top} ${W + PLATE_PAD.x * 2} ${H + PLATE_PAD.top + PLATE_PAD.bottom}`;

const SHEET = `fill="rgba(255,255,255,0.025)" stroke="rgba(244,239,230,0.24)" stroke-width="0.2"`;
const COPPER = "#d9955a";
const COPPER_DEEP = "#c27f48";
const SILK = "#efe9dc";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const traces = (runs: { w: number; d: string }[], color: string) =>
  runs
    .map((t) => `<path d="${t.d}" stroke="${color}" stroke-width="${t.w}" stroke-linecap="round" fill="none"/>`)
    .join("");

const plane = (id: string) =>
  `<defs><mask id="${id}"><path d="${L.outline}" fill="#fff"/><path d="${L.planeVoids}" fill="#000"/></mask></defs>` +
  `<path d="${L.outline}" ${SHEET}/>` +
  `<path d="${L.outline}" fill="${COPPER}" fill-opacity="0.4" mask="url(#${id})"/>`;

/* bottom of the stack first: index 0 sits lowest */
export const PLATES: { key: string; name: string; file: string; art: string }[] = [
  {
    key: "drill",
    name: "Drill",
    file: "DRL",
    art: `<path d="${L.outline}" ${SHEET}/><path d="${L.drills}" fill="#f1e9da"/>`,
  },
  {
    key: "bottom",
    name: "Bottom copper",
    file: "GBL",
    art:
      `<path d="${L.outline}" ${SHEET}/>` +
      traces(L.tracesBottom, COPPER_DEEP) +
      `<path d="${L.vias}" fill="${COPPER_DEEP}"/><path d="${L.ringsTH}" fill="${COPPER_DEEP}"/>`,
  },
  { key: "l3", name: "Ground plane L3", file: "G2", art: plane("plane") },
  { key: "l2", name: "Ground plane L2", file: "G1", art: plane("plane") },
  {
    key: "top",
    name: "Top copper",
    file: "GTL",
    art:
      `<path d="${L.outline}" ${SHEET}/>` +
      traces(L.tracesTop, COPPER) +
      `<path d="${L.padsTop}" fill="#e8b273"/><path d="${L.ringsTH}" fill="#e8b273"/><path d="${L.vias}" fill="${COPPER}"/>`,
  },
  {
    key: "mask",
    name: "Solder mask",
    file: "GTS",
    art:
      `<defs><mask id="open"><path d="${L.outline}" fill="#fff"/><path d="${L.maskOpenings}" fill="#000"/></mask></defs>` +
      `<path d="${L.outline}" fill="#1d7442" fill-opacity="0.62" mask="url(#open)"/>` +
      `<path d="${L.outline}" fill="none" stroke="rgba(120,220,160,0.35)" stroke-width="0.2"/>`,
  },
  {
    key: "silk",
    name: "Silkscreen",
    file: "GTO",
    art:
      `<path d="${L.outline}" fill="none" stroke="rgba(244,239,230,0.16)" stroke-width="0.2"/>` +
      `<path d="${L.silkBodies}" fill="none" stroke="${SILK}" stroke-width="0.15"/>` +
      `<g fill="${SILK}" font-family="Helvetica, Arial, sans-serif">` +
      L.silkText
        .map(
          (t) =>
            `<text x="${t.x}" y="${t.y}" font-size="${t.size}"` +
            (t.anchor ? ` text-anchor="${t.anchor}"` : "") +
            (t.rot ? ` transform="rotate(${t.rot} ${t.x} ${t.y})"` : "") +
            `>${esc(t.text)}</text>`
        )
        .join("") +
      `</g>`,
  },
];

/** where each plate is published */
export const plateUrl = (key: string) => `/layers/pcb1-${key}.svg`;

export function plateSvg(key: string): string | null {
  const p = PLATES.find((x) => x.key === key);
  if (!p) return null;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}">${p.art}</svg>`;
}
