/* Number formatting shared by the calculators. */

/** a number with `digits` significant figures, without trailing zeros */
export function sig(x: number, digits = 3): string {
  if (!Number.isFinite(x)) return "–";
  if (x === 0) return "0";
  const v = Number(x.toPrecision(digits));
  return Math.abs(v) >= 1e5 ? v.toExponential(2) : String(v);
}

const PREFIXES: [number, string][] = [
  [1e6, "M"],
  [1e3, "k"],
  [1, ""],
  [1e-3, "m"],
  [1e-6, "µ"],
  [1e-9, "n"],
  [1e-12, "p"],
];

/** 1e-5, "H" → "10 µH" */
export function si(x: number, unit: string, digits = 3): string {
  if (!Number.isFinite(x)) return "–";
  if (x === 0) return `0 ${unit}`;
  const a = Math.abs(x);
  const [scale, prefix] = PREFIXES.find(([s]) => a >= s * 0.9995) ?? PREFIXES[PREFIXES.length - 1];
  return `${sig(x / scale, digits)} ${prefix}${unit}`;
}

/** "12" → 12, "" or "abc" → NaN; accepts a comma as the decimal mark */
export function num(s: string): number {
  const t = s.trim().replace(",", ".");
  return t === "" ? NaN : Number(t);
}

export const pct = (x: number, digits = 1) => `${(x * 100).toFixed(digits)}%`;

/** 1650 → "$1,650" */
export const usd = (x: number) => `$${Math.round(x).toLocaleString("en-US")}`;
