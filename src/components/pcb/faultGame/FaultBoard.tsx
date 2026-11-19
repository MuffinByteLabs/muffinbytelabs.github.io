"use client";

import { memo, useId, type Ref } from "react";
import { FAULT_BY_ID, type FaultId } from "./faults";

/* ════════════════════════════════════════════════════════════════════════
   The practice board: a small USB-powered microcontroller board, drawn as
   a layout view (copper, pour, pads, silkscreen) in the site's board
   palette.

   Every fault area is drawn both ways and `active` picks which: a fault
   that is off for this round is drawn correctly, so the board always looks
   like a finished design with exactly ROUND_SIZE things wrong with it.

   The copper is described as data (traces, pads, vias) so the ground pour
   can be cut around it: each item that isn't ground is drawn again into
   the pour's mask, fattened by the clearance, which leaves the thin gap a
   real fill has around every trace and pad. Ground stubs and vias are left
   out of the mask, so they merge into the pour, and the ground pins that
   sit in it get thermal spokes.

   Coordinates are board units on a 640 × 400 sheet; faults.ts uses the
   same units for its hit areas. On a narrow screen the whole drawing is
   turned a quarter-turn clockwise (portrait), which makes it about 60%
   larger on a phone. The inner <g> carries that turn, and FaultGame maps
   clicks through that <g>, so the hit areas never need to know.
   ════════════════════════════════════════════════════════════════════════ */

export const BOARD_W = 640;
export const BOARD_H = 400;

/* the site's board palette (PCB in pcbData.ts), repeated here so this
   lazily loaded file doesn't pull in the homepage's data module */
const MASK_HI = "#2b1c42";
const MASK = "#1f1430";
const MASK_LO = "#100a1c";
/* opaque, so the joints between trace segments don't show as darker or
   lighter dots where two strokes overlap */
const COPPER = "#c27c4b";
/* the ground pour: the same copper, seen dimmed under the soldermask */
const POUR = "rgba(200, 129, 76, 0.17)";
const BOTTOM = "#5ec8e5";
const SILK = "#eae6da";
const DRILL = "#0b0714";
const GOLD = "#f1c978";
const RED = "#f07167";
const INK = "#1b1407";

/** copper-to-pour clearance, in board units */
const CLR = 3.2;
/** the pour stays a little way back from the board edge */
const POUR_BOX = { x: 27, y: 27, w: 586, h: 346, r: 12 };

type P = [number, number];
type Anchor = "start" | "middle" | "end";
/** a top-layer trace; `gnd` ones merge into the pour instead of being cleared */
type Seg = { pts: P[]; w: number; gnd?: boolean };
/** a surface pad, by its centre */
type Smd = { x: number; y: number; w: number; h: number; r?: number };
/** a plated through-hole pad; `spokes` = ground, tied into the pour */
type Th = { x: number; y: number; r: number; drill: number; square?: boolean; spokes?: boolean };
type ViaT = { x: number; y: number; gnd?: boolean; small?: boolean };
/** a two-pad 0603 part, horizontal or vertical (`v`) */
type Chip = { x: number; y: number; v?: boolean; label: string; lx: number; ly: number; anchor?: Anchor };

const d = (...pts: P[]) => "M" + pts.map(([x, y]) => `${x} ${y}`).join(" L");

function chipPads(c: Chip): Smd[] {
  return c.v
    ? [
        { x: c.x, y: c.y - 8, w: 10, h: 8 },
        { x: c.x, y: c.y + 8, w: 10, h: 8 },
      ]
    : [
        { x: c.x - 8, y: c.y, w: 8, h: 10 },
        { x: c.x + 8, y: c.y, w: 8, h: 10 },
      ];
}

/* ── small drawing pieces ─────────────────────────────────────────────── */
function Label({ x, y, children, size = 8.5, anchor = "middle", dim = false }: { x: number; y: number; children: string; size?: number; anchor?: Anchor; dim?: boolean }) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} fill={SILK} fillOpacity={dim ? 0.62 : 0.9} letterSpacing={0.4}>
      {children}
    </text>
  );
}

