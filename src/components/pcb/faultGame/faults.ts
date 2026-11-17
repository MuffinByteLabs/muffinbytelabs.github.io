/* ════════════════════════════════════════════════════════════════════════
   Spot the fault: the mistakes the practice board can carry.

   FaultBoard.tsx draws each of these areas twice, the right way and with
   the mistake. A round switches on ROUND_SIZE of them at random and draws
   the rest correctly, so the next game is a different board.

   `hit` is where a click counts and `mark` is where the ring goes, both in
   the board's 640 × 400 drawing units. Keep the hit areas apart: a click
   is matched to the nearest fault, so two areas that touch would make a
   click near the seam ambiguous.
   ════════════════════════════════════════════════════════════════════════ */

export type FaultId =
  | "neck"
  | "farcap"
  | "silk"
  | "airwire"
  | "edge"
  | "pinch"
  | "overlap"
  | "setback"
  | "split";

export type Rect = { x: number; y: number; w: number; h: number };

export type Fault = {
  id: FaultId;
  /** the kind of mistake, shown above its title */
  kind: string;
  title: string;
  /** one or two plain sentences: what goes wrong on a real order */
  why: string;
  hit: Rect[];
  mark: { x: number; y: number; r: number };
};

export const FAULTS: Fault[] = [
  {
    id: "neck",
    kind: "Power",
    title: "Power trace pinched thin",
    why: "This trace carries the whole board's supply. Where it narrows it runs hot and drops voltage; at worst it acts like a fuse.",
    hit: [{ x: 134, y: 128, w: 28, h: 46 }],
    mark: { x: 148, y: 149, r: 22 },
  },
  {
    id: "farcap",
    kind: "Power integrity",
    title: "Decoupling cap far from its pin",
    why: "C3 should sit right at U1's supply pin. Out here, the long trace's inductance cancels most of its effect.",
    hit: [
      { x: 214, y: 296, w: 92, h: 40 },
      { x: 314, y: 248, w: 26, h: 52 },
    ],
    mark: { x: 256, y: 314, r: 28 },
  },
  {
    id: "silk",
    kind: "Assembly",
    title: "Label printed on a pad",
    why: "Ink on a pad can stop solder from wetting it. Some factories trim it off and some don't; either way the label is lost.",
    hit: [{ x: 208, y: 90, w: 44, h: 26 }],
    mark: { x: 228, y: 105, r: 19 },
  },
  {
    id: "airwire",
    kind: "Connectivity",
    title: "A connection never routed",
    why: "The dashed line is an airwire: R3 should connect to SCL, but no copper was drawn. The boards would arrive with it open.",
    hit: [{ x: 508, y: 104, w: 90, h: 78 }],
    mark: { x: 552, y: 144, r: 34 },
  },
  {
    id: "edge",
    kind: "Fabrication",
    title: "Trace on the board edge",
    why: "Copper this close to the edge gets nicked or exposed when the board is cut out of its panel. Traces stay back from the edge.",
    hit: [{ x: 186, y: 362, w: 190, h: 22 }],
    mark: { x: 280, y: 374, r: 22 },
  },
  {
    id: "pinch",
    kind: "Fabrication",
    title: "Two signals almost touching",
    why: "SDA and SCL squeeze closer than the factory can reliably etch. One bad batch and they short together.",
    hit: [{ x: 390, y: 188, w: 44, h: 24 }],
    mark: { x: 407, y: 200, r: 18 },
  },
  {
    id: "overlap",
    kind: "Assembly",
    title: "Two parts on top of each other",
    why: "C9 sits on top of R4. The assembly machine can't place both, and their pads short together.",
    hit: [{ x: 172, y: 292, w: 40, h: 26 }],
    mark: { x: 192, y: 305, r: 20 },
  },
  {
    id: "setback",
    kind: "Mechanical",
    title: "USB connector set back from the edge",
    why: "The plug can't reach a connector this far inside the board. It belongs at the edge, overhanging slightly.",
    hit: [{ x: 14, y: 160, w: 96, h: 80 }],
    mark: { x: 64, y: 200, r: 36 },
  },
  {
    id: "split",
    kind: "Signal integrity",
    title: "USB pair split apart",
    why: "D+ and D− have to run side by side. Split around a via like this, the pair picks up noise: a classic cause of flaky USB.",
    hit: [{ x: 166, y: 198, w: 96, h: 44 }],
    mark: { x: 214, y: 222, r: 26 },
  },
];

export const FAULT_BY_ID = Object.fromEntries(FAULTS.map((f) => [f.id, f])) as Record<FaultId, Fault>;

export const ROUND_SIZE = 5;
export const ROUND_MS = 60_000;
export const MISS_PENALTY_MS = 2_000;

/** distance from a point to the nearest of a fault's hit areas; 0 inside one */
export function distanceToFault(f: Fault, p: { x: number; y: number }) {
  let best = Infinity;
  for (const r of f.hit) {
    const dx = Math.max(r.x - p.x, 0, p.x - (r.x + r.w));
    const dy = Math.max(r.y - p.y, 0, p.y - (r.y + r.h));
    best = Math.min(best, Math.hypot(dx, dy));
  }
  return best;
}

/** ROUND_SIZE faults at random, never the same set twice in a row */
export function pickRound(previous?: readonly FaultId[]): FaultId[] {
  const same = (a: readonly FaultId[], b: readonly FaultId[]) =>
    a.length === b.length && a.every((id) => b.includes(id));
  let pick: FaultId[] = [];
  for (let attempt = 0; attempt < 8; attempt++) {
    const ids = FAULTS.map((f) => f.id);
    // Fisher–Yates shuffle
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    pick = ids.slice(0, ROUND_SIZE);
    if (!previous || !same(pick, previous)) break;
  }
  return pick;
}
