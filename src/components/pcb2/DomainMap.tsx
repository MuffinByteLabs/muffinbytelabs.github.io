/* ════════════════════════════════════════════════════════════════════════
   PCB 2 — the isolation-domain map.

   A zoning drawing, not a render: it shows which part of the 140 × 100 mm
   board belongs to which electrical domain, where field wiring lands, and
   which parts are allowed to straddle a barrier. Authored in millimetres
   inside a 5× group, so the board really is 140 × 100 here and an 8 mm
   barrier really is 8 mm wide.

   Static SVG, no client JavaScript.
   ════════════════════════════════════════════════════════════════════════ */

type Region = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  color: string;
  /** an island: dashed outline, because it is a separate reference */
  island?: boolean;
  /** rotate the label for tall, narrow islands */
  tall?: boolean;
  /** push the label in, clear of a part straddling the island edge */
  inset?: number;
};

const REGIONS: Region[] = [
  { x: 3, y: 6, w: 31, h: 20, title: "Input protection", sub: "TVS · eFuse · FET", color: "var(--d-field)" },
  { x: 37, y: 6, w: 33, h: 20, title: "4 × high-side", sub: "switch + diodes", color: "var(--d-main)" },
  { x: 68, y: 30, w: 38, h: 28, title: "Service power", sub: "buck · mux · ±analog", color: "var(--d-field)" },
  { x: 28, y: 32, w: 36, h: 30, title: "MCU · logic", sub: "STM32G474VET6", color: "var(--d-logic)" },
  { x: 28, y: 66, w: 76, h: 27, title: "Analog front end", sub: "ADC · protectors · shunts · DAC", color: "var(--d-analog)" },
  { x: 2.5, y: 36, w: 13.5, h: 38, title: "DI ×4", sub: "DI_COM", color: "var(--d-di)", island: true, tall: true },
  { x: 118, y: 32, w: 19, h: 21, title: "RS-485", sub: "RS485_REF", color: "var(--d-rs485)", island: true, inset: 4 },
  { x: 118, y: 61, w: 19, h: 23, title: "CAN FD", sub: "CAN_REF", color: "var(--d-can)", island: true, inset: 4 },
  { x: 74, y: 2.5, w: 17, h: 12, title: "K1", sub: "COM·NO·NC", color: "var(--d-relay)", island: true },
  { x: 96, y: 2.5, w: 17, h: 12, title: "K2", sub: "COM·NO·NC", color: "var(--d-relay)", island: true },
];

/* barriers: hatched keep-out bands, on every copper layer */
const BARRIERS = [
  { x: 109, y: 29, w: 8, h: 58, label: "8 mm barrier", rot: true },
  { x: 117, y: 53.5, w: 23, h: 7, label: "island gap", rot: false },
  { x: 16, y: 33, w: 6, h: 44, label: "DI barrier", rot: true },
  { x: 72.5, y: 14.5, w: 42, h: 2, label: "", rot: false },
];

/* parts that ARE the barrier, drawn straddling it */
const STRADDLE = [
  { x: 102, y: 35, w: 18, h: 6.5, label: "ISO1410" },
  { x: 102, y: 43.5, w: 18, h: 6.5, label: "UCC12050" },
  { x: 102, y: 65, w: 18, h: 6.5, label: "ISO1042" },
  { x: 102, y: 73.5, w: 18, h: 6.5, label: "UCC12050" },
  { x: 12, y: 42, w: 15, h: 6, label: "ISO1212" },
  { x: 12, y: 62, w: 15, h: 6, label: "ISO1212" },
];