/* the maker's mark, in silkscreen: a muffin */
function Muffin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={SILK} strokeOpacity={0.78} strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round">
      <path d="M-9 1 L-6.5 12 H6.5 L9 1" />
      <path d="M-3 1.5 L-2.3 12 M3 1.5 L2.3 12" />
      <path d="M-10.5 1 C-12 -4 -8 -7.5 -4.5 -6.5 C-3.5 -11 3.5 -11 4.5 -6.5 C8 -7.5 12 -4 10.5 1 Z" />
      <circle cx={0} cy={-12.6} r={2} />
    </g>
  );
}

/* ── the game's marks, drawn over the board ───────────────────────────── */
function Ring({ id, n, missed, portrait }: { id: FaultId; n: number; missed: boolean; portrait: boolean }) {
  const { x, y, r } = FAULT_BY_ID[id].mark;
  const color = missed ? RED : GOLD;
  const bx = x + r * 0.72;
  const by = y - r * 0.72;
  return (
    <g className={missed ? "ftg-ring ftg-ring-missed" : "ftg-ring"}>
      <circle cx={x} cy={y} r={r} fill="none" stroke="#0d0c0b" strokeOpacity={0.55} strokeWidth={5} />
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={missed ? "rgba(240,113,103,0.08)" : "rgba(241,201,120,0.1)"}
        stroke={color}
        strokeWidth={2.2}
        strokeDasharray={missed ? "5 4" : undefined}
      />
      {/* the badge's number stays upright when the board is turned */}
      <g transform={`translate(${bx} ${by})${portrait ? " rotate(-90)" : ""}`}>
        <circle r={8.5} fill={color} stroke="#0d0c0b" strokeWidth={1.5} />
        <text y={3.6} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={INK}>
          {n}
        </text>
      </g>
    </g>
  );
}

function MissMark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ftg-miss">
        <circle r={9} fill="rgba(240,113,103,0.14)" />
        <path d="M-4.5 -4.5 L4.5 4.5 M4.5 -4.5 L-4.5 4.5" stroke={RED} strokeWidth={2.2} strokeLinecap="round" />
      </g>
    </g>
  );
}

