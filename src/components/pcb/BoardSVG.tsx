import { PCB } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   BoardSVG — a small, reusable kit for drawing realistic 2-layer PCBs as
   inline SVG. Everything is grouped into four "gerber" layers (mask / copper
   / silk / drill) so a board can be cross-faded into a gerber-viewer look.
   ════════════════════════════════════════════════════════════════════════ */

export type GerberLayer = "all" | "copper" | "silk" | "mask" | "drill";

export type IC = {
  x: number; y: number; w: number; h: number; ref: string;
  pins?: "lr" | "tb" | "quad" | "castellated";
  module?: boolean; // ESP32-style module w/ antenna keep-out
};
export type Passive = { x: number; y: number; ref: string; o?: "h" | "v" };
export type Conn = { x: number; y: number; w: number; h: number; ref: string; label?: string };
export type Led = { x: number; y: number; ref: string; color?: string };
export type Hole = { x: number; y: number };
export type Via = { x: number; y: number };
export type Trace = { d: string; kind?: "sig" | "pwr" | "gnd" | "bus" };
export type Pour = { x: number; y: number; w: number; h: number };
export type Matrix = { x: number; y: number; cols: number; rows: number; cell: number };

export type BoardLayout = {
  w: number; h: number;
  pours?: Pour[];
  traces?: Trace[];
  ics?: IC[];
  passives?: Passive[];
  conns?: Conn[];
  leds?: Led[];
  matrix?: Matrix;
  holes?: Hole[];
  vias?: Via[];
};

function layerOpacity(layer: GerberLayer) {
  switch (layer) {
    case "copper": return { mask: 0.32, copper: 1, silk: 0.16, drill: 0.85 };
    case "silk": return { mask: 0.45, copper: 0.22, silk: 1, drill: 0.55 };
    case "mask": return { mask: 1, copper: 0.5, silk: 0.7, drill: 0.65 };
    case "drill": return { mask: 0.28, copper: 0.22, silk: 0.22, drill: 1 };
    default: return { mask: 1, copper: 1, silk: 1, drill: 1 };
  }
}

function traceColor(kind: Trace["kind"], powered: boolean) {
  if (kind === "bus") return PCB.comm;
  if (kind === "gnd") return powered ? PCB.copperBright : PCB.copper;
  return powered ? PCB.copperBright : PCB.copper;
}

