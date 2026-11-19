"use client";

import { useMemo, useState } from "react";
import { NumField, Row, Seg, Stat, Warnings } from "../fields";
import { num, sig } from "../format";
import { solveTrace, type Layer } from "./traceWidth";

/* ════════════════════════════════════════════════════════════════════════
   The trace width calculator: inputs on the left, the answer and a live
   cross-section of the trace on the right. The cross-section is drawn to
   a fixed scale, so a wider answer really is a wider trace, and its colour
   warms with the temperature rise.
   ════════════════════════════════════════════════════════════════════════ */

const OZ = [0.5, 1, 2, 3];

/** gold at a 10 °C rise, through orange, to red at 60 °C and above */
function heat(rise: number) {
  const t = Math.min(Math.max((rise - 10) / 50, 0), 1);
  const mix = (a: number[], b: number[], u: number) => a.map((x, i) => Math.round(x + (b[i] - x) * u));
  const c = t < 0.5 ? mix([219, 166, 75], [232, 125, 72], t * 2) : mix([232, 125, 72], [240, 92, 82], (t - 0.5) * 2);
  return `rgb(${c.join(",")})`;
}

function CrossSection({ widthMm, oz, layer, rise }: { widthMm: number; oz: number; layer: Layer; rise: number }) {
  const W = 360;
  const boardTop = 62;
  const boardH = 54;
  /* 40 px per mm, kept inside the board */
  const w = Math.min(Math.max(widthMm * 40, 4), 300);
  const t = 3 + oz * 3.2;
  const x = (W - w) / 2;
  const y = layer === "external" ? boardTop - t : boardTop + boardH / 2 - t / 2;
  const color = heat(rise);
  const glow = Math.min(Math.max((rise - 5) / 60, 0.15), 0.9);
  return (
    <svg viewBox={`0 0 ${W} 150`} className="tl-xsec" role="img" aria-label={`Cross-section: a ${sig(widthMm)} mm trace on an ${layer === "external" ? "outer" : "inner"} layer`}>
      <defs>
        <pattern id="tl-fr4" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" strokeOpacity="0.045" strokeWidth="1.2" />
        </pattern>
        <filter id="tl-heat" x="-30%" y="-200%" width="160%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* the laminate, with the other copper layers drawn faint */}
      <rect x={12} y={boardTop} width={W - 24} height={boardH} rx={4} fill="#221c2b" />
      <rect x={12} y={boardTop} width={W - 24} height={boardH} rx={4} fill="url(#tl-fr4)" />
      {layer === "external" ? (
        <rect x={12} y={boardTop + boardH} width={W - 24} height={3} fill="#c27c4b" opacity={0.3} />
      ) : (
        <>
          <rect x={12} y={boardTop - 3} width={W - 24} height={3} fill="#c27c4b" opacity={0.3} />
          <rect x={12} y={boardTop + boardH} width={W - 24} height={3} fill="#c27c4b" opacity={0.3} />
        </>
      )}
      {/* the trace, and the heat it gives off */}
      <rect x={x} y={y - 2} width={w} height={t + 4} fill={color} opacity={glow} filter="url(#tl-heat)" />
      <rect x={x} y={y} width={w} height={t} rx={1} fill={color} />
      {/* its width, dimensioned */}
      <g stroke="#eae6da" strokeOpacity="0.55" strokeWidth="1">
        <line x1={x} y1={22} x2={x} y2={y - 4} strokeDasharray="2 3" />
        <line x1={x + w} y1={22} x2={x + w} y2={y - 4} strokeDasharray="2 3" />
        <line x1={x} y1={26} x2={x + w} y2={26} />
        <path d={`M${x} 26 l5 -3 v6 Z M${x + w} 26 l-5 -3 v6 Z`} fill="#eae6da" fillOpacity="0.55" stroke="none" />
      </g>
      <text x={W / 2} y={17} textAnchor="middle" fontSize="12" fill="#f4efe6" style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}>
        {sig(widthMm)} mm
      </text>
      <text x={W - 16} y={boardTop + boardH + 22} textAnchor="end" fontSize="10.5" fill="#8f8675" style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}>
        {layer === "external" ? "outer layer" : "inner layer"} · {oz} oz copper · drawn to scale
      </text>
    </svg>
  );
}