function Probe({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={12} fill="none" stroke="#0d0c0b" strokeOpacity={0.6} strokeWidth={4} />
      <circle r={12} fill="none" stroke="#ffffff" strokeWidth={1.6} />
      <path d="M-19 0 H-8 M8 0 H19 M0 -19 V-8 M0 8 V19" stroke="#ffffff" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

/* ── the board ────────────────────────────────────────────────────────── */
type Props = {
  active: readonly FaultId[];
  found: readonly FaultId[];
  /** faults not found, ringed in red once the round is over */
  missed: readonly FaultId[];
  misses: readonly { key: number; x: number; y: number }[];
  probe: { x: number; y: number } | null;
  portrait: boolean;
  innerRef: Ref<SVGGElement>;
  /** a crop of the board, as a viewBox in board units (landscape only) */
  view?: string;
};

function FaultBoard({ active, found, missed, misses, probe, portrait, innerRef, view }: Props) {
  /* ids for the gradients, mask and filter, unique to this board, so two
     boards on one page can never borrow each other's pour */
  const uid = "ftg" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const on = (id: FaultId) => active.includes(id);

  /* the USB connector slides inward when it is the fault */
  const dx = on("setback") ? 46 : 0;
  const c3: P = on("farcap") ? [246, 318] : [334.5, 262];
  const c9: P = on("overlap") ? [194, 309] : [190, 329];

  const chips: Chip[] = [
    { x: 90, y: 65, label: "C8", lx: 90, ly: 54 },
    { x: 176, y: 128, label: "C7", lx: 176, ly: 117 },
    { x: 352.5, y: 134, label: "C1", lx: 378, ly: 122 },
    { x: 398, y: 176, v: true, label: "C2", lx: 412, ly: 172, anchor: "start" },
    { x: c3[0], y: c3[1], label: "C3", lx: c3[0], ly: on("farcap") ? 305 : 281 },
    { x: 230, y: 153.5, label: "C5", lx: 230, ly: 143 },
    { x: 230, y: 177.5, label: "C6", lx: 230, ly: 195 },
    { x: 272, y: 105, label: "D1", lx: 272, ly: 93 },
    { x: 232, y: 105, label: "R1", lx: on("silk") ? 224 : 232, ly: on("silk") ? 108 : 93 },
    { x: 490, y: 108, v: true, label: "R2", lx: 480, ly: 111, anchor: "end" },
    { x: 520, y: 108, v: true, label: "R3", lx: 530, ly: 111, anchor: "start" },
    { x: 190, y: 301, label: "R4", lx: 190, ly: 291 },
    { x: c9[0], y: c9[1], label: "C9", lx: 166, ly: on("overlap") ? 318 : 332 },
  ];

  /* ── top copper ─────────────────────────────────────────────────────── */
  const segs: Seg[] = [
    // VBUS: USB-C to the regulator, the widest trace on the board
    { pts: [[60 + dx, 186], [136, 186], [148, 174], [148, 162]], w: 9 },
    { pts: [[148, 162], [148, 136]], w: on("neck") ? 2.4 : 9 },
    { pts: [[148, 136], [148, 120]], w: 9 },
    { pts: [[148, 128], [164, 128]], w: 5 },
    // 3V3: regulator tab across the top to the header, and its branches
    { pts: [[98, 65], [112, 65]], w: 6 },
    { pts: [[156, 65], [548, 65], [585, 102], [585, 113.5]], w: 6 },
    { pts: [[344.5, 65], [344.5, 129]], w: 5 },
    { pts: [[344.5, 154.5], [344.5, 139]], w: 4 },
    { pts: [[410, 65], [410, 95]], w: 3 },
    { pts: [[224, 105], [214.5, 105]], w: 3 },
    { pts: [[385.5, 168.5], [398, 168.5]], w: 4 },
    { pts: [[398, 158.5], [398, 164]], w: 4 },
    { pts: [[490, 65], [490, 96]], w: 4 },
    { pts: [[520, 65], [520, 96]], w: 4 },
    { pts: [[198, 301], [207.5, 301]], w: 4 },
    // status LED
    { pts: [[317.5, 154.5], [317.5, 118], [304.5, 105], [280, 105]], w: 3 },
    { pts: [[264, 105], [240, 105]], w: 3 },
    // crystal and its load caps
    { pts: [[262, 153.5], [284, 153.5], [284, 168.5], [294.5, 168.5]], w: 3 },
    { pts: [[262, 177.5], [294.5, 177.5]], w: 3 },
    { pts: [[238, 153.5], [262, 153.5]], w: 3 },
    { pts: [[238, 177.5], [262, 177.5]], w: 3 },
    // USB D− / D+
    { pts: [[60 + dx, 204.5], [294.5, 204.5]], w: 3.5 },
    {
      pts: on("split")
        ? [[60 + dx, 213.5], [178, 213.5], [196, 231.5], [232, 231.5], [250, 213.5], [294.5, 213.5]]
        : [[60 + dx, 213.5], [294.5, 213.5]],
      w: 3.5,
    },
    // I²C to the header, with R2/R3 pull-ups from the 3V3 rail
    { pts: [[385.5, 195.5], [420, 195.5], [468, 147.5], [576, 147.5]], w: 3.5 },
    {
      pts: on("pinch")
        ? [[385.5, 204.5], [398, 204.5], [402.6, 199.9], [411.4, 199.9], [416, 204.5], [423.7, 204.5], [455.7, 172.5], [576, 172.5]]
        : [[385.5, 204.5], [423.7, 204.5], [455.7, 172.5], [576, 172.5]],
      w: 3.5,
    },
    { pts: [[490, 120], [490, 147.5]], w: 4 },
    ...(on("airwire")
      ? []
      : [
          { pts: [[520, 120], [520, 125.5]] as P[], w: 4 },
          { pts: [[520, 164.5], [520, 172.5]] as P[], w: 4 },
        ]),
    // UART
    { pts: [[385.5, 222.5], [576, 222.5]], w: 3.5 },
    { pts: [[385.5, 231.5], [450, 231.5], [466, 247.5], [576, 247.5]], w: 3.5 },
    // C3, the bottom supply pin's decoupling cap
    ...(on("farcap")
      ? [{ pts: [[326.5, 245.5], [326.5, 282], [298, 310], [262, 310], [254, 318]] as P[], w: 2.5 }]
      : [
          { pts: [[326.5, 245.5], [326.5, 257]] as P[], w: 4 },
          { pts: [[322.5, 262], [316.5, 262]] as P[], w: 4 },
        ]),
    // the button: S1 to its pull-up R4, then the long run to U1
    { pts: [[146, 301], [182, 301]], w: 3.5 },
    {
      pts: on("edge")
        ? [[182, 301], [182, 362], [197, 377], [356.5, 377], [371.5, 362], [371.5, 245.5]]
        : [[182, 301], [182, 340], [190, 348], [363.5, 348], [371.5, 340], [371.5, 245.5]],
      w: 3.5,
    },
    // ground stubs: pads to their vias, part of the pour's net
    { pts: [[78, 65], [72.5, 65]], w: 4, gnd: true },
    { pts: [[188, 128], [193.5, 128]], w: 4, gnd: true },
    { pts: [[120, 120], [120, 129.5]], w: 4, gnd: true },
    { pts: [[364.5, 134], [369.5, 134]], w: 4, gnd: true },
    { pts: [[222, 153.5], [212.5, 153.5]], w: 4, gnd: true },
    { pts: [[222, 177.5], [212.5, 177.5]], w: 4, gnd: true },
    { pts: [[60 + dx, 224], [71.5 + dx, 224]], w: 4, gnd: true },
    { pts: [[403, 184], [409.5, 184]], w: 4, gnd: true },
    { pts: [[576, 197.5], [564.5, 197.5]], w: 4, gnd: true },
    { pts: [[92, 301], [86, 301], [86, 329], [92, 329]], w: 3.5, gnd: true },
    { pts: [[86, 315], [82.5, 315]], w: 4, gnd: true },
    on("farcap") ? { pts: [[234, 318], [228.5, 318]], w: 4, gnd: true } : { pts: [[346.5, 262], [351.5, 262]], w: 4, gnd: true },
    ...(on("overlap") ? [] : [{ pts: [[198, 329], [207.5, 329]] as P[], w: 4, gnd: true }]),
  ];

  /* ── pads ───────────────────────────────────────────────────────────── */
  const qfn = Array.from({ length: 8 }, (_, i) => 308.5 + 9 * i);
  const qfnSide = Array.from({ length: 8 }, (_, i) => 168.5 + 9 * i);

  const smds: Smd[] = [
    // J1, USB-C: four signal pads
    { x: 60 + dx, y: 186, w: 10, h: 8 },
    { x: 60 + dx, y: 204.5, w: 10, h: 5 },
    { x: 60 + dx, y: 213.5, w: 10, h: 5 },
    { x: 60 + dx, y: 224, w: 10, h: 8 },
    // U2, the regulator: tab and three pins
    { x: 134, y: 65, w: 44, h: 18, r: 1.5 },
    { x: 120, y: 113, w: 9, h: 14 },
    { x: 134, y: 113, w: 9, h: 14 },
    { x: 148, y: 113, w: 9, h: 14 },
    // U1: 8 pads a side around an exposed ground pad
    ...qfn.flatMap((x) => [
      { x, y: 160, w: 4.5, h: 11, r: 0.8 },
      { x, y: 240, w: 4.5, h: 11, r: 0.8 },
    ]),
    ...qfnSide.flatMap((y) => [
      { x: 300, y, w: 11, h: 4.5, r: 0.8 },
      { x: 380, y, w: 11, h: 4.5, r: 0.8 },
    ]),
    { x: 340, y: 200, w: 40, h: 40, r: 2 },
    // Y1, the crystal
    { x: 262, y: 153.5, w: 14, h: 9 },
    { x: 262, y: 177.5, w: 14, h: 9 },
    ...chips.flatMap(chipPads),
    // S1, the button
    { x: 98, y: 301, w: 12, h: 8 },
    { x: 146, y: 301, w: 12, h: 8 },
    { x: 98, y: 329, w: 12, h: 8 },
    { x: 146, y: 329, w: 12, h: 8 },
    // test points: TP1 on 3V3, TP2 on ground
    { x: 410, y: 100, w: 10, h: 10, r: 5 },
    { x: 440, y: 100, w: 10, h: 10, r: 5 },
  ];

  const headerPins = ["3V3", "SDA", "SCL", "GND", "TX", "RX"];
  const holes: Th[] = [
    ...headerPins.map((name, i) => ({ x: 585, y: 122.5 + 25 * i, r: 9, drill: 4, square: i === 0, spokes: name === "GND" })),
    ...[[46, 46], [594, 46], [46, 354], [594, 354]].map(([x, y]) => ({ x, y, r: 10, drill: 5.5, spokes: true })),
  ];

  /* ── vias ───────────────────────────────────────────────────────────── */
  const mountStitch: P[] = [[46, 46], [594, 46], [46, 354], [594, 354]].flatMap(([cx, cy]) =>
    Array.from({ length: 8 }, (_, k) => {
      const a = ((22.5 + 45 * k) * Math.PI) / 180;
      return [Math.round((cx + 16.5 * Math.cos(a)) * 10) / 10, Math.round((cy + 16.5 * Math.sin(a)) * 10) / 10] as P;
    })
  );
  const stitch: P[] = [
    ...mountStitch,
    // a row along the top edge, a few down the left, a few along the bottom
    ...Array.from({ length: 14 }, (_, i) => [84 + 36 * i, 36] as P),
    ...[96, 120, 144, 256, 280, 304].map((y) => [34, y] as P),
    ...[100, 136, 400, 436, 472, 508, 544].map((x) => [x, 364] as P),
    // ground under the crystal, and in the pockets the signals fence off
    [262, 165.5],
    [505, 84],
    [556, 128],
    [520, 235],
  ];

  const vias: ViaT[] = [
    // ground
    ...(
      [
        [68, 65],
        [198, 128],
        [120, 134],
        [374, 134],
        [208, 153.5],
        [208, 177.5],
        [76 + dx, 224],
        [414, 184],
        [560, 197.5],
        [78, 315],
        on("farcap") ? [224, 318] : [356, 262],
        ...(on("overlap") ? [] : [[212, 329]]),
        /* a via dropped into the USB pair's path, which D+ detours around */
        ...(on("split") ? [[214, 213.5]] : []),
      ] as P[]
    ).map(([x, y]) => ({ x, y, gnd: true })),
    // 3V3
    ...([[210, 105], [398, 154], [212, 301], ...(on("farcap") ? [] : [[312, 262]])] as P[]).map(([x, y]) => ({ x, y })),
    // R3's jump under SDA to SCL
    ...(on("airwire") ? [] : ([[520, 130], [520, 160]] as P[]).map(([x, y]) => ({ x, y }))),
    ...stitch.map(([x, y]) => ({ x, y, gnd: true, small: true })),
  ];

  /* where the pour may not go: under U1, under the USB-C body, at the fiducials */
  const keepouts = [
    { x: 287, y: 147, w: 106, h: 106 },
    { x: 14 + dx, y: 170, w: 40, h: 60 },
  ];
  const fiducials: P[] = [[596, 296], [64, 262]];

  /* thermal spokes: the ground pins that sit in the pour */
  const spokes: { x: number; y: number; len: number; dirs: P[] }[] = [
    { x: 440, y: 100, len: 5 + CLR + 1.8, dirs: [[1, 0], [-1, 0], [0, 1], [0, -1]] },
    ...holes.filter((h) => h.spokes).map((h) => ({
      x: h.x,
      y: h.y,
      len: h.r + CLR + 1.8,
      dirs: (h.r === 9 ? [[1, 0], [-1, 0]] : [[1, 0], [-1, 0], [0, 1], [0, -1]]) as P[],
    })),
  ];

  return (
    <svg
      viewBox={portrait ? `0 0 ${BOARD_H} ${BOARD_W}` : (view ?? `0 0 ${BOARD_W} ${BOARD_H}`)}
      className="ftg-svg"
      aria-hidden
      style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
    >
      <defs>
        <linearGradient id={`${uid}-mask`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={MASK_HI} />
          <stop offset="52%" stopColor={MASK} />
          <stop offset="100%" stopColor={MASK_LO} />
        </linearGradient>
        <radialGradient id={`${uid}-enig`} cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#f0d488" />
          <stop offset="58%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9c7a1e" />
        </radialGradient>
        {/* the gloss of the soldermask, lit from the top left */}
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.07} />
          <stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <mask id={`${uid}-pour`} maskUnits="userSpaceOnUse" x="0" y="0" width={BOARD_W} height={BOARD_H}>
          <rect x={POUR_BOX.x} y={POUR_BOX.y} width={POUR_BOX.w} height={POUR_BOX.h} rx={POUR_BOX.r} fill="#fff" />
          <g fill="#000" stroke="#000" strokeLinecap="round" strokeLinejoin="round">
            {segs
              .filter((s) => !s.gnd)
              .map((s, i) => (
                <path key={`m${i}`} d={d(...s.pts)} fill="none" strokeWidth={s.w + 2 * CLR} />
              ))}
            {smds.map((p, i) => (
              <rect
                key={`mp${i}`}
                x={p.x - p.w / 2 - CLR}
                y={p.y - p.h / 2 - CLR}
                width={p.w + 2 * CLR}
                height={p.h + 2 * CLR}
                rx={(p.r ?? 1.2) + CLR}
                stroke="none"
              />
            ))}
            {holes.map((h) =>
              h.square ? (
                <rect key={`mh${h.x}${h.y}`} x={h.x - h.r - CLR} y={h.y - h.r - CLR} width={2 * (h.r + CLR)} height={2 * (h.r + CLR)} rx={2 + CLR} stroke="none" />
              ) : (
                <circle key={`mh${h.x}${h.y}`} cx={h.x} cy={h.y} r={h.r + CLR} stroke="none" />
              )
            )}
            {vias
              .filter((v) => !v.gnd)
              .map((v) => (
                <circle key={`mv${v.x}-${v.y}`} cx={v.x} cy={v.y} r={4.5 + CLR} stroke="none" />
              ))}
            {keepouts.map((k, i) => (
              <rect key={`mk${i}`} x={k.x} y={k.y} width={k.w} height={k.h} rx={4} stroke="none" />
            ))}
            {fiducials.map(([x, y]) => (
              <circle key={`mf${x}`} cx={x} cy={y} r={9} stroke="none" />
            ))}
          </g>
        </mask>
      </defs>

      {/* the board's shadow, outside the turn so it always falls downward */}
      <rect
        x={20}
        y={20}
        width={portrait ? 360 : 600}
        height={portrait ? 600 : 360}
        rx={18}
        fill="#0d0c0b"
        filter={`url(#${uid}-shadow)`}
      />

      <g ref={innerRef} transform={portrait ? `translate(${BOARD_H} 0) rotate(90)` : undefined}>
        {/* ── the board itself ──────────────────────────────────────── */}
        <rect x={20} y={20} width={600} height={360} rx={18} fill={`url(#${uid}-mask)`} stroke="#47355f" strokeWidth={1.4} />

        {/* ── bottom copper, seen through the board ─────────────────── */}
        {!on("airwire") && (
          <path d={d([520, 130], [520, 160])} stroke={BOTTOM} strokeOpacity={0.45} strokeWidth={3.5} strokeLinecap="round" />
        )}

        {/* ── the ground pour and its thermal spokes ────────────────── */}
        <rect x={POUR_BOX.x} y={POUR_BOX.y} width={POUR_BOX.w} height={POUR_BOX.h} rx={POUR_BOX.r} fill={POUR} mask={`url(#${uid}-pour)`} />
        <g stroke={POUR} strokeWidth={2.6}>
          {spokes.flatMap((s) =>
            s.dirs.map(([ux, uy]) => (
              <line key={`sp${s.x}-${s.y}-${ux}${uy}`} x1={s.x} y1={s.y} x2={s.x + ux * s.len} y2={s.y + uy * s.len} />
            ))
          )}
        </g>

        {/* ── top copper ────────────────────────────────────────────── */}
        <g fill="none" stroke={COPPER} strokeLinecap="round" strokeLinejoin="round">
          {segs.map((s, i) => (
            <path key={`t${i}`} d={d(...s.pts)} strokeWidth={s.w} />
          ))}
        </g>

        {/* the mask's gloss lies over the copper, not over the bare pads */}
        <rect x={20} y={20} width={600} height={360} rx={18} fill={`url(#${uid}-sheen)`} />
        <rect x={21.4} y={21.4} width={597.2} height={357.2} rx={16.8} fill="none" stroke="#ffffff" strokeOpacity={0.05} strokeWidth={1} />

        {/* ── pads, holes and vias ──────────────────────────────────── */}
        {fiducials.map(([x, y]) => (
          <g key={`fid${x}`}>
            <circle cx={x} cy={y} r={7.5} fill={MASK_LO} />
            <circle cx={x} cy={y} r={3.5} fill={`url(#${uid}-enig)`} />
          </g>
        ))}

        {/* J1's shield tabs, slotted */}
        {[174, 226].map((y) => (
          <g key={`sh${y}`}>
            <rect x={38 + dx} y={y - 3.5} width={12} height={7} rx={3.5} fill={`url(#${uid}-enig)`} />
            <rect x={41 + dx} y={y - 1.2} width={6} height={2.4} rx={1.2} fill={DRILL} />
          </g>
        ))}

        <g fill={`url(#${uid}-enig)`}>
          {smds.map((p, i) => (
            <rect key={`p${i}`} x={p.x - p.w / 2} y={p.y - p.h / 2} width={p.w} height={p.h} rx={p.r ?? 1.2} />
          ))}
        </g>
        {[330, 340, 350].flatMap((x) =>
          [190, 200, 210].map((y) => <circle key={`ev${x}${y}`} cx={x} cy={y} r={2.2} fill={DRILL} fillOpacity={0.85} />)
        )}

        {holes.map((h) => (
          <g key={`h${h.x}-${h.y}`}>
            {h.square ? (
              <rect x={h.x - h.r} y={h.y - h.r} width={2 * h.r} height={2 * h.r} rx={2} fill={`url(#${uid}-enig)`} />
            ) : (
              <circle cx={h.x} cy={h.y} r={h.r} fill={`url(#${uid}-enig)`} />
            )}
            <circle cx={h.x} cy={h.y} r={h.drill} fill={DRILL} />
          </g>
        ))}

        {vias.map((v) => (
          <g key={`v${v.x}-${v.y}`}>
            <circle cx={v.x} cy={v.y} r={v.small ? 2.8 : 4.5} fill={`url(#${uid}-enig)`} />
            <circle cx={v.x} cy={v.y} r={v.small ? 1.2 : 2} fill={DRILL} />
          </g>
        ))}

        {/* ── silkscreen ────────────────────────────────────────────── */}
        <g stroke={SILK} strokeOpacity={0.62} strokeWidth={1.1} fill="none">
          <rect x={14 + dx} y={170} width={40} height={60} rx={4} />
          <rect x={108} y={79} width={52} height={22} rx={2} />
          <rect x={250} y={144} width={24} height={43} rx={3} />
          <rect x={572} y={108.5} width={26} height={153} rx={2} />
          <rect x={104} y={295} width={36} height={40} rx={3} />
          <circle cx={122} cy={315} r={11} />
          <path d="M292 162 V152 H302 M378 152 H388 V162 M388 238 V248 H378 M302 248 H292 V238" />
        </g>
        <g fill="none" stroke={SILK} strokeOpacity={0.42} strokeWidth={0.9}>
          {chips.map((c) => (
            <rect
              key={`o${c.label}`}
              x={c.v ? c.x - 7 : c.x - 14}
              y={c.v ? c.y - 14 : c.y - 7}
              width={c.v ? 14 : 28}
              height={c.v ? 28 : 14}
              rx={2}
            />
          ))}
          {/* test-point rings */}
          <circle cx={410} cy={100} r={8.5} />
          <circle cx={440} cy={100} r={8.5} />
        </g>
        <g fill={SILK} fillOpacity={0.75}>
          <circle cx={287} cy={147} r={2} />
          <circle cx={110} cy={113} r={1.6} />
          {/* D1's cathode bar */}
          <rect x={285} y={98} width={2.4} height={14} />
          {/* J2's pin 1 */}
          <path d="M566 118.5 L570 122.5 L566 126.5 Z" />
        </g>

        <Label x={34 + dx} y={163}>J1</Label>
        <Label x={34 + dx} y={246} size={6} dim>USB-C</Label>
        <Label x={178} y={94}>U2</Label>
        <Label x={292} y={262} anchor="end">U1</Label>
        <Label x={262} y={139}>Y1</Label>
        <Label x={585} y={278}>J2</Label>
        <Label x={122} y={289}>S1</Label>
        <Label x={122} y={350} size={6} dim>RESET</Label>
        <Label x={410} y={118} size={6.5}>TP1</Label>
        <Label x={440} y={118} size={6.5}>TP2</Label>
        {chips.map((c) => (
          <Label key={`l${c.label}`} x={c.lx} y={c.ly} anchor={c.anchor}>
            {c.label}
          </Label>
        ))}
        {headerPins.map((name, i) => (
          <Label key={`p${name}`} x={601} y={125 + 25 * i} size={6.5} anchor="start">
            {name}
          </Label>
        ))}

        <Muffin x={402} y={322} />
        <text x={490} y={322} fontSize={12} textAnchor="middle" fill={SILK} fillOpacity={0.85} letterSpacing={2.5}>
          SPOT THE FAULT
        </text>
        <text x={490} y={336} fontSize={7} textAnchor="middle" fill={SILK} fillOpacity={0.62} letterSpacing={1.4}>
          PRACTICE BOARD · REV A
        </text>
        <text x={490} y={348} fontSize={6} textAnchor="middle" fill={SILK} fillOpacity={0.45} letterSpacing={1.2}>
          2 LAYERS · 1.6 MM · ENIG
        </text>

        {/* an airwire: a connection the schematic wants and nobody drew */}
        {on("airwire") && (
          <line x1={520} y1={116} x2={585} y2={172.5} stroke="#f4efe6" strokeOpacity={0.9} strokeWidth={1.3} strokeDasharray="5 4" />
        )}

        {/* ── the game's marks ──────────────────────────────────────── */}
        {found.map((id, i) => (
          <Ring key={id} id={id} n={i + 1} missed={false} portrait={portrait} />
        ))}
        {missed.map((id, i) => (
          <Ring key={id} id={id} n={found.length + i + 1} missed portrait={portrait} />
        ))}
        {misses.map((m) => (
          <MissMark key={m.key} x={m.x} y={m.y} />
        ))}
        {probe && <Probe x={probe.x} y={probe.y} />}
      </g>
    </svg>
  );
}

export default memo(FaultBoard);
