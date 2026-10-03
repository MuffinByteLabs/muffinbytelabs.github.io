"use client";

import { useId, useState } from "react";

/* ════════════════════════════════════════════════════════════════════════
   PCB 2 — system architecture, as a traceable block diagram.

   Field terminals on the left, the STM32 in the middle, output stages and
   their terminals on the right, the power chain across the top and the
   hardware permission logic along the bottom. Power rails that feed a block
   from elsewhere are shown the way a schematic shows them — as a net label
   on the block — rather than as a wire crossing the whole drawing.

   "Trace a path" is the same idea as PCB 1's net tracer: pick a path and
   everything not on it steps back, while the wires on it carry current.
   It is a functional diagram — dependencies, not a wiring diagram.
   ════════════════════════════════════════════════════════════════════════ */

type Domain = "field" | "logic" | "analog" | "di" | "main" | "relay" | "rs485" | "can" | "safety";

const COLOR: Record<Domain, string> = {
  field: "var(--d-field)",
  logic: "var(--d-logic)",
  analog: "var(--d-analog)",
  di: "var(--d-di)",
  main: "var(--d-main)",
  relay: "var(--d-relay)",
  rs485: "var(--d-rs485)",
  can: "var(--d-can)",
  safety: "var(--d-safety)",
};

/* ── geometry ───────────────────────────────────────────────────────────── */
const W = 1080;
const H = 612;
const C0 = { x: 16, w: 140 };
const C1 = { x: 192, w: 190 };
const C2 = { x: 436, w: 200 };
const C3 = { x: 694, w: 196 };
const C4 = { x: 926, w: 138 };
const GATE_X = 664;
const ROW = { P: 20, A: 124, B: 202, C: 280, D: 358, E: 436, F: 530 };
const BH = 60;
const mid = (y: number) => y + BH / 2;

type Block = {
  id: string;
  col: { x: number; w: number };
  y: number;
  h?: number;
  title: string;
  sub?: string;
  domain: Domain;
  terminal?: "left" | "right";
  /** a net label riding on the block's top edge — the rail feeding it */
  tag?: string;
  /** an isolation barrier inside the block, on its field-facing side */
  split?: "left" | "right";
};

const BLOCKS: Block[] = [
  /* power chain */
  { id: "vin", col: C0, y: ROW.P, title: "9–30 V DC", sub: "VIN+ · VIN−", domain: "field", terminal: "left" },
  { id: "prot", col: C1, y: ROW.P, title: "Input protection", sub: "fuse · TVS · FET · eFuse", domain: "field" },
  { id: "vfield", col: C2, y: ROW.P, title: "VFIELD", sub: "protected field rail", domain: "field" },
  { id: "buck", col: C3, y: ROW.P, title: "5 V field buck", sub: "LMR38020 → 5V_FIELD", domain: "field" },
  { id: "aux", col: C4, y: ROW.P, title: "Aux rails", sub: "±analog · iso 5 V", domain: "field" },

  /* inputs */
  { id: "di", col: C0, y: ROW.A, title: "DI1–DI4", sub: "DI_COM", domain: "di", terminal: "left" },
  { id: "isodi", col: C1, y: ROW.A, title: "Isolated receivers", sub: "2 × ISO1212", domain: "di", split: "left" },
  { id: "ai", col: C0, y: ROW.B, title: "AI × 4", sub: "0–10 V · 4–20 mA", domain: "analog", terminal: "left" },
  { id: "afe", col: C1, y: ROW.B, title: "Fault protection", sub: "TMUX7462F · filters", domain: "analog", tag: "15V_ANA" },
  { id: "adc", col: C1, y: ROW.C, title: "16-bit ADC", sub: "ADS8684A · 1 kSPS/ch", domain: "analog", tag: "ADC_AVDD" },
  { id: "usb", col: C0, y: ROW.D, title: "USB-C · SWD", sub: "service · debug", domain: "logic", terminal: "left" },
  { id: "mux", col: C1, y: ROW.D, title: "Logic power select", sub: "TPS2121 → 5V_SYS", domain: "logic", tag: "5V_FIELD" },
  { id: "eeprom", col: C1, y: ROW.E, title: "Config memory", sub: "24LC64 · CRC · 2 copies", domain: "logic" },

  /* outputs and buses */
  { id: "rs485", col: C3, y: ROW.A, title: "Isolated RS-485", sub: "ISO1410 · Modbus RTU", domain: "rs485", tag: "5V_RS485_ISO", split: "right" },
  { id: "can", col: C3, y: ROW.B, title: "Isolated CAN FD", sub: "ISO1042 · 2 Mbit/s", domain: "can", tag: "5V_CAN_ISO", split: "right" },
  { id: "hs", col: C3, y: ROW.C, title: "4 × high-side", sub: "TPS4H160B · 0.5 A each", domain: "main", tag: "VFIELD" },
  { id: "relays", col: C3, y: ROW.D, title: "2 × SPDT relay", sub: "G5Q-1 · dry contacts", domain: "relay", tag: "5V_FIELD", split: "right" },
  { id: "ao", col: C3, y: ROW.E, title: "0–10 V output", sub: "DAC80501Z → OPA197", domain: "analog", tag: "±ANA" },
  { id: "b485", col: C4, y: ROW.A, title: "D+ · D−", sub: "RS485_REF", domain: "rs485", terminal: "right" },
  { id: "bcan", col: C4, y: ROW.B, title: "CAN_H · CAN_L", sub: "CAN_REF", domain: "can", terminal: "right" },
  { id: "do", col: C4, y: ROW.C, title: "DO1–DO4", sub: "LOAD_RETURN", domain: "main", terminal: "right" },
  { id: "contacts", col: C4, y: ROW.D, title: "COM · NO · NC", sub: "× 2, separate", domain: "relay", terminal: "right" },
  { id: "ao1", col: C4, y: ROW.E, title: "AO1", sub: "AO_RETURN", domain: "analog", terminal: "right" },

  /* safety */
  { id: "sup", col: C1, y: ROW.F, h: 58, title: "Supervision", sub: "reset · watchdog · rails", domain: "safety" },
  { id: "permit", col: C2, y: ROW.F, h: 58, title: "Output permission", sub: "all four must be true", domain: "safety" },
];

