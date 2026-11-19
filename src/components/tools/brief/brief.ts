/* ════════════════════════════════════════════════════════════════════════
   The project brief builder's questions, and the plain-text brief they
   turn into. The questions are the ones a quote depends on; every one is
   optional, and an empty answer simply leaves its line out.

   Nothing here leaves the visitor's browser: the brief is copied, or
   handed to their own email app as a mailto link.

   No imports, so this file can be checked on its own with node.
   ════════════════════════════════════════════════════════════════════════ */

export type Brief = {
  project: string;
  what: string;
  users: string;
  environment: string[];
  stage: string;
  power: string[];
  powerNotes: string;
  chip: string;
  links: string[];
  parts: string;
  size: string;
  enclosure: string;
  protoQty: string;
  prodQty: string;
  unitCost: string;
  fab: string;
  deadline: string;
  budget: string;
  certs: string[];
  existing: string;
  name: string;
  company: string;
};

export const EMPTY_BRIEF: Brief = {
  project: "",
  what: "",
  users: "",
  environment: [],
  stage: "",
  power: [],
  powerNotes: "",
  chip: "",
  links: [],
  parts: "",
  size: "",
  enclosure: "",
  protoQty: "",
  prodQty: "",
  unitCost: "",
  fab: "",
  deadline: "",
  budget: "",
  certs: [],
  existing: "",
  name: "",
  company: "",
};

export const OPTIONS = {
  environment: ["Indoors", "Outdoors", "Industrial", "In a vehicle", "Worn or carried", "Battery-powered for months"],
  stage: ["Just an idea", "A breadboard or dev-kit prototype", "A schematic", "An existing board to change", "A finished design to review"],
  power: ["USB-C", "Battery", "Wall adapter", "12 V or 24 V supply", "Mains (needs isolation)", "Not sure yet"],
  chip: ["ESP32", "STM32", "RP2040", "nRF52", "No preference", "Something else"],
  links: ["Wi-Fi", "Bluetooth", "USB data", "Ethernet", "CAN", "RS-485", "LoRa", "Cellular", "GPS"],
  enclosure: ["No enclosure yet", "An off-the-shelf box", "A custom enclosure", "It must fit an existing product"],
  fab: ["JLCPCB", "PCBWay", "My own manufacturer", "No idea yet"],
  budget: ["Under $500", "$500–$1,500", "$1,500–$5,000", "Over $5,000", "Not sure yet"],
  certs: ["CE", "FCC", "UL", "None", "Not sure"],
} as const;

const line = (label: string, value: string | string[]) => {
  const v = Array.isArray(value) ? value.join(", ") : value.trim();
  return v ? `${label}: ${v}` : "";
};

/** the brief as plain text; sections with no answers are left out */
export function formatBrief(b: Brief, source: string): string {
  const sections: [string, string[]][] = [
    ["What it is", [b.what.trim(), line("Used by / where", b.users), line("Environment", b.environment)]],
    ["Where it stands", [line("Starting point", b.stage), line("What exists already", b.existing)]],
    ["Power", [line("Power from", b.power), line("Notes", b.powerNotes)]],
    ["Electronics", [line("Main chip", b.chip), line("Connectivity", b.links), line("Sensors, displays, motors and other parts", b.parts)]],
    ["Size and enclosure", [line("Board size limit", b.size), line("Enclosure", b.enclosure)]],
    [
      "Quantities and cost",
      [line("Prototypes", b.protoQty), line("First production run", b.prodQty), line("Target cost per board", b.unitCost), line("Manufacturer", b.fab)],
    ],
    ["Timeline and budget", [line("Deadline", b.deadline), line("Design budget", b.budget), line("Certifications", b.certs)]],
  ];

  const title = b.project.trim() ? `PCB PROJECT BRIEF: ${b.project.trim()}` : "PCB PROJECT BRIEF";
  const out: string[] = [title, ""];
  let n = 0;
  for (const [heading, rows] of sections) {
    const filled = rows.filter(Boolean);
    if (!filled.length) continue;
    n++;
    out.push(`${n}. ${heading.toUpperCase()}`, ...filled, "");
  }
  const who = [b.name.trim(), b.company.trim()].filter(Boolean).join(", ");
  if (who) out.push(`From: ${who}`, "");
  out.push(`Written with ${source}`);
  return out.join("\n");
}

/** how many of the questions have an answer, for the progress line */
export function answered(b: Brief): number {
  return Object.values(b).filter((v) => (Array.isArray(v) ? v.length > 0 : String(v).trim() !== "")).length;
}

export const QUESTION_COUNT = Object.keys(EMPTY_BRIEF).length;