export function BoardArt({
  layout, layer = "all", powered = false, accent = PCB.green, idns, decals, label,
}: {
  layout: BoardLayout;
  layer?: GerberLayer;
  powered?: boolean;
  accent?: string;
  idns: string;
  /** dynamic / interaction overlays drawn in the same viewBox coordinate space */
  decals?: React.ReactNode;
  /** accessible name announced to screen readers */
  label?: string;
}) {
  const { w, h } = layout;
  const op = layerOpacity(layer);
  const padFill = `url(#${idns}-enig)`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: "block" }} role="img"
      aria-label={label ?? "printed circuit board layout"}>
      <defs>
        <radialGradient id={`${idns}-enig`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={PCB.enigBright} />
          <stop offset="60%" stopColor={PCB.enig} />
          <stop offset="100%" stopColor="#a07d1f" />
        </radialGradient>
        <linearGradient id={`${idns}-mask`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PCB.soldermaskLit} />
          <stop offset="55%" stopColor={PCB.soldermask} />
          <stop offset="100%" stopColor="#0f091a" />
        </linearGradient>
        <pattern id={`${idns}-pour`} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="transparent" />
          <line x1="0" y1="0" x2="0" y2="6" stroke={PCB.copper} strokeWidth="1" opacity="0.5" />
        </pattern>
      </defs>

      {/* ── MASK layer : board surface + pours ───────────────────────────── */}
      <g opacity={op.mask} style={{ transition: "opacity 0.35s ease" }}>
        <rect x="2" y="2" width={w - 4} height={h - 4} rx="7"
          fill={`url(#${idns}-mask)`} stroke="#160e24" strokeWidth="1.5" />
        {(layout.pours ?? []).map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx="3"
            fill={`url(#${idns}-pour)`} opacity={powered ? 0.9 : 0.6} />
        ))}
      </g>

      {/* ── COPPER layer : traces + pads ─────────────────────────────────── */}
      <g opacity={op.copper} style={{ transition: "opacity 0.35s ease" }}>
        {(layout.traces ?? []).map((t, i) => (
          <path key={i} d={t.d} fill="none"
            stroke={traceColor(t.kind, powered)}
            strokeWidth={t.kind === "pwr" ? 3 : t.kind === "gnd" ? 2.4 : 1.6}
            strokeLinecap="round" strokeLinejoin="round"
            opacity={t.kind === "bus" ? 0.9 : 0.85} />
        ))}
        {/* energized green data pulse riding the buses */}
        {powered && (layout.traces ?? []).filter((t) => t.kind === "bus" || t.kind === "sig").map((t, i) => (
          <path key={`p${i}`} className="pcb-pulse" d={t.d} fill="none"
            stroke={accent} strokeWidth="1.4" strokeLinecap="round" opacity="0.9"
            strokeDasharray="3 10" />
        ))}
        {/* IC pin pads */}
        {(layout.ics ?? []).map((ic, i) => <ICPads key={i} ic={ic} fill={padFill} />)}
        {/* passive pads */}
        {(layout.passives ?? []).map((p, i) => (
          <g key={i}>
            <rect x={p.o === "v" ? p.x - 2.2 : p.x - 6} y={p.o === "v" ? p.y - 6 : p.y - 2.2}
              width={p.o === "v" ? 4.4 : 4} height={p.o === "v" ? 4 : 4.4} rx="0.8" fill={padFill} />
            <rect x={p.o === "v" ? p.x - 2.2 : p.x + 2} y={p.o === "v" ? p.y + 2 : p.y - 2.2}
              width={p.o === "v" ? 4.4 : 4} height={p.o === "v" ? 4 : 4.4} rx="0.8" fill={padFill} />
          </g>
        ))}
      </g>

      {/* ── SILK layer : outlines, refdes, board frame, mounting rings ────── */}
      <g opacity={op.silk} fontFamily="var(--font-geist-mono), monospace" style={{ transition: "opacity 0.35s ease" }}>
        <rect x="6" y="6" width={w - 12} height={h - 12} rx="4"
          fill="none" stroke={PCB.silk} strokeWidth="0.7" opacity="0.55" />
        {(layout.ics ?? []).map((ic, i) => (
          <g key={i}>
            <rect x={ic.x} y={ic.y} width={ic.w} height={ic.h} rx={ic.module ? 2 : 1.5}
              fill={ic.module ? "#15110b" : "#191512"}
              stroke={PCB.silk} strokeWidth="0.7" opacity="0.92" />
            {ic.module && (
              <>
                {/* antenna keep-out hatch */}
                <rect x={ic.x + ic.w - 14} y={ic.y + 2} width="12" height={ic.h - 4} rx="1"
                  fill="none" stroke={PCB.silk} strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.6" />
                <text x={ic.x + ic.w - 8} y={ic.y + ic.h / 2} fontSize="2.4" fill={PCB.silk}
                  opacity="0.6" textAnchor="middle" transform={`rotate(90 ${ic.x + ic.w - 8} ${ic.y + ic.h / 2})`}>
                  ANT KEEPOUT
                </text>
                {/* pin-1 dot */}
                <circle cx={ic.x + 3} cy={ic.y + 3} r="1" fill={PCB.silk} opacity="0.9" />
              </>
            )}
            <text x={ic.x + ic.w / 2} y={ic.y + ic.h / 2 + 1.4} fontSize="3.4"
              fill={PCB.silk} textAnchor="middle" opacity="0.85">{ic.ref}</text>
          </g>
        ))}
        {(layout.passives ?? []).map((p, i) => (
          <text key={i} x={p.x} y={p.o === "v" ? p.y - 8 : p.y - 4} fontSize="2.6"
            fill={PCB.silk} textAnchor="middle" opacity="0.8">{p.ref}</text>
        ))}
        {(layout.conns ?? []).map((c, i) => (
          <g key={i}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="1"
              fill="#191512" stroke={PCB.silk} strokeWidth="0.7" opacity="0.9" />
            <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 1.2} fontSize="3" fill={PCB.silk}
              textAnchor="middle" opacity="0.85">{c.ref}</text>
          </g>
        ))}
      </g>

      {/* connector through-hole pads sit on copper+drill */}
      <g opacity={Math.max(op.copper, op.drill)} style={{ transition: "opacity 0.35s ease" }}>
        {(layout.conns ?? []).flatMap((c, i) => {
          const n = Math.max(2, Math.round(c.w / 6));
          return Array.from({ length: n }).map((_, k) => (
            <g key={`${i}-${k}`}>
              <circle cx={c.x + 4 + k * ((c.w - 8) / (n - 1))} cy={c.y + c.h + 4} r="2.1" fill={padFill} />
              <circle cx={c.x + 4 + k * ((c.w - 8) / (n - 1))} cy={c.y + c.h + 4} r="0.8" fill={PCB.drill} />
            </g>
          ));
        })}
      </g>

      {/* ── LEDs (power-good / matrix) ───────────────────────────────────── */}
      <g opacity={Math.max(op.copper, op.silk)} style={{ transition: "opacity 0.35s ease" }}>
        {(layout.leds ?? []).map((l, i) => {
          const c = l.color ?? accent;
          return (
            <g key={i}>
              <rect x={l.x - 3} y={l.y - 2} width="6" height="4" rx="0.6" fill="#0c0c0c"
                stroke={PCB.silk} strokeWidth="0.4" opacity="0.8" />
              <circle cx={l.x} cy={l.y} r={powered ? 2.4 : 1.4} fill={powered ? c : "#1c1c1c"}
                opacity={powered ? 1 : 0.6} style={powered ? { filter: `drop-shadow(0 0 4px ${c})` } : undefined} />
            </g>
          );
        })}
        {layout.matrix && <LedMatrix m={layout.matrix} powered={powered} />}
      </g>

      {/* ── DECALS : dynamic interaction overlays ────────────────────────── */}
      {decals}

      {/* ── DRILL layer : mounting holes + vias ──────────────────────────── */}
      <g opacity={op.drill} style={{ transition: "opacity 0.35s ease" }}>
        {(layout.holes ?? []).map((hole, i) => (
          <g key={i}>
            <circle cx={hole.x} cy={hole.y} r="4.2" fill={padFill} />
            <circle cx={hole.x} cy={hole.y} r="2.4" fill={PCB.drill} />
          </g>
        ))}
        {(layout.vias ?? []).map((v, i) => (
          <g key={i}>
            <circle cx={v.x} cy={v.y} r="1.5" fill={padFill} />
            <circle cx={v.x} cy={v.y} r="0.6" fill={PCB.drill} />
          </g>
        ))}
      </g>
    </svg>
  );
}

