/* ════════════════════════════════════════════════════════════════════════
   PCB DESIGN — single source of truth for every section on the homepage.
   Keep all part numbers / specs technically correct: a PCB-literate client
   will scrutinize them (one pull-up pair per I2C bus, AP2112K over AMS1117,
   IPC-2221 trace widths, creepage on the 24V side, etc.).
   ════════════════════════════════════════════════════════════════════════ */

/* ---- Palette (the new PCB visual language, layered on the existing brand) ---- */
export const PCB = {
  bg: "#0a0a0a",
  green: "#00ff41", // powered / active / DRC-pass ONLY
  greenDim: "#00cc33",
  purple: "#a855f7", // section eyebrows / secondary
  soldermask: "#0b3d2e", // board surface (passive)
  soldermaskLit: "#10593f", // hover / energized board surface
  copper: "#b87333", // at-rest copper traces
  copperBright: "#e8a85c", // energized / current-carrying copper
  enig: "#d4af37", // pads, holes, test points, CTAs, Tier-2 skills
  enigBright: "#f3d27a", // pad highlight
  silk: "#e8ead5", // silkscreen ink (warm white)
  drill: "#040804", // drill / via interiors
  comm: "#00d4ff", // I2C/SPI/UART buses, net highlight
  error: "#ff5f57", // DRC violation flash (sparingly)
} as const;

/* ---- Hero board-house string + status strip ---- */
export const FAB_STRING = "MML-PCB · REV_A · 2-LAYER · 1.6mm FR-4 · ENIG · HASL→ENIG";
export const STATUS_STRIP = "DRC: 0   ERC: 0   |   2-LAYER · 1.6mm FR-4 · ENIG   |   JLCPCB";
export const POWER_STATUS = "> board powered :: rails nominal :: DRC clean / ERC clean";
export const DESIGNATOR =
  "EMBEDDED PCB DESIGNER · KiCad · ESP32 + STM32 · JLCPCB PRODUCTION-READY";

/* ════════════════════════════════════════════════════════════════════════
   THE DELIVERABLE — manufacturing package (the real product)
   ════════════════════════════════════════════════════════════════════════ */
export type TreeNode = {
  name: string;
  note?: string; // "what the fab does with this / what it proves"
  children?: TreeNode[];
};

export const PACKAGE_TREE: TreeNode = {
  name: "MML-0X-board/",
  children: [
    { name: "source/", note: "Editable KiCad project — .kicad_pro / .kicad_sch / .kicad_pcb. The client owns the design, not just the artwork." },
    {
      name: "production/",
      note: "Everything the fab actually consumes. Zip this folder, upload, done.",
      children: [
        { name: "gerbers/", note: "RS-274X copper, soldermask, silkscreen & edge-cuts — one file per layer. This is what becomes the physical board." },
        { name: "drill/", note: "Excellon NPTH + PTH files — every hole position and size for the CNC drill." },
        { name: "BOM.csv", note: "Every line item with a real manufacturer part number (LCSC / Digi-Key) so assembly can actually source it." },
        { name: "CPL.csv", note: "Centroid / pick-and-place file — X/Y/rotation per part for the assembly robot." },
        { name: "schematic.pdf", note: "Human-readable schematic so a reviewer can sanity-check the circuit without opening KiCad." },
      ],
    },
    { name: "docs/", note: "3D render, layout + schematic screenshots, ERC/DRC-clean proof, JLCPCB upload preview, and bring-up photos." },
    { name: "README.md", note: "States the freelance problem this board solves — the highest-leverage file in the package." },
    { name: "REV_A_notes.md", note: "Honest list of what I would change in Rev B. Shows engineering judgment, not just a passing DRC." },
    { name: "CHANGES.md", note: "Revision log across board spins." },
  ],
};

export type Badge = { label: string; note: string };
export const CLEAN_BADGES: Badge[] = [
  { label: "GERBERS", note: "RS-274X, all layers" },
  { label: "DRILL", note: "Excellon NPTH + PTH" },
  { label: "BOM w/ MPN", note: "Sourceable line items" },
  { label: "CPL", note: "Centroid for assembly" },
  { label: "DRC ✓", note: "0 design-rule errors" },
  { label: "ERC ✓", note: "0 electrical-rule errors" },
  { label: "3D RENDER", note: "Mechanical fit verified" },
];

/* ════════════════════════════════════════════════════════════════════════
   THE THREE PORTFOLIO BOARDS
   ════════════════════════════════════════════════════════════════════════ */
export type BoardComponent = { refdes: string; part: string; role: string };

