"use client";

import { useMemo, useState } from "react";
import { NumField, Row, Stat, Warnings } from "../fields";
import { num, pct, si, sig } from "../format";
import { solveBuck, type BuckResult } from "./buck";

/* ════════════════════════════════════════════════════════════════════════
   The buck converter calculator: the power stage's numbers, the
   schematic with those numbers written on it, and the inductor current
   they produce, drawn as the triangle wave it really is.
   ════════════════════════════════════════════════════════════════════════ */

const MONO = { fontFamily: "var(--font-geist-mono), ui-monospace, monospace" };

function Schematic({ r, vinMin, vinMax, vout }: { r: BuckResult; vinMin: number; vinMax: number; vout: number }) {
  const wire = "#8f8675";
  const part = "#e9e2d4";
  const val = "#f1c978";
  return (
    <svg viewBox="0 0 520 210" className="tl-diagram" role="img" aria-label="Buck converter power stage with the calculated values">
      <g fill="none" stroke={wire} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* top rail: Vin → switch → SW node → L → Vout → load */}
        <path d="M30 60 H120 M160 60 H230 M300 60 H470" />
        {/* ground rail */}
        <path d="M60 170 H470" />
        {/* Cin, diode, Cout, load drops */}
        <path d="M60 60 V100 M60 116 V170" />
        <path d="M200 60 V92 M200 130 V170" />
        <path d="M360 60 V100 M360 116 V170" />
        <path d="M470 60 V90 M470 140 V170" />
      </g>
      {/* the switch */}
      <g stroke={part} strokeWidth="1.8" fill="none" strokeLinecap="round">
        <circle cx="120" cy="60" r="3" fill={part} />
        <circle cx="160" cy="60" r="3" fill={part} />
        <path d="M122 58 L156 44" />
      </g>
      {/* capacitors */}
      {[60, 360].map((x) => (
        <g key={x} stroke={part} strokeWidth="2" strokeLinecap="round">
          <path d={`M${x - 14} 100 H${x + 14} M${x - 14} 116 H${x + 14}`} />
        </g>
      ))}
      {/* the freewheel diode: cathode to the switch node */}
      <g stroke={part} strokeWidth="1.8" fill="none" strokeLinejoin="round">
        <path d="M188 130 L212 130 L200 108 Z" fill="rgba(233,226,212,0.08)" />
        <path d="M188 106 H212" strokeLinecap="round" />
      </g>
      {/* the inductor */}
      <path
        d="M230 60 a8.75 8 0 0 1 17.5 0 a8.75 8 0 0 1 17.5 0 a8.75 8 0 0 1 17.5 0 a8.75 8 0 0 1 17.5 0"
        fill="none"
        stroke={part}
        strokeWidth="1.8"
      />
      {/* the load */}
      <rect x="460" y="90" width="20" height="50" rx="3" fill="none" stroke={part} strokeWidth="1.6" />
      {/* nodes */}
      {[
        [60, 60],
        [200, 60],
        [360, 60],
        [60, 170],
        [200, 170],
        [360, 170],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill={wire} />
      ))}
      <g fontSize="11.5" fill="#b1a899" style={MONO}>
        <text x="30" y="48">Vin</text>
        <text x="30" y="34" fill={val}>
          {vinMin === vinMax ? `${sig(vinMin)} V` : `${sig(vinMin)}–${sig(vinMax)} V`}
        </text>
        <text x="122" y="34">switch</text>
        <text x="122" y="20" fill={val}>
          D {pct(r.dMin, 0)}–{pct(r.dMax, 0)}
        </text>
        <text x="238" y="34">L</text>
        <text x="252" y="34" fill={val}>
          {si(r.lStd, "H", 2)}
        </text>
        <text x="238" y="86" fill={val}>
          Ipk {sig(r.ipk)} A
        </text>
        <text x="420" y="48">Vout</text>
        <text x="420" y="34" fill={val}>
          {sig(vout)} V
        </text>
        <text x="80" y="104">Cin</text>
        <text x="80" y="120" fill={val}>
          ≥ {si(r.cinMin, "F", 2)}
        </text>
        <text x="218" y="124">diode</text>
        <text x="380" y="104">Cout</text>
        <text x="380" y="120" fill={val}>
          ≥ {si(r.coutMin, "F", 2)}
        </text>
        <text x="440" y="160" textAnchor="end">
          load
        </text>
        <text x="270" y="194" textAnchor="middle" fill="#8f8675">
          ground
        </text>
      </g>
    </svg>
  );
}

