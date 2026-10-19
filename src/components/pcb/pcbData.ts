/* ════════════════════════════════════════════════════════════════════════
   PCB DESIGN — single source of truth for every section on the homepage.
   Keep all part numbers / specs technically correct: a PCB-literate client
   will scrutinize them (one pull-up pair per I2C bus, AP2112K over AMS1117,
   IPC-2221 trace widths, creepage on the 24V side, etc.).

   Tool-neutral on purpose (Oct 2026): the practice works in whatever EDA
   tool the client's team uses, so no copy here names one.
   ════════════════════════════════════════════════════════════════════════ */

/* ---- Palette — "Midnight Fab": plum soldermask, ENIG gold, copper, silk ---- */
export const PCB = {
  bg: "#0d0c11",
  green: "#3ddc84", // status mint: powered / alive / DRC-pass ONLY
  greenDim: "#2aa866",
  purple: "#b98aff", // rarely used secondary
  soldermask: "#1f1430", // board surface (passive, midnight plum)
  soldermaskLit: "#2b1c42", // hover / energized board surface
  copper: "#b87333", // at-rest copper traces
  copperBright: "#e8a85c", // energized / current-carrying copper
  enig: "#d4af37", // pads, holes, test points, CTAs, Tier-2 skills
  enigBright: "#f0d488", // pad highlight
  silk: "#eae6da", // silkscreen ink (warm white)
  drill: "#0b0714", // drill / via interiors
  comm: "#5ec8e5", // I2C/SPI/UART buses, net highlight
  error: "#ff6b66", // DRC violation flash (sparingly)
} as const;

/* ---- Contact — one address, one mailto, declared once ------------------
   The body is a brief template: inbound mail otherwise arrives as "I need
   a PCB" with none of the four facts a quote actually needs. A prefilled
   mailto costs the sender nothing and needs no third-party form endpoint. */