export type Board = {
  id: string; // silkscreen designator e.g. MML-01
  name: string;
  tagline: string;
  problem: string;
  mainSkill: string;
  proves: string;
  firmware: string;
  accent: string;
  specs: { layers: string; mcu: string; power: string; extra: string };
  components: BoardComponent[];
  mfgPack: string[];
  /** bring-up UART log printed when the card is expanded */
  bringup: string[];
};

export const BOARDS: Board[] = [
  {
    id: "MML-01",
    name: "Prototype-to-PCB Sensor Node",
    tagline: "Breadboard mess in, manufacturable board out.",
    problem: "Turn my prototype into a manufacturable board.",
    mainSkill: "Schematic capture + clean 2-layer layout",
    proves:
      "Datasheet-to-schematic capture, shared I2C/SPI buses, a protected analog input, and a tidy 2-layer pour that DRCs clean.",
    firmware: "ESPHome",
    accent: "#00ff41",
    specs: {
      layers: "2-layer · signal + ground pour",
      mcu: "ESP32-S3-WROOM-1",
      power: "USB-C 5V + LiPo · AP2112K-3.3 rail",
      extra: "One shared I2C pull-up pair · one protected ADC input",
    },
    components: [
      { refdes: "U1", part: "ESP32-S3-WROOM-1", role: "Wi-Fi/BLE MCU module — keep-out under antenna" },
      { refdes: "U2", part: "AP2112K-3.3", role: "3.3V LDO — chosen over AMS1117 (low dropout/Iq)" },
      { refdes: "U3", part: "USBLC6-2SC6", role: "USB-C data-line ESD protection" },
      { refdes: "U4", part: "MCP73831", role: "Single-cell LiPo charger (JST-PH input)" },
      { refdes: "U5", part: "BME280", role: "Temp/humidity/pressure on shared I2C bus" },
      { refdes: "R1,R2", part: "5.1k 0402", role: "USB-C CC1/CC2 pull-downs (sink advertise)" },
    ],
    mfgPack: [
      "Gerbers + drill (NPTH/PTH)",
      "BOM.csv (LCSC/Digi-Key MPNs) + CPL.csv",
      "ERC-clean + DRC-clean screenshots",
      "3D render + JLCPCB upload preview",
      "Bring-up photos + REV_A_notes.md",
    ],
    bringup: [
      "$ esphome run sensor-node.yaml",
      "[boot] ESP32-S3 @ 240MHz  flash 8MB",
      "[i2c] scan bus0 ... 0x76 BME280 OK",
      "[adc] ch3 protected input ... 1.642 V",
      "[wifi] associated  rssi -41 dBm",
      ">> BOARD ALIVE",
    ],
  },
  {
    id: "MML-02",
    name: "WLED High-Current Matrix Driver",
    tagline: "Real amps, real copper, clean 5V data.",
    problem: "ESP32 board that handles real current and LEDs.",
    mainSkill: "High-current layout · copper pours · trace-width math · level shifting",
    proves:
      "Power-path trace-width sizing, wide copper pours, bulk decoupling, and a proper 3.3V→5V data level shift for WS2812B.",
    firmware: "WLED",
    accent: "#ffb000",
    specs: {
      layers: "2-layer · wide power pours + ground",
      mcu: "ESP32-S3-WROOM-1",
      power: "Dedicated 5V high-current input · fuse/polyfuse protected",
      extra: "Onboard WS2812B 8×8 matrix · level-shifted data",
    },
    components: [
      { refdes: "U1", part: "ESP32-S3-WROOM-1", role: "Wi-Fi MCU running the LED engine" },
      { refdes: "U2", part: "74AHCT125", role: "3.3V→5V level shifter on the LED data line" },
      { refdes: "J1", part: "XT30 / screw / barrel", role: "Dedicated high-current 5V input" },
      { refdes: "D1", part: "SMBJ5.0A TVS", role: "Input transient / reverse-polarity protection" },
      { refdes: "C1", part: "Bulk electrolytic", role: "Inrush/ripple reservoir at the input" },
      { refdes: "R1", part: "330R series", role: "Series data resistor — tames ringing/EMI" },
    ],
    mfgPack: [
      "Gerbers + drill (widened power-trace notes)",
      "BOM.csv (MPNs) + CPL.csv centroid",
      "ERC-clean + DRC-clean screenshots",
      "3D render + JLCPCB upload preview",
      "Bring-up photos + REV_A_notes.md",
    ],
    bringup: [
      "$ esptool write_flash WLED.bin",
      "[boot] ESP32-S3  WLED 0.14",
      "[pwr] 5V rail 5.02 V  @ 3.6 A peak",
      "[lvl] 74AHCT125 data 3v3->5v OK",
      "[led] WS2812B 64 px  refresh 60 Hz",
      ">> BOARD ALIVE",
    ],
  },
  {
    id: "MML-03",
    name: "24V Industrial-Style I/O Controller",
    tagline: "Talks to 12/24V gear without frying itself.",
    problem: "ESP32 board that interfaces 12/24V equipment safely.",
    mainSkill: "Input protection · buck converter · opto-isolation · mixed-signal",
    proves:
      "24V→5V buck with a tight switching loop, reverse-polarity + TVS front-end, and opto-isolated outputs with a real isolation gap / star ground.",
    firmware: "Tasmota / MQTT",
    accent: "#22d3ee",
    specs: {
      layers: "2-layer · star ground + isolation gap",
      mcu: "ESP32-S3-WROOM-1",
      power: "24V screw input → buck 5V → AP2112K 3.3V",
      extra: "PC817 opto-isolated outputs · optional RS-485",
    },
    components: [
      { refdes: "U1", part: "ESP32-S3-WROOM-1", role: "MQTT / industrial control MCU" },
      { refdes: "U2", part: "24V→5V buck", role: "Step-down with tight switching-node loop" },
      { refdes: "U3", part: "AP2112K-3.3", role: "5V→3.3V LDO for the logic rail" },
      { refdes: "U4", part: "PC817", role: "Opto-isolated digital outputs (across gap)" },
      { refdes: "D1", part: "TVS + Schottky", role: "Surge clamp + reverse-polarity protection" },
      { refdes: "J1", part: "24V screw terminal", role: "Field 12/24V input wiring" },
    ],
    mfgPack: [
      "Gerbers + drill (isolation-gap callouts)",
      "BOM.csv (MPNs) + CPL.csv centroid",
      "ERC-clean + DRC-clean screenshots",
      "3D render + JLCPCB upload preview",
      'Bring-up photos + REV_A_notes.md ("industrial-STYLE demo, not certified")',
    ],
    bringup: [
      "$ tasmota --mqtt broker.local",
      "[boot] ESP32-S3  Tasmota 13",
      "[pwr] 24.1V in -> buck 5.00V -> 3.30V",
      "[iso] PC817 out1..out4  field side OK",
      "[mqtt] connected  topic mml/io/#",
      ">> BOARD ALIVE",
    ],
  },
];

