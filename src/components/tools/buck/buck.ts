/* ════════════════════════════════════════════════════════════════════════
   Buck converter power stage, in continuous conduction, from the standard
   equations (TI application report SLVA477B, "Basic Calculation of a Buck
   Converter's Power Stage", plus the usual input-capacitor ripple terms):

     duty cycle        D    = Vout / (Vin · η)
     ripple current    ΔIL  = r · Iout             (r is the ripple ratio)
     inductance        L    = Vout · (Vin,max − Vout) / (ΔIL · fsw · Vin,max)
     peak current      Ipk  = Iout + ΔIL / 2
     output cap        Cout ≥ ΔIL / (8 · fsw · ΔVout)
     output cap ESR    ESR  ≤ ΔVout / ΔIL
     input RMS current Icin = Iout · √(D · (1 − D))
     input cap         Cin  ≥ Iout · D · (1 − D) / (fsw · ΔVin)

   The inductance is computed at the highest input voltage, where the
   ripple is largest, then rounded up to the next standard value; every
   current after that uses the rounded value, which is the part a designer
   would actually fit.

   No imports, so this file can be checked on its own with node.
   ════════════════════════════════════════════════════════════════════════ */

export type BuckInput = {
  vinMin: number;
  vinMax: number;
  vout: number;
  iout: number;
  /** switching frequency, Hz */
  fsw: number;
  /** inductor ripple as a fraction of Iout, e.g. 0.3 */
  ripple: number;
  /** efficiency estimate, e.g. 0.9 */
  eff: number;
  /** output ripple target, V peak-to-peak */
  dVout: number;
  /** input ripple target, V peak-to-peak */
  dVin: number;
  /** output capacitor ESR, Ω */
  esr: number;
};

export type BuckResult = {
  dMin: number;
  dMax: number;
  lCalc: number;
  lStd: number;
  dIL: number;
  ipk: number;
  ivalley: number;
  irms: number;
  coutMin: number;
  esrMax: number;
  esrRipple: number;
  cinMin: number;
  cinRms: number;
  /** a non-synchronous converter's diode: average current, minimum reverse rating */
  diodeAvg: number;
  diodeVr: number;
  pout: number;
  ploss: number;
  /** the duty cycle each worst case was taken at */
  dCin: number;
  warnings: string[];
};

/** E6 series, the values inductors are usually sold in */
const E6 = [1, 1.5, 2.2, 3.3, 4.7, 6.8];

/** the next standard value at or above `x` (in henries) */
export function nextStandard(x: number): number {
  if (!(x > 0)) return x;
  const exp = Math.floor(Math.log10(x));
  for (let e = exp; e <= exp + 1; e++) {
    for (const m of E6) {
      const v = m * Math.pow(10, e);
      if (v >= x * (1 - 1e-9)) return v;
    }
  }
  return 10 * Math.pow(10, exp + 1);
}

/** the result, or a sentence saying why there isn't one */
export function solveBuck(p: BuckInput): BuckResult | string {
  const pos = (n: number) => Number.isFinite(n) && n > 0;
  if (![p.vinMin, p.vinMax, p.vout, p.iout, p.fsw, p.ripple, p.eff, p.dVout, p.dVin].every(pos))
    return "Fill in every field with a number above zero.";
  if (!(Number.isFinite(p.esr) && p.esr >= 0)) return "The capacitor's ESR can't be negative.";

  const warnings: string[] = [];
  const vinMin = Math.min(p.vinMin, p.vinMax);
  const vinMax = Math.max(p.vinMin, p.vinMax);
  if (p.vout >= vinMin)
    return "A buck converter only steps down: the output must be below the lowest input voltage. For an output above the input, look at a boost or buck-boost converter.";

  const dMax = p.vout / (vinMin * p.eff);
  const dMin = p.vout / (vinMax * p.eff);
  const dILTarget = p.ripple * p.iout;
  const lCalc = (p.vout * (vinMax - p.vout)) / (dILTarget * p.fsw * vinMax);
  const lStd = nextStandard(lCalc);
  const dIL = (p.vout * (vinMax - p.vout)) / (lStd * p.fsw * vinMax);
  const ipk = p.iout + dIL / 2;
  const ivalley = p.iout - dIL / 2;
  const irms = Math.sqrt(p.iout * p.iout + (dIL * dIL) / 12);

  const coutMin = dIL / (8 * p.fsw * p.dVout);
  const esrMax = p.dVout / dIL;
  const esrRipple = p.esr * dIL;

  /* the input cap works hardest at D = 0.5, or as close to it as the
     input range allows */
  const dCin = Math.min(Math.max(0.5, dMin), Math.min(dMax, 1));
  const dc = Math.min(Math.max(dCin, 0), 1);
  const cinRms = p.iout * Math.sqrt(dc * (1 - dc));
  const cinMin = (p.iout * dc * (1 - dc)) / (p.fsw * p.dVin);

  const diodeAvg = p.iout * (1 - Math.min(dMin, 1));
  const pout = p.vout * p.iout;
  const ploss = pout / p.eff - pout;

  if (dMax > 0.9) warnings.push(`At the lowest input the duty cycle reaches ${Math.round(dMax * 100)}%. Many buck controllers top out around 90%; check the chip's maximum duty cycle and dropout.`);
  if (dMin < 0.08) warnings.push(`At the highest input the duty cycle falls to ${(dMin * 100).toFixed(1)}%: very short on-times. Check the chip's minimum on-time at this frequency.`);
  if (p.ripple < 0.1 || p.ripple > 0.6) warnings.push("Ripple ratios outside 10–60% of the load current are unusual; 20–40% is the usual starting point.");
  if (ivalley <= 0) warnings.push("The inductor current falls to zero every cycle (discontinuous mode), where these equations no longer hold. Use a larger inductor.");
  if (p.esr > esrMax) warnings.push("The output capacitor's ESR alone exceeds the ripple target. Use lower-ESR capacitors (ceramics) or several in parallel.");
  if (p.eff > 0.99 || p.eff < 0.5) warnings.push("The efficiency estimate looks off; 85–95% is typical for a well-built buck.");

  return {
    dMin,
    dMax,
    lCalc,
    lStd,
    dIL,
    ipk,
    ivalley,
    irms,
    coutMin,
    esrMax,
    esrRipple,
    cinMin,
    cinRms,
    diodeAvg,
    diodeVr: vinMax,
    pout,
    ploss,
    dCin: dc,
    warnings,
  };
}