export const CONTACT_EMAIL = "muffinbytelabs@gmail.com";
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "PCB project"
)}&body=${encodeURIComponent(
  [
    "What the board does:",
    "",
    "Target fab and quantity:",
    "",
    "Files you already have (design files, PDF, DXF, image):",
    "",
    "Deadline:",
    "",
  ].join("\n")
)}`;

/* ════════════════════════════════════════════════════════════════════════
   SERVICES — new boards, pre-fab reviews, and fixes to existing projects.
   ════════════════════════════════════════════════════════════════════════ */
export type Service = {
  id: string;
  title: string;
  desc: string;
  bullets: string[];
  turnaround: string;
  /** one link to public evidence of this exact kind of work, where it exists */
  sample?: { label: string; href: string; external?: boolean };
};

/* Ordered the way the work actually arrives: a review is the cheapest way
   to try me, so it leads. Each service points at a piece of public evidence
   — the same honesty bar as everything else on the site. */
export const SERVICES: Service[] = [
  {
    id: "SVC-01",
    title: "Pre-fab design review",
    desc: "A second set of eyes on your board before you spend money at the fab. A review is a document — and you can read the ones my own board went through before you pay for one.",
    bullets: [
      "DRC / ERC / DFM check against your fab's real capability sheet",
      "Footprint & part sanity pass — stock, lifecycle, polarity, pin-1, keep-outs",
      "Written findings ranked by severity, with a concrete recommendation on each",
    ],
    turnaround: "most reviews back in 24–48h",
    sample: {
      label: "Read a real review",
      href: "https://github.com/MuffinByteLabs/esp32s3-plant-monitor/blob/main/docs/reviews/Design_Review_RevA_2026-07-20.md",
      external: true,
    },
  },
  {
    id: "SVC-02",
    title: "Conversion & redraw",
    desc: "A design that only exists as a PDF, DXF, image or an old project, redrawn as a clean, editable project in the EDA tool your team uses.",
    bullets: [
      "Redrawn sheet by sheet with checked symbols and footprints — not auto-traced",
      "ERC-clean, with a parity pass against the original before hand-off",
      "Delivered as the full package: source files, PDF schematic, project-local libraries",
    ],
    turnaround: "quoted per sheet count",
  },
  {
    id: "SVC-03",
    title: "Debug & bring-up help",
    desc: "The board is back from the fab and won't enumerate, keeps resetting, or runs hot. Worked from your files, photos and guided bench measurements.",
    bullets: [
      "A staged bring-up plan — unpowered checks, current-limited first power, rails, buses, firmware",
      "USB enumeration, brownout and reset-loop diagnosis against the schematic",
      "Written findings with the fix — and the Rev-B change if the copper is at fault",
    ],
    turnaround: "first read of your files within a day",
    sample: {
      label: "How I approach it",
      href: "/blog/usb-c-wont-enumerate",
    },
  },
  {
    id: "SVC-04",
    title: "New board, idea to fab",
    desc: "From a concept, breadboard prototype, or draft schematic to a manufacturing-ready project.",
    bullets: [
      "Schematic capture + component selection from in-stock LCSC / Digi-Key parts",
      "Clean 2-layer & 4-layer layout — ESP32 and STM32, sensors, USB-C, protected power, isolated I/O",
      "Full JLCPCB / PCBWay package: Gerbers, drill, BOM with LCSC / Digi-Key part numbers, CPL, PDF schematic, 3D render",
    ],
    turnaround: "small boards in days, not weeks",
    sample: {
      label: "A finished one, published in full",
      href: "https://github.com/MuffinByteLabs/esp32s3-plant-monitor",
      external: true,
    },
  },
  {
    id: "SVC-05",
    title: "Fix, revise & finish",
    desc: "Work inside your existing project, in your tool, without breaking what already works.",
    bullets: [
      "Schematic edits, re-routes, and Rev-B board revisions",
      "Power & thermal fixes — pours, thermal vias, trace widths sized to current",
      "Half-finished projects taken through to a complete manufacturing package",
    ],
    turnaround: "scoped and quoted up front",
    sample: {
      label: "What my Rev-B notes look like",
      href: "https://github.com/MuffinByteLabs/esp32s3-plant-monitor/blob/main/docs/RevB_Upgrade_Plan.md",
      external: true,
    },
  },
];

/* ════════════════════════════════════════════════════════════════════════
   THE DELIVERABLE — one organized folder, the same shape on every job.

   This is not a mock-up: it is the layout of PCB 1's real package, which
   scripts/build-sample-package.cjs assembles from the published repo into
   public/downloads/. Change a folder here and the script must change with
   it — the homepage offers the zip right under this tree.
   ════════════════════════════════════════════════════════════════════════ */
export type DeliverableNode = {
  name: string;
  note: string;
  kind: "dir" | "file";
  /** the folder the fab actually receives — drawn in gold */
  hi?: boolean;
};

export const DELIVERABLE_ROOT = "pcb1-plant-monitor_rev-A/";
export const DELIVERABLE_ZIP = "/downloads/pcb1-plant-monitor_rev-A.zip";

export const DELIVERABLES: DeliverableNode[] = [
  { name: "01_schematic/", note: "The full schematic, as a PDF", kind: "dir" },
  { name: "02_source/", note: "The editable project: schematic, board, libraries", kind: "dir" },
  { name: "03_fabrication/", note: "Gerbers + drill, exactly as uploaded", kind: "dir", hi: true },
  { name: "04_assembly/", note: "BOM with real part numbers, pick-and-place", kind: "dir" },
  { name: "05_3d/", note: "Renders and a 3D model for the enclosure", kind: "dir" },
  { name: "06_docs/", note: "Design document, six reviews, bring-up guide", kind: "dir" },
  { name: "07_firmware/", note: "Bring-up firmware, when the job includes it", kind: "dir" },
  { name: "README.md", note: "Which folder is for whom", kind: "file" },
  { name: "CHANGELOG.md", note: "Every step of the revision, dated", kind: "file" },
];

/* ════════════════════════════════════════════════════════════════════════
   THE PUBLIC REPOSITORY — PCB 1, published in full.

   Rendered as the "Files" tab on PCB 1's card: the design source, the
   frozen package uploaded to the fab, the firmware, and the review records
   that produced it.
   ════════════════════════════════════════════════════════════════════════ */
export const REPO = {
  url: "https://github.com/MuffinByteLabs/esp32s3-plant-monitor",
  owner: "MuffinByteLabs",
  name: "esp32s3-plant-monitor",
  board: "PCB 1",
} as const;

export type RepoDir = { path: string; name: string; note: string };

export const REPO_TREE: RepoDir[] = [
  {
    path: "hardware",
    name: "hardware/",
    note: "The design source: 8-sheet hierarchical schematic, the 4-layer board and its libraries.",
  },
  {
    path: "fabrication",
    name: "fabrication/",
    note: "The exact Gerbers, drill, BOM and CPL that were uploaded — archived, not regenerated.",
  },
  {
    path: "firmware",
    name: "firmware/",
    note: "Arduino sketch for the ESP32-S3: deep-sleep wake cycle, three sensors, MQTT with Home Assistant discovery, and the battery cut-offs the hardware calls for.",
  },
  {
    path: "docs",
    name: "docs/",
    note: "Design document, six review records, bring-up guide and the Rev B plan.",
  },
  {
    path: "references",
    name: "references/",
    note: "Every datasheet the design decisions were made from.",
  },
];

/* ── open it in the browser ────────────────────────────────────────────
   The documents a client can judge in ten seconds without installing
   anything. Each is a deep link, not a folder to hunt through. Paths
   verified against the repo (main, Oct 2026). */
export const REPO_READS: { label: string; note: string; path: string }[] = [
  {
    label: "Pre-fab design review",
    note: "findings ranked by severity, and what was done about each",
    path: "blob/main/docs/reviews/Design_Review_RevA_2026-07-20.md",
  },
  {
    label: "Schematic — 8 sheets (PDF)",
    note: "the whole design, readable without any EDA tool",
    path: "blob/main/docs/ESP32S3_PlantMonitor_RevA_Schematic.pdf",
  },
  {
    label: "The design document",
    note: "every part on the board has a paragraph saying why it is there",
    path: "blob/main/docs/ESP32S3_Plant_Monitor_Final_Design_Document.md",
  },
  {
    label: "Firmware",
    note: "the wake cycle, the hardware contract it enforces, and how to build it",
    path: "tree/main/firmware",
  },
  {
    label: "Fab layer plots (PDF)",
    note: "copper, mask and silk, plotted the way the fab sees them",
    path: "blob/main/docs/ESP32S3_PlantMonitor_RevA_FabLayers.pdf",
  },
  {
    label: "Order notes",
    note: "the JLCPCB order — settings, remarks, pre-upload checks",
    path: "blob/main/fabrication/revA/ORDER_NOTES.md",
  },
];

/* ════════════════════════════════════════════════════════════════════════
   THE PORTFOLIO BOARDS

   Deliberately thin. A client scrolling a portfolio wants to know what the
   board is and to see it — not to read a design review. The engineering
   detail lives in the repo, the case study and Field Notes.
   ══════════════════════════════════════════════════════════════════════ */

export type BoardImage = {
  src: string;
  alt: string;
  tag: string;
  caption: string;
  /* the file's real pixel dimensions: a guessed aspect ratio reserves the
     wrong height and the page shifts when the lazy image decodes */
  width: number;
  height: number;
};

export type Board = {
  id: string; // silkscreen designator
  name: string;
  /** a long-form case study on this site, where one exists */
  caseStudy?: string;
  /** one sentence: what it is and who it is for */
  summary: string;
  accent: string;
  /** the short spec line under the title */
  specs: string[];
  /** rotatable 3D model of the board, if one exists */
  model?: string;
  /** public repository, where the whole project can be read */
  repo?: { url: string; owner: string; name: string };
  /** photographs of the assembled board */
  photos?: BoardImage[];
  /** 3D renders — captioned, and labelled as renders */
  images?: BoardImage[];
};

export const BOARDS: Board[] = [
  {
    id: "PCB 1",
    name: "ESP32-S3 Wi-Fi Plant Monitor",
    summary:
      "A battery-powered Wi-Fi sensor node — temperature, humidity, pressure, light and soil moisture — on four layers, with deep-sleep firmware that reports over MQTT.",
    accent: "#8a5a12",
    specs: ["62.5 × 44.5 mm", "4-layer", "ESP32-S3", "USB-C + LiPo"],
    model: "/boards/mml01.glb",
    /* one URL, declared once in REPO above */
    repo: { url: REPO.url, owner: REPO.owner, name: REPO.name },
    photos: [
      {
        src: "/boards/pcb1-photo-front.webp",
        tag: "Assembled",
        alt: "The assembled ESP32-S3 Plant Monitor board: ESP32-S3-WROOM-1 module at the top, USB-C on the left, BOOT and RESET buttons, BME280 and VEML7700 sensors on the right, and battery and soil-probe connectors along the bottom edge",
        caption: "ESP32-S3 module, USB-C, two sensors, battery and soil connectors — every test point labelled.",
        width: 1448,
        height: 1086,
      },
      {
        src: "/boards/pcb1-photo-back.webp",
        tag: "Back",
        alt: "The back of the assembled board: routing over the ground planes, the through-hole UART pads, and a silkscreen block reading ESP32-S3 Plant Monitor, Rev A 2026-08, MuffinByteLabs.com, Designed by Ray Malik",
        caption: "The back carries the ID block every board ships with — name, revision, date, and who to ask.",
        width: 1448,
        height: 1086,
      },
    ],
    images: [
      {
        src: "/boards/mml01-3d-top.webp",
        tag: "Populated",
        alt: "3D render of PCB 1 fully populated, seen from above: the ESP32-S3 module with its antenna overhanging the top edge, USB-C on the left edge, BOOT and RESET buttons, BME280 and VEML7700 sensors on the right, and battery and soil connectors along the bottom",
        caption: "Every part placed and checked for fit in 3D before the board was ordered.",
        width: 1400,
        height: 951,
      },
      {
        src: "/boards/mml01-3d-iso.webp",
        tag: "Bare board",
        alt: "Angled 3D render of the bare PCB 1 board showing the routed copper, the module's exposed ground pad with its stitching vias, twelve gold test points and four M3 mounting holes",
        caption: "The same board stripped back to bare copper, test points and mounting holes.",
        width: 1400,
        height: 1064,
      },
      {
        src: "/boards/mml01-3d-bottom.webp",
        tag: "Bottom",
        alt: "3D render of the PCB 1 bottom side: light routing over the plane pair, the through-hole UART recovery pads, and the silkscreen ID block",
        caption: "The bottom side as drawn, before it was built.",
        width: 1544,
        height: 1152,
      },
    ],
  },

  {
    id: "PCB 2",
    name: "STM32 Industrial I/O Controller",
    summary:
      "A four-layer controller for 12/24 V equipment: it reads industrial sensors, switches real DC loads, drives a 0–10 V actuator and talks isolated RS-485 and CAN FD — with every energy output behind a hardware permission gate.",
    accent: "#3d6b8a",
    specs: ["140 × 100 mm", "4-layer", "STM32G474VET6", "9–30 V DC"],
    caseStudy: "/work/stm32-industrial-io",
  },
];

/* ════════════════════════════════════════════════════════════════════════
   CONTACT — how a job starts
   ════════════════════════════════════════════════════════════════════════ */
export type Pillar = { num: string; title: string; body: string };

export const CONTACT_STEPS: Pillar[] = [
  {
    num: "01",
    title: "Send the brief",
    body: "What the board does, your target fab, and any files you already have — a paragraph is enough to start.",
  },
  {
    num: "02",
    title: "Fixed quote in 24h",
    body: "Scope, price, and timeline in writing. NDA signed first if your project needs one.",
  },
  {
    num: "03",
    title: "Contract, then work",
    body: "A signed contract with the money-back guarantee written in: if delivery misses the agreed scope, you get a refund. Then the board gets built.",
  },
];