type Wire = { id: string; d: string; domain: Domain; label?: { x: number; y: number; text: string } };

const h = (y: number, x0: number, x1: number) => `M${x0} ${y}H${x1}`;

const WIRES: Wire[] = [
  { id: "w-vin-prot", d: h(mid(ROW.P) - 1, C0.x + C0.w, C1.x), domain: "field" },
  { id: "w-prot-vfield", d: h(mid(ROW.P) - 1, C1.x + C1.w, C2.x), domain: "field" },
  { id: "w-vfield-buck", d: h(mid(ROW.P) - 1, C2.x + C2.w, C3.x), domain: "field" },
  { id: "w-buck-aux", d: h(mid(ROW.P) - 1, C3.x + C3.w, C4.x), domain: "field" },

  { id: "w-di-isodi", d: h(mid(ROW.A), C0.x + C0.w, C1.x), domain: "di" },
  { id: "w-isodi-mcu", d: h(mid(ROW.A), C1.x + C1.w, C2.x), domain: "di", label: { x: 409, y: mid(ROW.A) - 7, text: "TIM" } },
  { id: "w-ai-afe", d: h(mid(ROW.B), C0.x + C0.w, C1.x), domain: "analog" },
  { id: "w-afe-adc", d: `M${C1.x + C1.w / 2} ${ROW.B + BH}V${ROW.C}`, domain: "analog" },
  { id: "w-adc-mcu", d: h(mid(ROW.C), C1.x + C1.w, C2.x), domain: "analog", label: { x: 409, y: mid(ROW.C) - 7, text: "SPI" } },
  { id: "w-usb-mux", d: h(mid(ROW.D), C0.x + C0.w, C1.x), domain: "logic" },
  { id: "w-mux-mcu", d: h(mid(ROW.D), C1.x + C1.w, C2.x), domain: "logic", label: { x: 409, y: mid(ROW.D) - 7, text: "5V_SYS" } },
  { id: "w-eeprom-mcu", d: h(mid(ROW.E), C1.x + C1.w, C2.x), domain: "logic", label: { x: 409, y: mid(ROW.E) - 7, text: "I²C" } },

  { id: "w-mcu-485", d: h(mid(ROW.A), C2.x + C2.w, C3.x), domain: "rs485", label: { x: 665, y: mid(ROW.A) - 7, text: "USART" } },
  { id: "w-485-b", d: h(mid(ROW.A), C3.x + C3.w, C4.x), domain: "rs485" },
  { id: "w-mcu-can", d: h(mid(ROW.B), C2.x + C2.w, C3.x), domain: "can", label: { x: 665, y: mid(ROW.B) - 7, text: "FDCAN" } },
  { id: "w-can-b", d: h(mid(ROW.B), C3.x + C3.w, C4.x), domain: "can" },
  { id: "w-mcu-hs", d: `${h(mid(ROW.C), C2.x + C2.w, GATE_X - 10)}${h(mid(ROW.C), GATE_X + 8, C3.x)}`, domain: "main" },
  { id: "w-hs-do", d: h(mid(ROW.C), C3.x + C3.w, C4.x), domain: "main" },
  { id: "w-mcu-rly", d: `${h(mid(ROW.D), C2.x + C2.w, GATE_X - 10)}${h(mid(ROW.D), GATE_X + 8, C3.x)}`, domain: "relay" },
  { id: "w-rly-k", d: h(mid(ROW.D), C3.x + C3.w, C4.x), domain: "relay" },
  { id: "w-mcu-ao", d: `${h(mid(ROW.E), C2.x + C2.w, GATE_X - 10)}${h(mid(ROW.E), GATE_X + 8, C3.x)}`, domain: "analog" },
  { id: "w-ao-ao1", d: h(mid(ROW.E), C3.x + C3.w, C4.x), domain: "analog" },

  { id: "w-sup-permit", d: h(ROW.F + 29, C1.x + C1.w, C2.x), domain: "safety" },
  { id: "w-mcu-permit", d: `M${C2.x + C2.w / 2} ${ROW.E + BH}V${ROW.F}`, domain: "safety", label: { x: C2.x + C2.w / 2 + 8, y: ROW.F - 11, text: "ARM" } },
  { id: "w-permit-bus", d: `M${C2.x + C2.w} ${ROW.F + 29}H${GATE_X}V${mid(ROW.C) + 9}`, domain: "safety" },
];

