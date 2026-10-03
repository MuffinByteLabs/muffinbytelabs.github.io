/* ════════════════════════════════════════════════════════════════════════
   PCB 2 — STM32 Industrial I/O Controller, Rev A.

   Single source of truth for the case study and the homepage panel. Every
   number here comes from the project's own engineering documents — the
   Rev A plan, the wiring guide, the layout rules, the procurement plan and
   the planning arithmetic in docs/calcs — so the site and the project
   cannot drift apart without someone noticing.

   The figures are the design's ratings: what each block was designed and
   specified to do. Nothing here is presented as a lab measurement.
   ════════════════════════════════════════════════════════════════════════ */

export const PCB2_SLUG = "/work/stm32-industrial-io";

export const PCB2 = {
  id: "PCB 2",
  rev: "Rev A",
  name: "STM32 Industrial I/O Controller",
  tagline: "A four-layer sensor and actuator controller for 12 V and 24 V DC equipment.",
  summary:
    "Reads industrial sensors, switches real DC loads, drives a 0–10 V actuator and talks isolated RS-485 and CAN FD — with every energy output behind a hardware permission gate the firmware cannot bypass.",
  specs: ["140 × 100 mm", "4-layer", "STM32G474VET6", "9–30 V DC", "RS-485 + CAN FD"],
};

/* ── the headline numbers ──────────────────────────────────────────────── */
export const PCB2_STATS: { value: string; label: string }[] = [
  { value: "9–30 V", label: "DC operating input, 12/24 V nominal" },
  { value: "5", label: "isolated domains beyond main ground" },
  { value: "16-bit", label: "external ADC on four analog inputs" },
  { value: "12", label: "hierarchical schematic sheets" },
];

/* ── I/O at a glance ───────────────────────────────────────────────────── */
export type IOItem = {
  count: string;
  name: string;
  detail: string;
  part: string;
  domain: "di" | "analog" | "main" | "relay" | "rs485" | "can" | "logic";
};

export const PCB2_IO: IOItem[] = [
  {
    count: "4×",
    name: "Digital inputs",
    detail: "Group-isolated on DI_COM. OFF ≤ 5 V, ON ≥ 9 V; DI1 counts a 20 kHz pulse train.",
    part: "2 × ISO1212",
    domain: "di",
  },
  {
    count: "2×",
    name: "0–10 V inputs",
    detail: "Single-ended, ≥ 500 kΩ, survive ±30 V miswire powered or not.",
    part: "ADS8684A · TMUX7462F",
    domain: "analog",
  },
  {
    count: "2×",
    name: "4–20 mA inputs",
    detail: "200 Ω Kelvin shunts, read to 25.6 mA so overrange still reports.",
    part: "ADS8684A · 0.05 % shunts",
    domain: "analog",
  },
  {
    count: "1×",
    name: "0–10 V output",
    detail: "Into ≥ 10 kΩ, default-off disconnect, real headroom at zero volts.",
    part: "DAC80501Z · OPA197",
    domain: "analog",
  },
  {
    count: "4×",
    name: "High-side outputs",
    detail: "0.5 A each, all four at once. Current-limited, short latches off.",
    part: "TPS4H160B-Q1",
    domain: "main",
  },
  {
    count: "2×",
    name: "SPDT relays",
    detail: "Dry COM / NO / NC contacts, each its own isolated circuit.",
    part: "G5Q-1 DC5",
    domain: "relay",
  },
  {
    count: "1×",
    name: "RS-485",
    detail: "Half-duplex Modbus RTU, 9.6–115.2 kbit/s, switchable 120 Ω termination.",
    part: "ISO1410 · own supply",
    domain: "rs485",
  },
  {
    count: "1×",
    name: "CAN FD",
    detail: "Classic CAN at 500 kbit/s; FD at 2 Mbit/s data phase.",
    part: "ISO1042 · own supply",
    domain: "can",
  },
  {
    count: "1×",
    name: "USB-C + SWD",
    detail: "USB 2.0 full-speed service port and a keyed 10-pin Cortex debug header.",
    part: "TPS2121 power select",
    domain: "logic",
  },
];

export const DOMAIN_COLOR: Record<IOItem["domain"] | "field" | "safety", string> = {
  di: "var(--d-di)",
  analog: "var(--d-analog)",
  main: "var(--d-main)",
  relay: "var(--d-relay)",
  rs485: "var(--d-rs485)",
  can: "var(--d-can)",
  logic: "var(--d-logic)",
  field: "var(--d-field)",
  safety: "var(--d-safety)",
};

