/* ════════════════════════════════════════════════════════════════════════
   Trace width from current, per IPC-2221 (the formula fitted to the old
   IPC-D-275 charts):

       I = k · ΔT^0.44 · A^0.725

     I   current, amps
     ΔT  temperature rise above ambient, °C
     A   copper cross-section, square mils
     k   0.048 for outer layers, 0.024 for inner layers

   Width is the area divided by the copper's thickness. Resistance uses
   copper's resistivity at the trace's working temperature (ambient plus
   the rise), so the voltage drop and power loss are the hot-trace values.

   No imports, so this file can be checked on its own with node.
   ════════════════════════════════════════════════════════════════════════ */

export type Layer = "external" | "internal";

/** 1 oz/ft² of copper is about 1.378 mil (35 µm) thick */
export const MIL_PER_OZ = 1.378;
/** annealed copper (IACS) at 20 °C, Ω·m */
export const RHO_CU_20 = 1.724e-8;
/** copper's temperature coefficient of resistance, per °C */
export const ALPHA_CU = 0.00393;
const K: Record<Layer, number> = { external: 0.048, internal: 0.024 };
const MM_PER_MIL = 0.0254;

/** the range the IPC-2221 curves were fitted over */
export const IPC_RANGE = { maxAmpsExternal: 35, maxAmpsInternal: 17.5, maxWidthMil: 400, minRise: 10, maxRise: 100, minOz: 0.5, maxOz: 3 };

/** cross-section (mil²) that carries `amps` with a `rise` °C temperature rise */
export function areaForCurrent(amps: number, rise: number, layer: Layer): number {
  return Math.pow(amps / (K[layer] * Math.pow(rise, 0.44)), 1 / 0.725);
}

/** current (A) a cross-section of `areaMil2` carries with a `rise` °C rise */
export function currentForArea(areaMil2: number, rise: number, layer: Layer): number {
  return K[layer] * Math.pow(rise, 0.44) * Math.pow(areaMil2, 0.725);
}

/** resistance (Ω) of a trace, at `tempC` */
export function resistance(widthMm: number, oz: number, lengthMm: number, tempC: number): number {
  const rho = RHO_CU_20 * (1 + ALPHA_CU * (tempC - 20));
  const areaM2 = widthMm * 1e-3 * (oz * MIL_PER_OZ * MM_PER_MIL * 1e-3);
  return (rho * lengthMm * 1e-3) / areaM2;
}

export type TraceInput = {
  /** "width": find the width for a current; "current": find the current a width carries */
  mode: "width" | "current";
  amps: number;
  widthMm: number;
  rise: number;
  oz: number;
  layer: Layer;
  ambient: number;
  lengthMm: number;
};

export type TraceResult = {
  amps: number;
  widthMm: number;
  widthMil: number;
  areaMil2: number;
  areaMm2: number;
  thicknessUm: number;
  /** the same current on the other kind of layer, for comparison */
  otherLayerWidthMm: number;
  resistanceMohm: number;
  dropMv: number;
  lossMw: number;
  warnings: string[];
};

export function solveTrace(p: TraceInput): TraceResult | null {
  const ok = (n: number) => Number.isFinite(n) && n > 0;
  if (!ok(p.rise) || !ok(p.oz) || !ok(p.lengthMm) || !Number.isFinite(p.ambient)) return null;
  const thicknessMil = p.oz * MIL_PER_OZ;

  let amps: number;
  let areaMil2: number;
  if (p.mode === "width") {
    if (!ok(p.amps)) return null;
    amps = p.amps;
    areaMil2 = areaForCurrent(amps, p.rise, p.layer);
  } else {
    if (!ok(p.widthMm)) return null;
    areaMil2 = (p.widthMm / MM_PER_MIL) * thicknessMil;
    amps = currentForArea(areaMil2, p.rise, p.layer);
  }
  const widthMil = areaMil2 / thicknessMil;
  const widthMm = widthMil * MM_PER_MIL;
  const other: Layer = p.layer === "external" ? "internal" : "external";
  const otherLayerWidthMm = (areaForCurrent(amps, p.rise, other) / thicknessMil) * MM_PER_MIL;

  const ohms = resistance(widthMm, p.oz, p.lengthMm, p.ambient + p.rise);

  const warnings: string[] = [];
  const maxAmps = p.layer === "external" ? IPC_RANGE.maxAmpsExternal : IPC_RANGE.maxAmpsInternal;
  if (amps > maxAmps) warnings.push(`IPC-2221's curves stop at ${maxAmps} A on ${p.layer === "external" ? "outer" : "inner"} layers; above that, treat the result as a rough guide.`);
  if (widthMil > IPC_RANGE.maxWidthMil) warnings.push("Wider than the 400 mil (10 mm) the curves cover. Use a copper pour or a heavier copper weight instead.");
  if (p.rise < IPC_RANGE.minRise || p.rise > IPC_RANGE.maxRise) warnings.push("IPC-2221 was fitted for temperature rises between 10 °C and 100 °C.");
  if (p.oz < IPC_RANGE.minOz || p.oz > IPC_RANGE.maxOz) warnings.push("IPC-2221 was fitted for copper from 0.5 oz to 3 oz.");
  if (widthMm < 0.1) warnings.push("Narrower than 0.1 mm: below most fabs' standard minimum. Use the fab's minimum instead.");

  return {
    amps,
    widthMm,
    widthMil,
    areaMil2,
    areaMm2: areaMil2 * MM_PER_MIL * MM_PER_MIL,
    thicknessUm: thicknessMil * MM_PER_MIL * 1000,
    otherLayerWidthMm,
    resistanceMohm: ohms * 1000,
    dropMv: ohms * amps * 1000,
    lossMw: ohms * amps * amps * 1000,
    warnings,
  };
}