/* the three gates the permission bus feeds, one per energy output */
const GATES = [
  { id: "gC", y: mid(ROW.C) },
  { id: "gD", y: mid(ROW.D) },
  { id: "gE", y: mid(ROW.E) },
];

/* ── the paths a visitor can trace ─────────────────────────────────────── */
type Path = {
  key: string;
  label: string;
  domain: Domain;
  blocks: string[];
  wires: string[];
  gates?: string[];
  note: string;
};

const PATHS: Path[] = [
  {
    key: "power",
    label: "Field power",
    domain: "field",
    blocks: ["vin", "prot", "vfield", "buck", "aux", "hs"],
    wires: ["w-vin-prot", "w-prot-vfield", "w-vfield-buck", "w-buck-aux"],
    note: "Fuse, an SMCJ33CA TVS, a 100 V blocking FET and a TPS26632 eFuse sit between the terminal and VFIELD, with the bulk capacitance behind the limiter. VFIELD feeds the loads directly; an LMR38020 buck makes 5V_FIELD for everything else. Design targets: survive −30 V reversed and +40 V over.",
  },
  {
    key: "service",
    label: "Service power",
    domain: "logic",
    blocks: ["buck", "mux", "usb", "mcu"],
    wires: ["w-usb-mux", "w-mux-mcu"],
    note: "A TPS2121 picks 5V_FIELD or USB VBUS for the logic only. With nothing but USB plugged in the MCU runs and enumerates — while the relays, the isolated bus supplies, the analog rails and every output stay unpowered by design.",
  },
  {
    key: "sense",
    label: "Sensor inputs",
    domain: "analog",
    blocks: ["ai", "afe", "adc", "mcu"],
    wires: ["w-ai-afe", "w-afe-adc", "w-adc-mcu"],
    note: "Two 0–10 V and two 4–20 mA inputs pass a TMUX7462F fault protector — two threshold groups, near 11 V and near 6 V — before the 16-bit ADS8684A. 1 kSPS per channel in, calibrated 100 Hz values out. Target: ±30 V on any terminal for 60 s, powered or not.",
  },
  {
    key: "di",
    label: "Digital inputs",
    domain: "di",
    blocks: ["di", "isodi", "mcu"],
    wires: ["w-di-isodi", "w-isodi-mcu"],
    note: "Four inputs share an isolated DI_COM through two ISO1212 receivers, with thresholds set for OFF ≤ 5 V and ON ≥ 9 V so 12 V systems work too. DI1 lands on a hardware timer to count a 20 kHz pulse train; the rest get configurable debounce.",
  },
  {
    key: "outputs",
    label: "Load outputs",
    domain: "main",
    blocks: ["mcu", "hs", "do", "relays", "contacts", "permit"],
    wires: ["w-mcu-hs", "w-hs-do", "w-mcu-rly", "w-rly-k"],
    gates: ["gC", "gD"],
    note: "Four TPS4H160B-Q1 high-side channels at 0.5 A each — all four together — and two SPDT relays with dry, separately isolated contacts. Every command passes a hardware gate on its way out: no permission, no energy, whatever the firmware is doing.",
  },
  {
    key: "ao",
    label: "0–10 V output",
    domain: "analog",
    blocks: ["mcu", "ao", "ao1"],
    wires: ["w-mcu-ao", "w-ao-ao1"],
    gates: ["gE"],
    note: "A zero-scale-reset DAC80501Z into an OPA197 at gain ≈ 4, on +15 V and a −0.23 V bias so zero really is zero. Then a default-off disconnect and a fault protector before the terminal. Target: ±50 mV into ≥ 10 kΩ after calibration.",
  },
  {
    key: "buses",
    label: "Isolated buses",
    domain: "rs485",
    blocks: ["mcu", "rs485", "b485", "can", "bcan"],
    wires: ["w-mcu-485", "w-485-b", "w-mcu-can", "w-can-b"],
    note: "ISO1410 RS-485 for Modbus RTU and ISO1042 CAN FD, each with its own regulated UCC12050 supply and its own reference — isolated from the board and from each other. Joining RS485_REF to CAN_REF is called out in the wiring guide as the mistake it is.",
  },
  {
    key: "safety",
    label: "Fail-safe permission",
    domain: "safety",
    blocks: ["sup", "permit", "mcu", "hs", "relays", "ao"],
    wires: ["w-sup-permit", "w-mcu-permit", "w-permit-bus"],
    gates: ["gC", "gD", "gE"],
    note: "FIELD_VALID ∧ RESET_OK ∧ WATCHDOG_OK ∧ ARM, built in hardware. A reset, a hung application, a brownout or a lost command owner removes permission without asking the firmware — and re-arming always takes a fresh, explicit command.",
  },
];