/** three switching periods of inductor current: up for D·T, down for the rest */
function Waveform({ r, iout }: { r: BuckResult; iout: number }) {
  const W = 520;
  const H = 170;
  const left = 54;
  const right = W - 16;
  const top = 18;
  const bottom = H - 30;
  /* zoomed to the ripple band, not from zero, so the triangle and its three
     labels have room; the axis says so */
  const span = r.ipk - r.ivalley;
  const lo = Math.max(0, r.ivalley - span * 0.8);
  const hi = r.ipk + span * 0.45;
  const y = (i: number) => bottom - ((i - lo) / (hi - lo)) * (bottom - top);
  const period = (right - left) / 3;
  /* the peak and valley are the highest-input values, so the shape is too */
  const d = Math.min(Math.max(r.dMin, 0.05), 0.95);
  let path = `M${left} ${y(r.ivalley)}`;
  for (let k = 0; k < 3; k++) {
    const x0 = left + k * period;
    path += ` L${x0 + d * period} ${y(r.ipk)} L${x0 + period} ${y(r.ivalley)}`;
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="tl-diagram" role="img" aria-label={`Inductor current: ${sig(r.ivalley)} A to ${sig(r.ipk)} A, averaging ${sig(iout)} A`}>
      <g stroke="#3d372f" strokeWidth="1">
        <line x1={left} y1={bottom} x2={right} y2={bottom} />
        <line x1={left} y1={top} x2={left} y2={bottom} />
      </g>
      <line x1={left} y1={y(iout)} x2={right} y2={y(iout)} stroke="#8f8675" strokeDasharray="4 4" />
      <path d={path} fill="none" stroke="#f1c978" strokeWidth="2.2" strokeLinejoin="round" />
      <g fontSize="11" fill="#b1a899" style={MONO}>
        <text x={left - 8} y={y(r.ipk) + 4} textAnchor="end" fill="#f1c978">
          {sig(r.ipk)}
        </text>
        <text x={left - 8} y={y(iout) + 4} textAnchor="end">
          {sig(iout)}
        </text>
        <text x={left - 8} y={y(r.ivalley) + 4} textAnchor="end">
          {sig(r.ivalley)}
        </text>
        <text x={left + 8} y={y(r.ipk) - 8} fill="#f1c978">
          peak
        </text>
        <text x={right} y={y(iout) - 6} textAnchor="end">
          average = load current
        </text>
        <text x={right} y={H - 10} textAnchor="end" fill="#8f8675">
          inductor current, A (axis zoomed) · at the highest input, where ripple peaks
        </text>
      </g>
    </svg>
  );
}