/* pluggable field terminals, sitting proud of the board edge */
const TERMINALS = [
  { x: 6, y: -3.5, w: 12, h: 7, n: 2, label: "VIN" },
  { x: 38.5, y: -3.5, w: 29, h: 7, n: 5, label: "DO1–4 · RTN" },
  { x: 75, y: -3.5, w: 15, h: 6.5, n: 3, label: "" },
  { x: 97, y: -3.5, w: 15, h: 6.5, n: 3, label: "" },
  { x: 136.5, y: 34.5, w: 7, h: 15.5, n: 3, label: "", vertical: true },
  { x: 136.5, y: 64.5, w: 7, h: 15.5, n: 3, label: "", vertical: true },
  { x: -3.5, y: 41, w: 7, h: 28, n: 5, label: "", vertical: true },
  { x: 31, y: 96.5, w: 42, h: 7, n: 8, label: "AI_V × 2 · AI_I × 2 · RTN" },
  { x: 80, y: 96.5, w: 12, h: 7, n: 2, label: "AO" },
];

export default function DomainMap({
  id = "dmap",
  className = "",
  fit = false,
}: {
  id?: string;
  className?: string;
  /** scale to the column instead of scrolling sideways on a phone */
  fit?: boolean;
}) {
  return (
    <figure className={`m-0 ${className}`}>
      {/* the map keeps a 600 px minimum so its labels stay legible, which
          means a phone has to pan it — say so, as the architecture drawing does */}
      {!fit && (
        <p className="sm:hidden mt-0 mb-2.5 text-right text-[11.5px]" style={{ color: "var(--text-3)" }}>
          Swipe the map sideways &rarr;
        </p>
      )}
      <div
        className="scroll-x rounded-xl"
        style={{ background: "var(--bg-alt)", border: "1px solid var(--border-soft)" }}
        tabIndex={fit ? undefined : 0}
        role={fit ? undefined : "region"}
        aria-label={fit ? undefined : "Isolation-domain map — scrolls sideways on a narrow screen"}
      >
        <svg
          viewBox="0 0 770 604"
          className="block w-full h-auto"
          style={{ minWidth: fit ? 0 : 600 }}
          role="img"
          aria-labelledby={`${id}-t ${id}-d`}
        >
          <title id={`${id}-t`}>PCB 2 isolation-domain map</title>
          <desc id={`${id}-d`}>
            The 140 by 100 millimetre board divided into domains. Main ground covers the input
            protection, high-side outputs, MCU, service power and analog front end. Separate islands
            hold the four digital inputs on the left edge, RS-485 and CAN FD on the right edge behind
            an 8 millimetre barrier, and the two relay contact sets on the top edge. Only isolators and
            isolated supplies straddle the barriers.
          </desc>
          <defs>
            <pattern id={`${id}-hatch`} width="1.5" height="1.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="1.5" stroke="rgba(240,113,103,0.55)" strokeWidth="0.35" />
            </pattern>
            <pattern id={`${id}-grid`} width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M5 0H0V5" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.15" />
            </pattern>
            <linearGradient id={`${id}-board`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1b1915" />
              <stop offset="100%" stopColor="#141210" />
            </linearGradient>
          </defs>

          <g transform="translate(35 35) scale(5)">
            {/* the board */}
            <rect x={0} y={0} width={140} height={100} rx={3} fill={`url(#${id}-board)`} stroke="#4a4239" strokeWidth={0.3} />
            <rect x={0} y={0} width={140} height={100} rx={3} fill={`url(#${id}-grid)`} />

            {/* main ground note, lower right, in the clear */}
            <text x={109} y={95} fontSize={1.9} fill="var(--text-3)" className="svg-mono" textAnchor="start">
              MAIN_GND
            </text>
            <text x={109} y={97.6} fontSize={1.6} fill="var(--text-3)" className="svg-mono" opacity={0.75}>
              everything outside an island
            </text>

            {/* regions */}
            {REGIONS.map((r) => (
              <g key={r.title}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx={1.6}
                  fill={r.color}
                  fillOpacity={r.island ? 0.13 : 0.08}
                  stroke={r.color}
                  strokeOpacity={r.island ? 0.95 : 0.5}
                  strokeWidth={r.island ? 0.35 : 0.25}
                  strokeDasharray={r.island ? "1.4 0.9" : undefined}
                />
                {r.tall ? (
                  <g transform={`translate(${r.x + 4.6} ${r.y + r.h - 2.5}) rotate(-90)`}>
                    <text fontSize={2.8} fontWeight={600} fill="var(--text)" className="svg-sans">
                      {r.title}
                    </text>
                    <text y={3.2} fontSize={1.9} fill={r.color} className="svg-mono">
                      {r.sub}
                    </text>
                  </g>
                ) : (
                  <>
                    <text x={r.x + (r.inset ?? 2)} y={r.y + 4.4} fontSize={r.w < 20 ? 2.6 : 3} fontWeight={600} fill="var(--text)" className="svg-sans">
                      {r.title}
                    </text>
                    {r.sub && (
                      <text x={r.x + (r.inset ?? 2)} y={r.y + 7.6} fontSize={r.w < 20 ? 1.75 : 2.05} fill={r.color} className="svg-mono">
                        {r.sub}
                      </text>
                    )}
                  </>
                )}
              </g>
            ))}

            {/* the MCU itself, LQFP100 to scale: 14 mm body */}
            <g>
              <rect x={39} y={41} width={14} height={14} rx={0.8} fill="#0f0e0c" stroke="var(--border-strong)" strokeWidth={0.25} />
              <g stroke="#6d6458" strokeWidth={0.22}>
                {Array.from({ length: 13 }, (_, i) => 41.8 + i * 1.03).map((p) => (
                  <g key={p}>
                    <line x1={37.9} x2={39} y1={p} y2={p} />
                    <line x1={53} x2={54.1} y1={p} y2={p} />
                    <line x1={p} x2={p} y1={39.9} y2={41} />
                    <line x1={p} x2={p} y1={55} y2={56.1} />
                  </g>
                ))}
              </g>
              <circle cx={40.5} cy={42.5} r={0.5} fill="none" stroke="var(--text-3)" strokeWidth={0.15} />
            </g>

            {/* converters, suggested by their inductors */}
            {[
              { x: 72, y: 46.5 },
              { x: 81, y: 46.5 },
              { x: 90, y: 46.5 },
            ].map((l) => (
              <rect key={l.x} x={l.x} y={l.y} width={6.5} height={6.5} rx={1} fill="#24201b" stroke="var(--d-field)" strokeOpacity={0.6} strokeWidth={0.2} />
            ))}

            {/* relay bodies straddle their contact islands */}
            {[74, 96].map((x, i) => (
              <g key={x}>
                <rect x={x + 1} y={12.5} width={15} height={13} rx={0.8} fill="#1e1b17" stroke="var(--d-relay)" strokeOpacity={0.7} strokeWidth={0.25} />
                <text x={x + 8.5} y={21.5} fontSize={2.2} textAnchor="middle" fill="var(--text-2)" className="svg-mono">
                  {`G5Q · K${i + 1}`}
                </text>
              </g>
            ))}

            {/* barrier bands */}
            {BARRIERS.map((b, i) => (
              <g key={i}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="rgba(240,113,103,0.05)" />
                <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={`url(#${id}-hatch)`} />
                {b.label &&
                  (b.rot ? (
                    <text
                      transform={`translate(${b.x + b.w / 2 + 0.7} ${b.y + b.h / 2}) rotate(-90)`}
                      fontSize={1.65}
                      textAnchor="middle"
                      fill="#f3a39c"
                      className="svg-mono"
                    >
                      {b.label}
                    </text>
                  ) : (
                    <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 0.7} fontSize={1.8} textAnchor="middle" fill="#f3a39c" className="svg-mono">
                      {b.label}
                    </text>
                  ))}
              </g>
            ))}

            {/* parts that straddle a barrier — the only things allowed across */}
            {STRADDLE.map((p, i) => (
              <g key={i}>
                <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={0.6} fill="#100f0d" stroke="var(--text-2)" strokeWidth={0.22} />
                <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 0.75} fontSize={1.85} textAnchor="middle" fill="var(--text)" className="svg-mono">
                  {p.label}
                </text>
              </g>
            ))}

            {/* USB-C and SWD, the service edge */}
            <g>
              <rect x={-1.2} y={81} width={8.5} height={9} rx={1.2} fill="#2a2620" stroke="#8a8170" strokeWidth={0.25} />
              <text x={9.2} y={86.6} fontSize={2} fill="var(--text-2)" className="svg-mono">USB-C</text>
              <rect x={14} y={88.5} width={8} height={4} rx={0.4} fill="#151310" stroke="#8a8170" strokeWidth={0.22} />
              <text x={23.5} y={91.6} fontSize={2} fill="var(--text-2)" className="svg-mono">SWD</text>
            </g>

            {/* terminals */}
            {TERMINALS.map((t, i) => {
              const v = !!t.vertical;
              const pitch = (v ? t.h : t.w) / t.n;
              return (
                <g key={i}>
                  <rect x={t.x} y={t.y} width={t.w} height={t.h} rx={0.8} fill="#2b3a2e" stroke="#5f7d63" strokeWidth={0.25} />
                  {Array.from({ length: t.n }, (_, k) => (
                    <circle
                      key={k}
                      cx={v ? t.x + t.w / 2 : t.x + pitch * (k + 0.5)}
                      cy={v ? t.y + pitch * (k + 0.5) : t.y + t.h / 2}
                      r={1.3}
                      fill="#1a2320"
                      stroke="#a7c4aa"
                      strokeWidth={0.22}
                    />
                  ))}
                  {t.label && (
                    <text
                      x={t.x + t.w / 2}
                      y={t.y < 0 ? t.y - 1.2 : t.y + t.h + 3}
                      fontSize={1.9}
                      textAnchor="middle"
                      fill="var(--text-3)"
                      className="svg-mono"
                    >
                      {t.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* scale bar */}
          <g transform="translate(35 590)" className="svg-mono" fontSize={10.5} fill="var(--text-3)">
            <line x1={0} x2={100} y1={0} y2={0} stroke="var(--text-3)" strokeWidth={1} />
            <line x1={0} x2={0} y1={-4} y2={4} stroke="var(--text-3)" />
            <line x1={100} x2={100} y1={-4} y2={4} stroke="var(--text-3)" />
            <text x={110} y={4}>20 mm · board 140 × 100 mm · simplified zoning, not a layout render</text>
          </g>
        </svg>
      </div>
    </figure>
  );
}

/** the colour key, as HTML so it stays legible at any width */
export function DomainLegend() {
  const items = [
    { c: "var(--d-field)", t: "Field power" },
    { c: "var(--d-main)", t: "Main-ground outputs" },
    { c: "var(--d-logic)", t: "MCU & logic" },
    { c: "var(--d-analog)", t: "Analog" },
    { c: "var(--d-di)", t: "DI_COM island" },
    { c: "var(--d-rs485)", t: "RS-485 island" },
    { c: "var(--d-can)", t: "CAN island" },
    { c: "var(--d-relay)", t: "Relay contacts" },
  ];
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 m-0 p-0 list-none">
      {items.map((i) => (
        <li key={i.t} className="inline-flex items-center gap-2 text-[12px]" style={{ color: "var(--text-2)" }}>
          <span aria-hidden className="w-2.5 h-2.5 rounded-[3px]" style={{ background: i.c, opacity: 0.85 }} />
          {i.t}
        </li>
      ))}
      <li className="inline-flex items-center gap-2 text-[12px]" style={{ color: "var(--text-2)" }}>
        <span
          aria-hidden
          className="w-2.5 h-2.5 rounded-[3px]"
          style={{
            background:
              "repeating-linear-gradient(45deg, rgba(240,113,103,0.7) 0 1.5px, transparent 1.5px 3.5px)",
          }}
        />
        Barrier keep-out, all four layers
      </li>
    </ul>
  );
}