/* ── the brief ─────────────────────────────────────────────────────────── */
export const PCB2_BRIEF: string[] = [
  "PCB 1 proved wireless sensing on a battery. A lot of the hardware work clients post sits closer to the machine: a controller bolted into 24 V equipment, reading a pressure transmitter, switching a solenoid, commanding a fan over 0–10 V and reporting to a PLC over RS-485 or CAN — and doing nothing dangerous when a wire is landed on the wrong terminal.",
  "So PCB 2 is that board. A bare STM32 on four layers rather than a module, a protected field supply instead of a USB port, precision analog next to switched loads, two wired buses each on its own island, and a fault story written down before the first symbol was placed.",
];

export const PCB2_FOR: string[] = [
  "Industrial control units on 24 V",
  "Sensor interfaces with 4–20 mA and 0–10 V",
  "Equipment controllers with Modbus RTU",
  "CAN measurement and control nodes",
  "0–10 V fan, valve and lighting commands",
  "Pulse and flow counting",
];

/* ── isolation domains ─────────────────────────────────────────────────── */
export const DOMAINS: {
  key: string;
  name: string;
  color: string;
  members: string;
  boundary: string;
}[] = [
  {
    key: "main",
    name: "MAIN_GND",
    color: "var(--d-main)",
    members: "DC negative, MCU, ADC returns, analog terminals, load returns, USB ground",
    boundary: "One continuous reference — never cut into analog and digital halves",
  },
  {
    key: "di",
    name: "DI_COM",
    color: "var(--d-di)",
    members: "All four digital-input field returns",
    boundary: "Group-isolated from main ground by the ISO1212 receivers",
  },
  {
    key: "rs485",
    name: "RS485_REF",
    color: "var(--d-rs485)",
    members: "RS-485 transceiver bus side, its protection and its own isolated 5 V",
    boundary: "Isolated from main ground and from CAN",
  },
  {
    key: "can",
    name: "CAN_REF",
    color: "var(--d-can)",
    members: "CAN transceiver bus side, its protection and a second isolated 5 V",
    boundary: "Isolated from main ground and from RS-485",
  },
  {
    key: "k1",
    name: "Relay 1 contacts",
    color: "var(--d-relay)",
    members: "COM1 · NO1 · NC1",
    boundary: "Independent of the coil, main ground and relay 2",
  },
  {
    key: "k2",
    name: "Relay 2 contacts",
    color: "var(--d-relay)",
    members: "COM2 · NO2 · NC2",
    boundary: "Independent of the coil, main ground and relay 1",
  },
];

/* ── power ─────────────────────────────────────────────────────────────── */
export type Rail = {
  name: string;
  volts: string;
  part: string;
  role: string;
  domain: "field" | "logic" | "analog" | "rs485" | "can" | "main" | "relay";
  /** still alive when only USB is plugged in */
  usb?: boolean;
  children?: Rail[];
};