/* ════════════════════════════════════════════════════════════════════════
   CAPABILITY MATRIX — Tier 1 (copper) + Tier 2 (ENIG gold)
   ════════════════════════════════════════════════════════════════════════ */
export type Skill = {
  refdes: string;
  skill: string;
  value: string;
  description: string;
  tier: "1" | "2";
};

export const SKILLS: Skill[] = [
  // ── Tier 1 — Foundation (appears in 80%+ of jobs)
  { tier: "1", refdes: "U1", skill: "Schematic capture in KiCad", value: "KiCad 8.x", description: "Captures the full circuit as a readable, hierarchical schematic." },
  { tier: "1", refdes: "U2", skill: "Footprint creation & library mgmt", value: "FP-LIB", description: "Builds accurate footprints and organized symbol/footprint libraries." },
  { tier: "1", refdes: "U3", skill: "Component selection", value: "DK/Mouser/LCSC", description: "Picks in-stock, appropriate parts from the major distributor catalogs." },
  { tier: "1", refdes: "U4", skill: "BOM with manufacturer part numbers", value: "BOM.csv MPN", description: "Produces a complete BOM with real MPNs for sourcing." },
  { tier: "1", refdes: "U5", skill: "Gerber generation", value: "RS-274X", description: "Exports manufacturer-ready Gerbers for every copper, mask and silk layer." },
  { tier: "1", refdes: "U6", skill: "Drill files", value: "EXCELLON", description: "Generates Excellon drill files for all plated and non-plated holes." },
  { tier: "1", refdes: "U7", skill: "Pick-and-place (CPL) file", value: "CPL.csv", description: "Exports the centroid pick-and-place file for automated assembly." },
  { tier: "1", refdes: "TP1", skill: "DRC clean", value: "DRC-PASS", description: "Resolves all design-rule-check violations for a manufacturable layout." },
  { tier: "1", refdes: "TP2", skill: "ERC clean", value: "ERC-PASS", description: "Resolves all electrical-rule-check errors in the netlist." },
  { tier: "1", refdes: "J1", skill: "JLCPCB workflow end-to-end", value: "JLCPCB-RDY", description: "Runs the full order workflow from upload through assembly review." },
  { tier: "1", refdes: "U8", skill: "2-layer board design", value: "2L · 1.6mm", description: "Designs cost-effective, manufacturable two-layer boards." },
  { tier: "1", refdes: "U9", skill: "Ground plane basics", value: "GND-POUR", description: "Implements solid ground planes for return paths and low noise." },
  { tier: "1", refdes: "C1", skill: "Decoupling capacitor placement", value: "0.1µF ×N", description: "Places decoupling caps tight to IC power pins for a clean supply." },
  { tier: "1", refdes: "U10", skill: "Silkscreen labeling", value: "SILK-WHT", description: "Adds clear white silkscreen for connectors, pins, and assembly." },
  { tier: "1", refdes: "U11", skill: "Datasheet → schematic", value: "DS→SCH", description: "Translates datasheet reference circuits and pinouts into a schematic." },
  { tier: "1", refdes: "C2", skill: "Power budgeting per rail", value: "PWR-BUDGET", description: "Sizes regulators and traces from per-rail current draw." },
  // ── Tier 2 — Differentiators (appears in 50%+ of jobs)
  { tier: "2", refdes: "U12", skill: "ESP32-WROOM/WROVER integration", value: "ESP32-WROOM", description: "Integrates ESP32 modules with correct keep-outs and antenna clearance." },
  { tier: "2", refdes: "D1", skill: "USB-C + CC + ESD", value: "USBLC6-2SC6", description: "USB-C with 5.1k CC pull-downs and USBLC6 ESD protection." },
  { tier: "2", refdes: "U13", skill: "LDO selection", value: "AP2112K-3.3", description: "Selects low-dropout LDOs like AP2112K-3.3 over the dated AMS1117." },
  { tier: "2", refdes: "U14", skill: "I2C / SPI / UART routing", value: "BUS-ROUTE", description: "Routes buses with proper pull-ups and length matching." },
  { tier: "2", refdes: "Q1", skill: "MOSFET / opto driver circuits", value: "MOSFET-DRV", description: "Designs transistor, MOSFET, and optocoupler driver stages." },
  { tier: "2", refdes: "J2", skill: "JST connectors & headers", value: "JST-PH 2.0", description: "Specifies JST connectors and headers for power and signal." },
  { tier: "2", refdes: "TP3", skill: "Test point planning", value: "TP-PLAN", description: "Plans accessible test points for bring-up, debug, and programming." },
  { tier: "2", refdes: "R1", skill: "DFM awareness", value: "6/6 mil", description: "Applies trace/clearance DFM rules matched to fab capabilities." },
  { tier: "2", refdes: "U15", skill: "3D viewer mechanical fit", value: "STEP-3D", description: "Verifies component heights and mechanical fit in the 3D viewer." },
  { tier: "2", refdes: "J3", skill: "Mounting holes / enclosure", value: "M3-MNT", description: "Places mounting holes and plans outline for enclosure fit." },
  { tier: "2", refdes: "U16", skill: "Level shifting 3.3↔5V", value: "74AHCT125", description: "Implements 3.3V↔5V level shifting with a 74AHCT125 buffer." },
  { tier: "2", refdes: "L1", skill: "Buck converter layout", value: "BUCK-LOOP", description: "Lays out bucks with tight switching loops and minimized SW-node area." },
  { tier: "2", refdes: "FB1", skill: "Polyfuse / TVS / reverse-polarity", value: "PTC+TVS+RP", description: "Adds polyfuse, TVS, and reverse-polarity protection to input power." },
];

/* ════════════════════════════════════════════════════════════════════════
   HOW I WORK — power rail (embedded-minded decisions made visible)
   ════════════════════════════════════════════════════════════════════════ */
export type RailStage = { refdes: string; label: string; note: string };

export const POWER_RAIL: RailStage[] = [
  { refdes: "J1", label: "5V IN", note: "USB-C / dedicated input — sized for peak draw, not idle." },
  { refdes: "FB1", label: "POLYFUSE", note: "PTC + TVS clamp the input before anything downstream." },
  { refdes: "Q1", label: "REV-POL", note: "P-MOSFET / Schottky — plug it in backwards, nothing dies." },
  { refdes: "C1", label: "BULK CAP", note: "10µF+ at the module — rides out Wi-Fi TX current spikes (brown-out killer)." },
  { refdes: "U2", label: "AP2112K-3.3", note: "Not AMS1117 — far better dropout, noise, and quiescent current." },
  { refdes: "U1", label: "ESP32-S3", note: "3V3 rail · 0.1µF per VDD pin · one pull-up pair per I2C bus." },
];
