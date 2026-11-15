import type { ClientProject } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   The small drawings beside each client project.

   They are generic on purpose. The designs belong to the clients, so none
   of these is traced from one: each shows the KIND of board it was — a
   dense routed board and its stack, a controller and what hangs off it, a
   limited supply fanning out to its outputs, a protected power path, a
   prototype growing into a product — in the same line style, and nothing
   that could identify whose board it was.

   All five share one 320 × 132 canvas so the cards line up. On a phone the
   canvas is drawn at about its own size, so a label's font size here is
   its size in pixels there: nothing below 8.5.

   Server-rendered inline SVG; no JavaScript.
   ════════════════════════════════════════════════════════════════════════ */

const INK = "var(--text-3)";
const INK2 = "var(--text-2)";
const LINE = "var(--border-strong)";
const GOLD = "var(--accent)";
const OK = "var(--ok)";
const BAD = "var(--danger)";
const PANEL = "var(--surface)";
const CHIP = "var(--surface-3)";
const HOLE = "var(--bg-alt)";
const GOLD_FILL = "var(--accent-soft)";
const GOLD_LINE = "var(--accent-line)";

const LABEL = { className: "svg-mono", fontSize: 9.5, letterSpacing: 0.4, fill: INK } as const;

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M${x1} ${y}H${x2}`} />
      <path d={`M${x2 - 5} ${y - 4.5}L${x2} ${y}L${x2 - 5} ${y + 4.5}`} />
    </g>
  );
}

function Check({ cx, cy, r = 7 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={OK} />
      <path
        d={`M${cx - r * 0.42} ${cy + r * 0.04}l${r * 0.3} ${r * 0.32}l${r * 0.56} ${-r * 0.62}`}
        stroke="#0d0c0b"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
}

/* ── a finished board from above, and the stack it is built on ─────────── */
function BoardArt() {
  const holes: [number, number][] = [
    [24, 24],
    [172, 24],
    [24, 92],
    [172, 92],
  ];
  const passives: [number, number][] = [
    [50, 26],
    [60, 26],
    [116, 26],
    [150, 53],
    [50, 86],
    [60, 86],
    [92, 82],
    [114, 82],
  ];
  const plates = [46, 60, 74, 88];
  return (
    <>
      <rect x={14} y={14} width={168} height={88} rx={9} fill={PANEL} stroke={LINE} />
      {holes.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.6} fill={HOLE} stroke={LINE} />
      ))}

      {/* traces first, so the parts sit on top of them */}
      <g stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M40 46h14l4 4h16" />
        <path d="M40 58h34" />
        <path d="M40 70h14l4-4h16" />
        <path d="M108 46h10l8-8h6" />
        <path d="M108 64h10l8 8h8" />
        <path d="M108 55h56" />
      </g>
      <circle cx={166.5} cy={55} r={2.5} fill={HOLE} stroke={GOLD} strokeWidth={1.3} />

      {/* a connector, three chips and a scatter of passives */}
      <rect x={30} y={38} width={10} height={40} rx={2} fill={CHIP} stroke={INK2} strokeWidth={1.2} />
      <rect x={74} y={38} width={34} height={34} rx={3.5} fill={PANEL} />
      <rect x={74} y={38} width={34} height={34} rx={3.5} fill={GOLD_FILL} stroke={GOLD} strokeWidth={1.3} />
      <circle cx={80.5} cy={44.5} r={1.4} fill={GOLD} />
      <rect x={132} y={29} width={26} height={18} rx={2.5} fill={CHIP} stroke={INK2} strokeWidth={1.2} />
      <rect x={134} y={63} width={22} height={22} rx={2.5} fill={CHIP} stroke={INK2} strokeWidth={1.2} />
      <g fill={INK}>
        {passives.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={7} height={4} rx={1} />
        ))}
      </g>
      <text x={98} y={121} textAnchor="middle" {...LABEL}>
        ≈ 180 PARTS · BOTH SIDES
      </text>

      {/* its four copper layers, the outer two in gold */}
      <text x={252} y={27} textAnchor="middle" {...LABEL} fill={INK2}>
        4 LAYERS
      </text>
      {plates.map((y, i) => {
        const outer = i === 0 || i === plates.length - 1;
        return (
          <path
            key={y}
            d={`M209 ${y}l16-9h70l-16 9z`}
            fill={outer ? GOLD_FILL : PANEL}
            stroke={outer ? GOLD : LINE}
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        );
      })}
      <Check cx={206.5} cy={117} r={6.5} />
      <text x={218} y={121} {...LABEL} fill={OK}>
        0 RULE ERRORS
      </text>
    </>
  );
}

/* ── a controller and what hangs off it ────────────────────────────────── */
function ControllerArt() {
  const inputs: { y: number; label: string }[] = [
    { y: 14, label: "12 V IN" },
    { y: 53, label: "SENSOR" },
    { y: 92, label: "CAN BUS" },
  ];
  const relays = [24, 78];
  return (
    <>
      {inputs.map((b) => (
        <g key={b.label}>
          <rect x={14} y={b.y} width={70} height={26} rx={7} fill={PANEL} stroke={LINE} />
          <text x={49} y={b.y + 16.5} textAnchor="middle" {...LABEL} fill={INK2}>
            {b.label}
          </text>
        </g>
      ))}

      <g stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* the supply, through its fuse */}
        <path d="M84 27h12M114 27h30v7" />
        {/* the sensor */}
        <path d="M84 66h44" />
        {/* the bus, across the isolation barrier */}
        <path d="M84 105h16M112 105h64v-7" />
        {/* out to the relays */}
        <path d="M192 54h22V39h22" />
        <path d="M192 78h22v15h22" />
      </g>
      <rect x={96} y={22.5} width={18} height={9} rx={4.5} fill={HOLE} stroke={GOLD} strokeWidth={1.4} />
      <path d="M102 96v18M110 96v18" stroke={INK2} strokeWidth={1.8} strokeLinecap="round" />
      <text x={117} y={122} {...LABEL} fontSize={8.5}>
        ISOLATED
      </text>

      <rect x={128} y={34} width={64} height={64} rx={10} fill={GOLD_FILL} stroke={GOLD_LINE} />
      <text x={160} y={69.5} textAnchor="middle" {...LABEL} fontSize={10.5} fill={GOLD}>
        ESP32
      </text>

      {relays.map((y) => (
        <g key={y}>
          <rect x={236} y={y} width={70} height={30} rx={7} fill={PANEL} stroke={LINE} />
          <text x={271} y={y + 18.5} textAnchor="middle" {...LABEL} fill={INK2}>
            RELAY
          </text>
        </g>
      ))}
    </>
  );
}

/* ── a limited supply, a controller, and sixteen outputs ───────────────── */
function OutputsArt() {
  const ys = Array.from({ length: 16 }, (_, i) => 30.5 + i * 5);
  return (
    <>
      <text x={14} y={20} {...LABEL}>
        12 V · 10 A
      </text>
      <text x={306} y={20} textAnchor="end" {...LABEL}>
        16 OUTPUTS
      </text>

      <g stroke={GOLD} strokeWidth={1.6} strokeLinecap="round" fill="none">
        <path d="M20 68h18" />
        <path d="M90 68h24" />
        <path d="M190 68h22" />
        <path d="M212 30.5v75" />
      </g>
      <circle cx={17} cy={68} r={3} fill={HOLE} stroke={GOLD} strokeWidth={1.5} />

      {/* the current limit */}
      <rect x={38} y={50} width={52} height={36} rx={8} fill={GOLD_FILL} stroke={GOLD_LINE} />
      <text x={64} y={65.5} textAnchor="middle" {...LABEL} fontSize={8.5} fill={GOLD}>
        CURRENT
      </text>
      <text x={64} y={77} textAnchor="middle" {...LABEL} fontSize={8.5} fill={GOLD}>
        LIMIT
      </text>

      {/* the controller, and the sensors it reads */}
      <rect x={114} y={50} width={76} height={36} rx={8} fill={PANEL} stroke={LINE} />
      <text x={152} y={71.5} textAnchor="middle" {...LABEL} fill={INK2}>
        CONTROLLER
      </text>
      <path d="M152 86v14" stroke={INK2} strokeWidth={1.4} strokeLinecap="round" />
      <rect x={114} y={100} width={76} height={22} rx={7} fill={PANEL} stroke={LINE} />
      <text x={152} y={114.5} textAnchor="middle" {...LABEL} fill={INK2}>
        SENSORS
      </text>

      {/* sixteen outputs off one rail */}
      <g stroke={GOLD} strokeWidth={1.1} strokeLinecap="round">
        {ys.map((y) => (
          <path key={y} d={`M212 ${y}h71`} />
        ))}
      </g>
      <g fill={GOLD}>
        {ys.map((y) => (
          <circle key={y} cx={288} cy={y} r={1.9} />
        ))}
      </g>
    </>
  );
}

/* ── a power path that opens when the far side shorts ──────────────────── */
function ProtectionArt() {
  return (
    <>
      <text x={14} y={20} {...LABEL}>
        20 V · 5 A
      </text>
      <text x={306} y={20} textAnchor="end" {...LABEL}>
        EITHER DIRECTION
      </text>

      <rect x={14} y={38} width={66} height={40} rx={8} fill={PANEL} stroke={LINE} />
      <text x={47} y={61.5} textAnchor="middle" {...LABEL} fill={INK2}>
        SOURCE
      </text>
      <rect x={240} y={38} width={66} height={40} rx={8} fill={PANEL} stroke={LINE} />
      <text x={273} y={61.5} textAnchor="middle" {...LABEL} fill={INK2}>
        DEVICE
      </text>

      {/* the protection stage: two switches back to back */}
      <rect x={110} y={28} width={100} height={60} rx={10} fill={GOLD_FILL} stroke={GOLD_LINE} />
      <text x={160} y={43} textAnchor="middle" {...LABEL} fontSize={9} fill={GOLD}>
        PROTECTION
      </text>
      <g stroke={GOLD} strokeWidth={1.9} strokeLinecap="round" fill="none">
        <path d="M80 58H128" />
        <path d="M128 58l15-8" />
        <path d="M146 58h28" />
        <path d="M174 58l15-8" />
        <path d="M192 58H240" />
      </g>
      <g fill={HOLE} stroke={GOLD} strokeWidth={1.5}>
        <circle cx={128} cy={58} r={2.6} />
        <circle cx={146} cy={58} r={2.6} />
        <circle cx={174} cy={58} r={2.6} />
        <circle cx={192} cy={58} r={2.6} />
      </g>

      {/* a short on the far side */}
      <g stroke={BAD} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M225 58l-4.5 9h9l-4.5 9" />
        <path d="M219 81.5h12M221.5 85h7M224 88.5h2" />
      </g>

      {/* the latch that holds it open */}
      <path d="M160 88v10" stroke={BAD} strokeWidth={1.3} strokeDasharray="2 3" strokeLinecap="round" />
      <rect x={116} y={98} width={88} height={25} rx={7} fill={PANEL} stroke={LINE} />
      <text x={160} y={114} textAnchor="middle" {...LABEL} fontSize={9} fill={INK2}>
        FAULT LATCH
      </text>
    </>
  );
}

/* ── a prototype growing into a product ────────────────────────────────── */
function InstrumentArt() {
  const xs = [14, 93, 172, 251];
  const W = 55;
  const tile = (x: number, gold = false) => (
    <rect x={x} y={16} width={W} height={54} rx={9} fill={PANEL} stroke={gold ? GOLD_LINE : LINE} />
  );
  return (
    /* four tiles and their captions, centred on the canvas */
    <g transform="translate(0 15)">
      {/* 1 · breadboard prototype */}
      {tile(xs[0])}
      <g fill={INK}>
        {[0, 1, 2, 3].flatMap((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => <circle key={`${r}-${c}`} cx={xs[0] + 10.5 + c * 6.8} cy={27 + r * 10.6} r={1.2} />)
        )}
      </g>
      <rect x={xs[0] + 17.5} y={36} width={20} height={14} rx={2.4} fill={CHIP} stroke={INK2} strokeWidth={1.2} />

      {/* 2 · firmware */}
      {tile(xs[1])}
      <g strokeWidth={1.9} strokeLinecap="round">
        <path d={`M${xs[1] + 11} 29h18`} stroke={INK2} />
        <path d={`M${xs[1] + 17} 38h26`} stroke={GOLD} />
        <path d={`M${xs[1] + 17} 47h15`} stroke={INK2} />
        <path d={`M${xs[1] + 11} 56h23`} stroke={INK2} />
      </g>

      {/* 3 · manuals */}
      {tile(xs[2])}
      <path
        d={`M${xs[2] + 15} 26a2 2 0 0 1 2-2h14l9 9v26a2 2 0 0 1-2 2h-21a2 2 0 0 1-2-2z`}
        fill="none"
        stroke={INK2}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path d={`M${xs[2] + 31} 24v9h9`} fill="none" stroke={INK2} strokeWidth={1.4} strokeLinejoin="round" />
      <g stroke={INK} strokeWidth={1.6} strokeLinecap="round">
        <path d={`M${xs[2] + 20} 41h15`} />
        <path d={`M${xs[2] + 20} 47h15`} />
        <path d={`M${xs[2] + 20} 53h9`} />
      </g>

      {/* 4 · the custom board */}
      {tile(xs[3], true)}
      <rect x={xs[3] + 7.5} y={24} width={40} height={38} rx={4.5} fill="none" stroke={GOLD} strokeWidth={1.4} />
      <rect x={xs[3] + 21} y={36} width={14} height={14} rx={2.2} fill={GOLD_FILL} stroke={GOLD} strokeWidth={1.3} />
      <g stroke={GOLD} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={`M${xs[3] + 12} 31h6l3 5`} />
        <path d={`M${xs[3] + 12} 55h6l3-5`} />
        <path d={`M${xs[3] + 35} 43h8`} />
      </g>

      <Arrow x1={xs[0] + W + 5} x2={xs[1] - 5} y={43} />
      <Arrow x1={xs[1] + W + 5} x2={xs[2] - 5} y={43} />
      <Arrow x1={xs[2] + W + 5} x2={xs[3] - 5} y={43} />

      {["PROTOTYPE", "FIRMWARE", "MANUALS", "CUSTOM PCB"].map((t, i) => (
        <text key={t} x={xs[i] + W / 2} y={88} textAnchor="middle" {...LABEL} fontSize={9} fill={i === 3 ? GOLD : INK2}>
          {t}
        </text>
      ))}
    </g>
  );
}

const ART = {
  board: {
    draw: BoardArt,
    label:
      "Drawing: a routed circuit board seen from above, with a connector, three chips and their traces, beside its four copper layers and a check mark for zero rule errors",
  },
  controller: {
    draw: ControllerArt,
    label:
      "Block diagram: a fused 12 volt input, a sensor input and an isolated CAN bus feed an ESP32, which drives two relays",
  },
  outputs: {
    draw: OutputsArt,
    label:
      "Block diagram: a 12 volt, 10 amp supply passes a current limit into a controller that reads sensors and fans out to sixteen outputs",
  },
  protection: {
    draw: ProtectionArt,
    label:
      "Diagram: a power path from source to device through a protection stage of two switches, which a fault latch opens when the far side shorts",
  },
  instrument: {
    draw: InstrumentArt,
    label: "Diagram: a project in four stages: prototype, firmware, manuals and the custom board",
  },
} as const;

export default function ClientArt({ art }: { art: ClientProject["art"] }) {
  const { draw: Draw, label } = ART[art];
  return (
    <svg viewBox="0 0 320 132" className="block w-full h-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <Draw />
    </svg>
  );
}