export default function TraceCalculator() {
  const [mode, setMode] = useState<"width" | "current">("width");
  const [amps, setAmps] = useState("2");
  const [width, setWidth] = useState("0.5");
  const [rise, setRise] = useState("10");
  const [oz, setOz] = useState(1);
  const [layer, setLayer] = useState<Layer>("external");
  const [ambient, setAmbient] = useState("25");
  const [length, setLength] = useState("50");

  const r = useMemo(
    () =>
      solveTrace({
        mode,
        amps: num(amps),
        widthMm: num(width),
        rise: num(rise),
        oz,
        layer,
        ambient: num(ambient),
        lengthMm: num(length),
      }),
    [mode, amps, width, rise, oz, layer, ambient, length]
  );

  const bad = (s: string, allowZero = false) => {
    const v = num(s);
    return !Number.isFinite(v) || (allowZero ? v < 0 : v <= 0);
  };

  return (
    <div className="tl-grid">
      <div className="card card-static tl-panel">
        <Seg
          label="Find"
          value={mode}
          onChange={setMode}
          options={[
            { id: "width", label: "Width for a current" },
            { id: "current", label: "Current for a width" },
          ]}
        />
        {mode === "width" ? (
          <NumField label="Current" unit="A" value={amps} onChange={setAmps} invalid={bad(amps)} />
        ) : (
          <NumField label="Trace width" unit="mm" value={width} onChange={setWidth} invalid={bad(width)} />
        )}
        <NumField
          label="Temperature rise allowed"
          unit="°C"
          value={rise}
          onChange={setRise}
          invalid={bad(rise)}
          hint="How much hotter than the board around it the trace may run. 10 °C is the usual, comfortable choice."
        />
        <Seg label="Copper weight" value={oz} onChange={setOz} options={OZ.map((o) => ({ id: o, label: `${o} oz` }))} />
        <Seg
          label="Layer"
          value={layer}
          onChange={setLayer}
          options={[
            { id: "external", label: "Outer layer" },
            { id: "internal", label: "Inner layer" },
          ]}
        />
        <div className="tl-pair">
          <NumField label="Ambient" unit="°C" value={ambient} onChange={setAmbient} invalid={!Number.isFinite(num(ambient))} />
          <NumField label="Trace length" unit="mm" value={length} onChange={setLength} invalid={bad(length)} />
        </div>
      </div>

      <div className="card card-static tl-panel tl-out" aria-live="polite">
        {r ? (
          <>
            {mode === "width" ? (
              <Stat accent label="Minimum trace width" value={sig(r.widthMm)} unit="mm" note={`${sig(r.widthMil)} mil, for ${sig(r.amps)} A at a ${num(rise)} °C rise`} />
            ) : (
              <Stat accent label="Current it can carry" value={sig(r.amps)} unit="A" note={`with a ${num(rise)} °C rise, ${sig(r.widthMil)} mil wide`} />
            )}
            <CrossSection widthMm={r.widthMm} oz={oz} layer={layer} rise={num(rise)} />
            <div className="tl-rows">
              <Row label="Cross-section" value={`${sig(r.areaMm2)} mm² · ${sig(r.areaMil2)} mil²`} />
              <Row label="Copper thickness" value={`${sig(r.thicknessUm, 3)} µm`} />
              <Row
                label={layer === "external" ? "On an inner layer instead" : "On an outer layer instead"}
                value={`${sig(r.otherLayerWidthMm)} mm`}
                sub="same current and rise"
              />
              <Row label="Resistance" value={`${sig(r.resistanceMohm)} mΩ`} sub={`at ${sig(num(ambient) + num(rise))} °C, over ${num(length)} mm`} />
              <Row label="Voltage drop" value={`${sig(r.dropMv)} mV`} />
              <Row label="Power lost as heat" value={`${sig(r.lossMw)} mW`} />
            </div>
            <Warnings items={r.warnings} />
          </>
        ) : (
          <p className="tl-empty">Fill in every field with a number above zero to see the result.</p>
        )}
      </div>
    </div>
  );
}