/* ── drawing ────────────────────────────────────────────────────────────── */
function BlockShape({ b, dim, lit }: { b: Block; dim: boolean; lit: boolean }) {
  const { x, w } = b.col;
  const y = b.y;
  const hh = b.h ?? BH;
  const c = COLOR[b.domain];
  const isTerm = !!b.terminal;
  const pinX = b.terminal === "left" ? x + 10 : x + w - 10;
  const textX = b.terminal === "left" ? x + 24 : x + 16;

  return (
    <g className="dg-el" style={{ opacity: dim ? 0.18 : 1 }}>
      {lit && (
        <rect
          x={x - 3}
          y={y - 3}
          width={w + 6}
          height={hh + 6}
          rx={13}
          fill="none"
          stroke={c}
          strokeOpacity={0.45}
          strokeWidth={1.5}
        />
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={hh}
        rx={isTerm ? 8 : 11}
        fill={isTerm ? "var(--bg-alt)" : "var(--surface-2)"}
        stroke={lit ? c : "var(--border-strong)"}
        strokeWidth={1}
        strokeDasharray={isTerm ? "4 3" : undefined}
      />
      {/* the domain bar */}
      {!isTerm && <rect x={x} y={y + 10} width={3} height={hh - 20} rx={1.5} fill={c} />}
      {/* terminal screws */}
      {isTerm &&
        [0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={pinX}
            cy={y + 16 + i * 14}
            r={3.4}
            fill="none"
            stroke={c}
            strokeWidth={1.2}
            opacity={0.85}
          />
        ))}
      {/* isolation barrier inside the part */}
      {b.split && (
        <>
          <line
            x1={b.split === "left" ? x + 22 : x + w - 22}
            x2={b.split === "left" ? x + 22 : x + w - 22}
            y1={y + 6}
            y2={y + hh - 6}
            stroke={c}
            strokeWidth={1.2}
            strokeDasharray="3 3"
          />
        </>
      )}
      <text
        x={b.split === "left" ? textX + 18 : textX}
        y={y + 26}
        fontSize={13.5}
        fontWeight={600}
        fill="var(--text)"
        style={{ letterSpacing: "-0.01em" }}
      >
        {b.title}
      </text>
      {b.sub && (
        <text
          x={b.split === "left" ? textX + 18 : textX}
          y={y + 44}
          fontSize={10.5}
          fill="var(--text-3)"
          className="svg-mono"
        >
          {b.sub}
        </text>
      )}
      {b.tag && (
        <g>
          <rect
            x={x + w - 12 - b.tag.length * 6.1 - 10}
            y={y - 8}
            width={b.tag.length * 6.1 + 10}
            height={16}
            rx={8}
            fill="var(--bg)"
            stroke={c}
            strokeOpacity={0.55}
          />
          <text
            x={x + w - 12 - (b.tag.length * 6.1 + 10) / 2}
            y={y + 3.5}
            fontSize={9.5}
            textAnchor="middle"
            fill={c}
            className="svg-mono"
          >
            {b.tag}
          </text>
        </g>
      )}
    </g>
  );
}

function Mcu({ dim, lit, fill }: { dim: boolean; lit: boolean; fill: string }) {
  const x = C2.x;
  const y = ROW.A;
  const w = C2.w;
  const hh = ROW.E + BH - ROW.A;
  const pins = Array.from({ length: 15 }, (_, i) => y + 24 + i * ((hh - 48) / 14));
  return (
    <g className="dg-el" style={{ opacity: dim ? 0.18 : 1 }}>
      {/* pins down both sides, the way an LQFP reads from above */}
      <g stroke="var(--border-strong)" strokeWidth={2.2} strokeLinecap="round">
        {pins.map((py) => (
          <g key={py}>
            <line x1={x - 7} x2={x} y1={py} y2={py} />
            <line x1={x + w} x2={x + w + 7} y1={py} y2={py} />
          </g>
        ))}
      </g>
      <rect
        x={x}
        y={y}
        width={w}
        height={hh}
        rx={14}
        fill={`url(#${fill})`}
        stroke={lit ? "var(--d-logic)" : "var(--border-strong)"}
        strokeWidth={lit ? 1.4 : 1}
      />
      <circle cx={x + 18} cy={y + 18} r={4} fill="none" stroke="var(--text-3)" strokeWidth={1} />
      <text x={x + w / 2} y={y + hh / 2 - 34} textAnchor="middle" fontSize={11} fill="var(--text-3)" className="svg-mono" style={{ letterSpacing: "0.14em" }}>
        MCU
      </text>
      <text x={x + w / 2} y={y + hh / 2 - 6} textAnchor="middle" fontSize={21} fill="var(--text)" className="svg-serif">
        STM32G474VET6
      </text>
      <text x={x + w / 2} y={y + hh / 2 + 16} textAnchor="middle" fontSize={10.5} fill="var(--text-2)" className="svg-mono">
        Cortex-M4 · LQFP100
      </text>
      <text x={x + w / 2} y={y + hh / 2 + 34} textAnchor="middle" fontSize={10.5} fill="var(--text-3)" className="svg-mono">
        FDCAN · USB FS · timers
      </text>
    </g>
  );
}

export default function ArchitectureDiagram({ compact = false }: { compact?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<string | null>(null);
  const path = PATHS.find((p) => p.key === sel) ?? null;

  const blockOn = (id: string) => !path || path.blocks.includes(id);
  const wireOn = (id: string) => !path || path.wires.includes(id);
  const gateOn = (id: string) => !path || (path.gates ?? []).includes(id);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
        <span className="eyebrow" id={`${uid}-trace`}>
          Trace a path
        </span>
        <span className="text-[11.5px] sm:hidden" style={{ color: "var(--text-3)" }}>
          Swipe the diagram sideways &rarr;
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={`${uid}-trace`}>
        {PATHS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setSel((v) => (v === p.key ? null : p.key))}
            aria-pressed={sel === p.key}
            className="seg inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1.5"
          >
            <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR[p.domain] }} />
            {p.label}
          </button>
        ))}
      </div>

      <div
        className="scroll-x mt-4 rounded-xl"
        style={{ background: "var(--bg-alt)", border: "1px solid var(--border-soft)" }}
        tabIndex={0}
        role="region"
        aria-label="Architecture diagram — scrolls sideways on a narrow screen"
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full h-auto"
          style={{ minWidth: compact ? 760 : 820 }}
          role="img"
          aria-labelledby={`${uid}-title ${uid}-desc`}
        >
          <title id={`${uid}-title`}>STM32 Industrial I/O Controller — system architecture</title>
          <desc id={`${uid}-desc`}>
            A protected 9 to 30 volt input feeds the field rail and a 5 volt buck. Isolated digital
            inputs and fault-protected analog inputs feed an STM32G474 microcontroller, which drives
            isolated RS-485 and CAN FD, four high-side outputs, two relays and a 0 to 10 volt output.
            Every energy output passes a hardware permission gate fed by reset, watchdog and rail
            supervision.
          </desc>
          <defs>
            <linearGradient id={`${uid}-mcu`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#25221e" />
              <stop offset="100%" stopColor="#181614" />
            </linearGradient>
            <pattern id={`${uid}-dots`} width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.045)" />
            </pattern>
          </defs>

          <rect width={W} height={H} fill={`url(#${uid}-dots)`} />

          {/* column captions */}
          <g className="svg-mono" fontSize={9.5} fill="var(--text-3)" style={{ letterSpacing: "0.16em" }}>
            <text x={C0.x} y={ROW.A - 14}>FIELD IN</text>
            <text x={C1.x} y={ROW.A - 14}>FRONT END</text>
            <text x={C3.x} y={ROW.A - 14}>OUTPUT STAGES</text>
            <text x={C4.x} y={ROW.A - 14}>FIELD OUT</text>
          </g>

          {/* wires */}
          {WIRES.map((wr) => {
            const on = wireOn(wr.id);
            const active = !!path && path.wires.includes(wr.id);
            const c = COLOR[wr.domain];
            return (
              <g key={wr.id} className="dg-el" style={{ opacity: on ? 1 : 0.12 }}>
                <path
                  d={wr.d}
                  fill="none"
                  stroke={c}
                  strokeOpacity={active ? 0.95 : 0.55}
                  strokeWidth={active ? 2.2 : 1.5}
                  strokeDasharray={wr.domain === "safety" && !active ? "5 4" : undefined}
                />
                {active && (
                  <path
                    d={wr.d}
                    fill="none"
                    stroke="#fff6e2"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    className="trace-run"
                  />
                )}
                {wr.label && (
                  <text
                    x={wr.label.x}
                    y={wr.label.y}
                    textAnchor="middle"
                    fontSize={9.5}
                    fill="var(--text-3)"
                    className="svg-mono"
                  >
                    {wr.label.text}
                  </text>
                )}
              </g>
            );
          })}

          {/* the AND gates on the three energy outputs */}
          {GATES.map((g) => {
            const on = gateOn(g.id);
            return (
              <g key={g.id} className="dg-el" style={{ opacity: on ? 1 : 0.15 }}>
                <path
                  d={`M${GATE_X - 10} ${g.y - 9}h9a9 9 0 0 1 0 18h-9z`}
                  fill="var(--bg)"
                  stroke="var(--d-safety)"
                  strokeWidth={1.4}
                />
              </g>
            );
          })}

          <Mcu dim={!blockOn("mcu")} lit={!!path && path.blocks.includes("mcu")} fill={`${uid}-mcu`} />
          {BLOCKS.map((b) => (
            <BlockShape key={b.id} b={b} dim={!blockOn(b.id)} lit={!!path && path.blocks.includes(b.id)} />
          ))}

          {/* the barrier legend, bottom right */}
          <g transform={`translate(${C3.x} ${ROW.F + 6})`} fontSize={10.5} fill="var(--text-3)" className="svg-mono">
            <line x1={0} x2={22} y1={8} y2={8} stroke="var(--text-2)" strokeDasharray="3 3" strokeWidth={1.2} />
            <text x={30} y={12}>isolation barrier</text>
            <path d="M4 22h7a6 6 0 0 1 0 12h-7z" fill="none" stroke="var(--d-safety)" strokeWidth={1.3} />
            <text x={30} y={32}>hardware AND gate</text>
            <rect x={0} y={42} width={22} height={11} rx={5.5} fill="none" stroke="var(--text-3)" />
            <text x={30} y={52}>rail feeding the block</text>
          </g>
        </svg>
      </div>

      <div
        className="mt-3 rounded-xl p-4 min-h-[86px]"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        aria-live="polite"
      >
        {path ? (
          <p className="text-[13px] leading-6 m-0" style={{ color: "var(--text-2)" }}>
            <span className="font-medium" style={{ color: COLOR[path.domain] }}>
              {path.label}.{" "}
            </span>
            {path.note}
          </p>
        ) : (
          <p className="text-[13px] leading-6 m-0" style={{ color: "var(--text-3)" }}>
            Pick a path to light it through the board — power, sensing, outputs, the isolated buses,
            or the hardware permission that sits in front of every energy output.
          </p>
        )}
      </div>
    </div>
  );
}