export const POWER_TREE: Rail = {
  name: "VIN",
  volts: "9–30 V DC",
  part: "Pluggable terminal, ≥ 5 A",
  role: "Nominal 12 / 24 V field supply",
  domain: "field",
  children: [
    {
      name: "VFIELD",
      volts: "9–30 V",
      part: "Fuse → SMCJ33CA TVS → 100 V blocking FET + TPS26632 eFuse",
      role: "Protected field rail — the load energy. Limit ≈ 3.5 A",
      domain: "field",
      children: [
        {
          name: "DO1–DO4",
          volts: "VFIELD",
          part: "TPS4H160B-Q1",
          role: "Four high-side outputs, 0.5 A each, 2 A together",
          domain: "main",
        },
        {
          name: "5V_FIELD",
          volts: "5.0 V",
          part: "LMR38020 buck",
          role: "Field service power, 1 A combined budget",
          domain: "field",
          children: [
            { name: "Relay coils", volts: "5 V", part: "2 × G5Q-1 DC5", role: "≈ 80 mA each, gated drivers", domain: "relay" },
            { name: "15V_ANA", volts: "+15 V", part: "TPS55340 boost", role: "Fault protectors and the AO amplifier", domain: "analog" },
            { name: "NEG_ANA", volts: "−0.23 V", part: "LM7705", role: "Gives the AO amplifier headroom at zero", domain: "analog" },
            { name: "ADC_AVDD · DAC", volts: "5.0 V", part: "Filtered, permanent bleeder", role: "Quiet field-only analog supply", domain: "analog" },
            { name: "3V3_FIELD_LOGIC", volts: "3.3 V", part: "Field-side regulator", role: "ADC digital side and field buffers", domain: "analog" },
            { name: "5V_RS485_ISO", volts: "5 V iso", part: "UCC12050", role: "RS-485 bus side, its own island", domain: "rs485" },
            { name: "5V_CAN_ISO", volts: "5 V iso", part: "UCC12050", role: "CAN bus side, a second island", domain: "can" },
            {
              name: "5V_SYS",
              volts: "≈ 5 V",
              part: "TPS2121 power mux ← USB-C VBUS",
              role: "Logic only — USB can never reach the field side",
              domain: "logic",
              usb: true,
              children: [
                { name: "3V3_DIG", volts: "3.3 V", part: "TPS62160 buck", role: "MCU digital and interfaces", domain: "logic", usb: true },
                { name: "3V3_MCU_ANA", volts: "3.3 V", part: "TPS7A20 LDO", role: "MCU analog and reference support", domain: "logic", usb: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** 5 V service allocation — the planning ceiling every part had to fit under */
export const SERVICE_BUDGET: { label: string; mA: number; color: string }[] = [
  { label: "MCU & logic", mA: 200, color: "var(--d-logic)" },
  { label: "ADC, DAC & analog", mA: 100, color: "var(--d-analog)" },
  { label: "Relay coils × 2", mA: 160, color: "var(--d-relay)" },
  { label: "Isolated supplies × 2", mA: 250, color: "var(--d-rs485)" },
  { label: "Analog ±rails", mA: 200, color: "var(--d-field)" },
  { label: "Margin", mA: 90, color: "var(--border-strong)" },
];

/** board input current with all four outputs at 0.5 A and 5 W of service
    power at 85 % — from docs/calcs/controller_budget.py, before extra
    protection losses. The board budget is 3 A continuous. */
export const INPUT_BUDGET: { volts: number; amps: number }[] = [
  { volts: 9, amps: 2.654 },
  { volts: 12, amps: 2.49 },
  { volts: 24, amps: 2.245 },
  { volts: 30, amps: 2.196 },
];

export const PROTECTION_CHAIN: { step: string; part: string; why: string }[] = [
  { step: "Pluggable terminal", part: "≥ 5 A rated", why: "The connector is part of the current path, so it is rated like one." },
  { step: "Replaceable fuse", part: "Coordinated", why: "Sized after startup and fault coordination, not before." },
  { step: "Bidirectional TVS", part: "SMCJ33CA", why: "33 V stand-off clears a 30 V supply; raw-side capacitance kept deliberately small." },
  { step: "Reverse blocking + eFuse", part: "100 V FET · TPS26632", why: "Current limit, inrush control and a 35 V output clamp in one stage." },
  { step: "Controlled bulk", part: "After startup control", why: "The big capacitor sits behind the limiter instead of bypassing it." },
  { step: "Branch", part: "VFIELD + 5 V buck", why: "Load energy and service power split only after protection." },
];

export const FAULT_TARGETS: { value: string; label: string }[] = [
  { value: "−30 V", label: "supply connected backwards — designed to survive it" },
  { value: "+40 V", label: "overvoltage — clamp, disconnect, disarm the outputs" },
  { value: "±30 V", label: "on any analog terminal, 60 s, powered or not" },
  { value: "≈ 0.7 A", label: "per-channel current limit — a short latches off" },
];

/* USB-only service mode — what is alive and what must stay dead */
export const POWER_STATES: { rail: string; field: string; usb: string }[] = [
  { rail: "VFIELD", field: "Applied DC less protection loss", usb: "Off — no USB backfeed" },
  { rail: "5V_FIELD", field: "5.0 V", usb: "Off" },
  { rail: "5V_SYS", field: "≈ 5 V from the field side", usb: "≈ 5 V from USB VBUS" },
  { rail: "3V3_DIG · 3V3_MCU_ANA", field: "3.30 V", usb: "3.30 V" },
  { rail: "ADC_AVDD · 15V_ANA · NEG_ANA", field: "On", usb: "Off — readings flagged unavailable" },
  { rail: "Both isolated bus supplies", field: "On", usb: "Off" },
  { rail: "Relays · DO · AO", field: "Only after explicit arming", usb: "Inhibited in hardware" },
];

/* ── signal chains ─────────────────────────────────────────────────────── */
export const SIGNAL_CHAINS: {
  key: string;
  title: string;
  domain: keyof typeof DOMAIN_COLOR;
  chain: string[];
  points: string[];
}[] = [
  {
    key: "ai",
    title: "Analog inputs",
    domain: "analog",
    chain: ["Terminal", "TVS + pulse resistor", "TMUX7462F", "Filter", "ADS8684A", "SPI → MCU"],
    points: [
      "Voltage channels on the 0–10.24 V range, current channels on 0–5.12 V across a 200 Ω, 0.05 % Kelvin shunt: 4–20 mA reads as 0.8–4 V.",
      "Two protector groups with separate thresholds — near 11 V for voltage, near 6 V for current — because a shared threshold would compromise both.",
      "1 kSPS per channel with deterministic scan timing, published as calibrated 100 Hz values; raw samples stay available to the host tools.",
      "A permanent ADC_AVDD bleeder, because the ADC's input-stress limit depends on its supply impedance while a protector is still live.",
    ],
  },
  {
    key: "ao",
    title: "0–10 V output",
    domain: "analog",
    chain: ["MCU", "DAC80501Z", "OPA197, gain ≈ 4", "Default-off disconnect", "TMUX7462F", "AO1"],
    points: [
      "The zero-scale power-on DAC variant, so the output wakes at zero rather than mid-scale.",
      "+15 V and a −0.23 V bias rail give the amplifier real headroom at the zero-volt endpoint.",
      "A 1 mA load through 50 Ω already eats the whole ±50 mV budget — so the protection and disconnect resistance are inside the error budget, not an afterthought.",
    ],
  },
  {
    key: "do",
    title: "High-side outputs",
    domain: "main",
    chain: ["Permit gate", "TPS4H160B-Q1", "Blocking diode", "DO1–4", "Freewheel diode"],
    points: [
      "Hardware does the current limiting, firmware owns the fault state: a stalled or shorted load latches its channel off and needs an explicit clear.",
      "A series diode per channel stops positive backfeed; a load-side freewheel diode catches the inductive kick.",
      "Current sense is multiplexed through one pin, so readings are tagged sequential — never presented as simultaneous.",
    ],
  },
  {
    key: "di",
    title: "Digital inputs",
    domain: "di",
    chain: ["DI1–4", "Threshold network", "2 × ISO1212", "Timer capture / GPIO"],
    points: [
      "Thresholds designed for OFF ≤ 5 V and ON ≥ 9 V, so a 12 V system works — a standard 24 V input threshold would not.",
      "DI1 lands on a hardware timer with light filtering: at 20 kHz each half-period is only 25 µs.",
      "DI2–DI4 get configurable software debounce instead of one long filter for everything.",
    ],
  },
];

/* ── safety ────────────────────────────────────────────────────────────── */
export const PERMIT_INPUTS: { name: string; from: string }[] = [
  { name: "FIELD_VALID", from: "Rail window monitors" },
  { name: "RESET_OK", from: "Reset supervisor" },
  { name: "WATCHDOG_OK", from: "TPS3431 external watchdog" },
  { name: "ARM", from: "Explicit arm from the command owner" },
];

export const PERMIT_OUTPUTS: { name: string; note: string }[] = [
  { name: "4 × high-side inputs", note: "every channel's command passes the gate" },
  { name: "2 × relay drivers", note: "coils stay dead without permission" },
  { name: "AO disconnect", note: "also needs FIELD_ANALOG_VALID" },
];

export const RELEASE_RULES: string[] = [
  "Outputs default off; relay coils off; AO disconnected at its documented zero.",
  "One command owner at a time — Modbus, CAN or local demo — and changing owner disarms.",
  "1 s command timeout by default: stale commands drop every energy output.",
  "Overloads latch off. No unlimited automatic retry into a short.",
  "Calibration and configuration carry a version, a CRC and two recoverable copies.",
  "The watchdog is fed only after health checks pass — never by a free-running timer.",
];

/* ── layout ────────────────────────────────────────────────────────────── */
export const DESIGN_RULES: { label: string; value: string }[] = [
  { label: "Track / space", value: "0.20 mm" },
  { label: "Signal via", value: "0.30 / 0.60 mm" },
  { label: "Power / stitching via", value: "0.40 / 0.80 mm" },
  { label: "Copper to edge", value: "0.50 mm" },
  { label: "USB 2.0 pair", value: "90 Ω differential" },
  { label: "Comms barrier", value: "≈ 8 mm, all 4 layers" },
];

export const SCHEMATIC_SHEETS: { name: string; scope: string }[] = [
  { name: "System", scope: "Hierarchy, domains, permission signals" },
  { name: "Input power", scope: "Fuse, TVS, FET + eFuse, bulk, sensing" },
  { name: "Service power", scope: "5 V buck, logic mux, 3.3 V rails" },
  { name: "Auxiliary power", scope: "Analog ±rails, two isolated supplies" },
  { name: "MCU & debug", scope: "STM32G474, clock, reset, boot, USB, SWD" },
  { name: "Digital inputs", scope: "Four receivers, thresholds, protection" },
  { name: "Analog inputs", scope: "ADC, shunts, protectors, filters" },
  { name: "Analog output", scope: "DAC, amplifier, disconnect, readback" },
  { name: "Switched outputs", scope: "High-side channels, diodes, sensing" },
  { name: "Relays", scope: "Gated coil drivers, dry contacts" },
  { name: "Communications", scope: "Isolated RS-485 and CAN FD" },
  { name: "Permission & service", scope: "Gating, watchdog, EEPROM, test access" },
];

export const PLACEMENT: string[] = [
  "Enclosure, terminals, mounting and USB / SWD access fixed first",
  "Input protection at the power terminal",
  "High-side switch and its diodes beside the load terminals",
  "Buck, boost and isolated-converter hot loops kept compact",
  "ADC, shunts and protectors beside the analog terminals, away from load current",
  "Relay contact copper kept apart from coils and low-level analog",
  "Bus protection at its terminal, barrier beside its transceiver",
  "MCU decoupling and crystal per the verified package guidance",
  "Test points on every rail and permission signal before filling space",
];

/* ── parts ─────────────────────────────────────────────────────────────── */
export const KEY_PARTS: { fn: string; part: string; why: string }[] = [
  { fn: "MCU", part: "STM32G474VET6 · LQFP100", why: "FDCAN, USB FS, timers and room for ten spare GPIO" },
  { fn: "ADC", part: "ADS8684A", why: "16-bit, 4-ch, programmable single-ended ranges" },
  { fn: "Input eFuse", part: "TPS26632 + 100 V FET", why: "Current limit, inrush control, 35 V clamp" },
  { fn: "Raw TVS", part: "SMCJ33CA", why: "33 V stand-off above a 30 V supply" },
  { fn: "5 V buck", part: "LMR38020", why: "80 V input rating, 2 A capable" },
  { fn: "3.3 V digital", part: "TPS62160", why: "Small, efficient step-down for the MCU" },
  { fn: "3.3 V quiet", part: "TPS7A20", why: "Low-noise analog support rail" },
  { fn: "Logic power select", part: "TPS2121", why: "USB or field, with reverse blocking" },
  { fn: "+15 V analog", part: "TPS55340", why: "Boost for protectors and the AO amplifier" },
  { fn: "Negative bias", part: "LM7705", why: "−0.23 V so the output can truly reach zero" },
  { fn: "Digital inputs", part: "2 × ISO1212", why: "Group isolation with controlled input current" },
  { fn: "Analog protection", part: "2 × TMUX7462F", why: "Terminal fault protection, two threshold groups" },
  { fn: "Output DAC", part: "DAC80501Z", why: "Zero-scale power-on reset" },
  { fn: "AO amplifier", part: "OPA197", why: "36 V rail-to-rail precision op-amp" },
  { fn: "High-side switch", part: "TPS4H160B-Q1", why: "Four channels with current sense" },
  { fn: "Relays", part: "2 × Omron G5Q-1 DC5", why: "SPDT, 5 V coil, dry contacts" },
  { fn: "RS-485", part: "ISO1410", why: "Isolated, half-duplex" },
  { fn: "CAN FD", part: "ISO1042", why: "Isolated, wide-body" },
  { fn: "Isolated power", part: "2 × UCC12050", why: "Regulated, one per bus island" },
  { fn: "Watchdog", part: "TPS3431", why: "External, feeds the permission logic" },
  { fn: "Config memory", part: "24LC64", why: "Calibration with CRC and two copies" },
];

export const SCOPE_LIMITS: string[] = [
  "Not automotive-qualified — CAN here is for equipment, not a vehicle network",
  "The CAN protocol is a documented custom one, not CANopen",
  "On/off outputs — not proportional solenoid drive or high-frequency PWM",
  "The 0–10 V output sources voltage; it is not a current-sinking dimming interface",
  "Analog inputs share main ground — single-ended, not galvanically isolated",
  "No mains anywhere on the board",
];
