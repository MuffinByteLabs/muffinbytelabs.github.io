/* ════════════════════════════════════════════════════════════════════════
   The cost estimator's model: typical hours per kind of job and size of
   board, a factor for layer count, and the extra hours special features
   add. Every number a visitor sees comes from this file, so this is the
   one place to tune it.

   It is a ballpark from typical projects, not a quote, and the page says
   so: the real number is the fixed price, in writing, within 24 hours of a
   brief. Job kinds and turnarounds match SERVICES in pcbData.ts.

   No imports, so this file can be checked on its own with node.
   ════════════════════════════════════════════════════════════════════════ */

export type ScopeId = "new" | "layout" | "fix" | "redraw" | "review" | "debug";
export type SizeId = "small" | "medium" | "large" | "dense";
export type ExtraId = "fast" | "rf" | "power" | "isolation" | "mech";

export const SCOPES: { id: ScopeId; label: string; includes: string; service: string }[] = [
  { id: "new", label: "A new board, from idea to factory files", includes: "Schematic, part selection, layout and the full manufacturing package.", service: "svc-04" },
  { id: "layout", label: "Layout from my finished schematic", includes: "Placement, routing and the full manufacturing package.", service: "svc-04" },
  { id: "fix", label: "Fix, revise or finish an existing design", includes: "Changes inside your project, then a complete package.", service: "svc-05" },
  { id: "redraw", label: "Redraw an old or PDF-only design", includes: "Rebuilt as a clean, editable project, checked against the original.", service: "svc-02" },
  { id: "review", label: "Review my design before I order", includes: "A written report: what to change, why, and how to test it.", service: "svc-01" },
  { id: "debug", label: "My boards are back and something's wrong", includes: "A bring-up plan, the diagnosis and the fix.", service: "svc-03" },
];

export const SIZES: { id: SizeId; label: string; note: string }[] = [
  { id: "small", label: "Small", note: "up to about 40 parts: one main chip, a connector or two, simple power" },
  { id: "medium", label: "Medium", note: "about 40–120 parts: a microcontroller with USB, power and a few sensors" },
  { id: "large", label: "Large", note: "about 120–250 parts: several power rails, isolated I/O, many interfaces" },
  { id: "dense", label: "Dense", note: "250+ parts, fine-pitch or BGA chips, or a very tight outline" },
];

/** typical hours, [low, high], per job and board size */
const HOURS: Record<ScopeId, Record<SizeId, [number, number]>> = {
  new: { small: [14, 28], medium: [30, 55], large: [55, 100], dense: [90, 160] },
  layout: { small: [8, 16], medium: [18, 34], large: [34, 64], dense: [56, 100] },
  fix: { small: [4, 12], medium: [8, 24], large: [16, 40], dense: [24, 60] },
  redraw: { small: [6, 14], medium: [14, 30], large: [28, 56], dense: [48, 90] },
  review: { small: [3, 6], medium: [6, 10], large: [10, 16], dense: [16, 26] },
  debug: { small: [2, 6], medium: [3, 8], large: [4, 12], dense: [6, 16] },
};

export const LAYERS: { id: number; label: string; factor: number }[] = [
  { id: 2, label: "2 layers", factor: 1 },
  { id: 4, label: "4 layers", factor: 1.1 },
  { id: 6, label: "6 or more", factor: 1.25 },
];

export const EXTRAS: { id: ExtraId; label: string; hours: [number, number] }[] = [
  { id: "fast", label: "USB, Ethernet or other fast signals", hours: [3, 6] },
  { id: "rf", label: "Wi-Fi, Bluetooth or another radio antenna", hours: [4, 8] },
  { id: "power", label: "High current, or power conversion on the board", hours: [4, 8] },
  { id: "isolation", label: "Isolation, mains or high voltage", hours: [6, 12] },
  { id: "mech", label: "A tight enclosure or a fixed board outline", hours: [3, 6] },
];

/** how much of a feature's design hours a job of this kind takes on */
const EXTRA_WEIGHT: Record<ScopeId, number> = { new: 1, layout: 1, fix: 0.5, redraw: 0.5, review: 0.25, debug: 0.25 };

/** focused hours in a working day, for turning hours into days */
export const HOURS_PER_DAY = 6;

export type Estimate = {
  hours: [number, number];
  cost: [number, number];
  days: [number, number];
  /** what the job's own turnaround line on /services says, where it has one */
  turnaround?: string;
  /** whether the boards still have to be made after the work */
  needsFab: boolean;
};

const roundTo = (x: number, step: number) => Math.round(x / step) * step;

export function estimate(sel: { scope: ScopeId; size: SizeId; layers: number; extras: ExtraId[]; rate: number }): Estimate {
  const [baseLo, baseHi] = HOURS[sel.scope][sel.size];
  const factor = LAYERS.find((l) => l.id === sel.layers)?.factor ?? 1;
  const w = EXTRA_WEIGHT[sel.scope];
  let lo = baseLo * factor;
  let hi = baseHi * factor;
  for (const id of sel.extras) {
    const e = EXTRAS.find((x) => x.id === id);
    if (!e) continue;
    lo += e.hours[0] * w;
    hi += e.hours[1] * w;
  }
  lo = Math.max(1, Math.round(lo));
  hi = Math.max(lo + 1, Math.round(hi));
  return {
    hours: [lo, hi],
    cost: [Math.max(50, roundTo(lo * sel.rate, 50)), roundTo(hi * sel.rate, 50)],
    days: [Math.max(1, Math.ceil(lo / HOURS_PER_DAY)), Math.max(1, Math.ceil(hi / HOURS_PER_DAY))],
    turnaround:
      sel.scope === "review"
        ? "First findings in 1–2 days, the full report in about a week."
        : sel.scope === "debug"
          ? "A first read of your files within a day."
          : undefined,
    needsFab: sel.scope === "new" || sel.scope === "layout" || sel.scope === "fix" || sel.scope === "redraw",
  };
}