function ICPads({ ic, fill }: { ic: IC; fill: string }) {
  const pads: { x: number; y: number; w: number; h: number }[] = [];
  const pins = ic.pins ?? "lr";
  const count = ic.module ? 7 : 5;
  if (pins === "lr" || pins === "quad" || pins === "castellated") {
    for (let i = 0; i < count; i++) {
      const y = ic.y + (ic.h / (count + 1)) * (i + 1);
      pads.push({ x: ic.x - 3, y: y - 1.3, w: 4, h: 2.6 });
      pads.push({ x: ic.x + ic.w - 1, y: y - 1.3, w: 4, h: 2.6 });
    }
  }
  if (pins === "tb" || pins === "quad") {
    for (let i = 0; i < count; i++) {
      const x = ic.x + (ic.w / (count + 1)) * (i + 1);
      pads.push({ x: x - 1.3, y: ic.y - 3, w: 2.6, h: 4 });
      pads.push({ x: x - 1.3, y: ic.y + ic.h - 1, w: 2.6, h: 4 });
    }
  }
  return (
    <g>
      {pads.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx="0.6" fill={fill} />
      ))}
    </g>
  );
}

function LedMatrix({ m, powered }: { m: Matrix; powered: boolean }) {
  const cells = [];
  const palette = ["#ff5d73", "#ffb000", "#3ddc84", "#5ec8e5", "#b98aff", "#ff8ad1"];
  for (let r = 0; r < m.rows; r++) {
    for (let c = 0; c < m.cols; c++) {
      const idx = r * m.cols + c;
      const color = palette[idx % palette.length];
      cells.push(
        <rect key={idx} className="pcb-led-cell" x={m.x + c * m.cell} y={m.y + r * m.cell}
          width={m.cell - 1} height={m.cell - 1} rx="0.6"
          fill={powered ? color : "#141414"}
          opacity={powered ? 0.55 + 0.45 * Math.abs(Math.sin(idx)) : 0.5}
          style={powered ? { filter: `drop-shadow(0 0 1.5px ${color})`, animation: `ledShimmer 2.4s ease-in-out ${(idx % 7) * 0.18}s infinite` } : undefined} />
      );
    }
  }
  return <g>{cells}</g>;
}