export default function BuckCalculator() {
  const [vinMin, setVinMin] = useState("11");
  const [vinMax, setVinMax] = useState("13");
  const [vout, setVout] = useState("3.3");
  const [iout, setIout] = useState("2");
  const [fsw, setFsw] = useState("500");
  const [ripple, setRipple] = useState("30");
  const [eff, setEff] = useState("90");
  const [dVout, setDVout] = useState("20");
  const [dVin, setDVin] = useState("100");
  const [esr, setEsr] = useState("5");

  const out = useMemo(
    () =>
      solveBuck({
        vinMin: num(vinMin),
        vinMax: num(vinMax),
        vout: num(vout),
        iout: num(iout),
        fsw: num(fsw) * 1e3,
        ripple: num(ripple) / 100,
        eff: num(eff) / 100,
        dVout: num(dVout) / 1e3,
        dVin: num(dVin) / 1e3,
        esr: num(esr) / 1e3,
      }),
    [vinMin, vinMax, vout, iout, fsw, ripple, eff, dVout, dVin, esr]
  );
  const r = typeof out === "string" ? null : out;
  const bad = (s: string) => !(num(s) > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="tl-grid">
        <div className="card card-static tl-panel">
          <div className="tl-pair">
            <NumField label="Input, lowest" unit="V" value={vinMin} onChange={setVinMin} invalid={bad(vinMin)} />
            <NumField label="Input, highest" unit="V" value={vinMax} onChange={setVinMax} invalid={bad(vinMax)} />
          </div>
          <div className="tl-pair">
            <NumField label="Output voltage" unit="V" value={vout} onChange={setVout} invalid={bad(vout)} />
            <NumField label="Output current" unit="A" value={iout} onChange={setIout} invalid={bad(iout)} />
          </div>
          <div className="tl-pair">
            <NumField label="Switching frequency" unit="kHz" value={fsw} onChange={setFsw} invalid={bad(fsw)} hint="From the controller's datasheet." />
            <NumField label="Efficiency estimate" unit="%" value={eff} onChange={setEff} invalid={bad(eff)} hint="85–95% is typical." />
          </div>
          <NumField
            label="Inductor ripple"
            unit="% of Iout"
            value={ripple}
            onChange={setRipple}
            invalid={bad(ripple)}
            hint="The swing of the inductor current. 20–40% is the usual starting point: less needs a bigger inductor, more needs more capacitance."
          />
          <div className="tl-pair">
            <NumField label="Output ripple target" unit="mV" value={dVout} onChange={setDVout} invalid={bad(dVout)} />
            <NumField label="Input ripple target" unit="mV" value={dVin} onChange={setDVin} invalid={bad(dVin)} />
          </div>
          <NumField label="Output capacitor ESR" unit="mΩ" value={esr} onChange={setEsr} invalid={!(num(esr) >= 0)} hint="A few mΩ for ceramics; tens of mΩ or more for polymer and electrolytic parts." />
        </div>

        <div className="card card-static tl-panel tl-out" aria-live="polite">
          {r ? (
            <>
              <div className="tl-stats">
                <Stat accent label="Inductor" value={si(r.lStd, "H", 2).split(" ")[0]} unit={si(r.lStd, "H", 2).split(" ")[1]} note={`${si(r.lCalc, "H")} calculated, rounded up to a standard value`} />
                <Stat label="Peak inductor current" value={sig(r.ipk)} unit="A" note="the inductor's saturation rating must be above this" />
              </div>
              <div className="tl-rows">
                <Row label="Duty cycle" value={`${pct(r.dMin)} – ${pct(r.dMax)}`} sub="at the highest and lowest input" />
                <Row label="Ripple current" value={`${sig(r.dIL)} A p-p`} sub={`with ${si(r.lStd, "H", 2)}, at the highest input`} />
                <Row label="Inductor RMS current" value={`${sig(r.irms)} A`} sub="for its heating (rated current)" />
                <Row label="Output capacitance" value={`≥ ${si(r.coutMin, "F")}`} sub={`for ${num(dVout)} mV of ripple`} />
                <Row label="Output capacitor ESR" value={`≤ ${si(r.esrMax, "Ω")}`} sub={`yours adds ${si(r.esrRipple, "V")} of ripple`} />
                <Row label="Input capacitance" value={`≥ ${si(r.cinMin, "F")}`} sub={`for ${num(dVin)} mV of ripple, at D = ${pct(r.dCin, 0)}`} />
                <Row label="Input capacitor RMS current" value={`${sig(r.cinRms)} A`} sub="the input caps' ripple-current rating" />
                <Row label="Diode, if non-synchronous" value={`${sig(r.diodeAvg)} A avg`} sub={`and at least ${sig(r.diodeVr)} V reverse rating`} />
                <Row label="Output power · loss" value={`${sig(r.pout)} W · ${sig(r.ploss)} W`} sub="the loss is heat in the converter" />
              </div>
              <Warnings items={r.warnings} />
            </>
          ) : (
            <p className="tl-empty">{typeof out === "string" ? out : "Fill in every field."}</p>
          )}
        </div>
      </div>

      {r && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <figure className="card card-static tl-figure">
            <figcaption className="eyebrow">The power stage, with your values</figcaption>
            <Schematic r={r} vinMin={Math.min(num(vinMin), num(vinMax))} vinMax={Math.max(num(vinMin), num(vinMax))} vout={num(vout)} />
          </figure>
          <figure className="card card-static tl-figure">
            <figcaption className="eyebrow">What the inductor current does</figcaption>
            <Waveform r={r} iout={num(iout)} />
          </figure>
        </div>
      )}
    </div>
  );
}
