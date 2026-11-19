/* ════════════════════════════════════════════════════════════════════════
   The free tools, declared once. The /tools page, the footer, the sitemap,
   the structured data and /llms.txt all read this list, so a tool can't be
   listed in one place and missing from another.

   Two audiences, on purpose: engineers who search for a number they need
   today, and product teams who search for what a board costs or what a
   word means. Each tool page sells by being useful, then points at the
   service it is closest to.
   ════════════════════════════════════════════════════════════════════════ */

export type ToolAudience = "engineers" | "clients";

export type Tool = {
  slug: string;
  path: string;
  /** the name on cards and in breadcrumbs */
  name: string;
  /** the page's <title> */
  title: string;
  /** the meta description: what the page does, in a results snippet */
  description: string;
  /** one line for the cards */
  blurb: string;
  audience: ToolAudience;
  /** schema.org applicationCategory, or "reference" for a page that is not an app */
  category: "DeveloperApplication" | "BusinessApplication" | "reference";
  icon: "cpu" | "bolt" | "thermo" | "gauge" | "file" | "book" | "map";
  /** content date for the sitemap and structured data; bump when the page changes */
  date: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "esp32-s3-pinout",
    path: "/tools/esp32-s3-pinout",
    name: "ESP32-S3 pin planner",
    title: "ESP32-S3 Pinout & Pin Planner (WROOM-1) | MuffinByteLabs",
    description:
      "Interactive ESP32-S3-WROOM-1 pinout. Click a pin to see its functions, which GPIOs are strapping pins, which USB, JTAG and PSRAM take, and which are safe to use.",
    blurb: "Click any pin of the WROOM-1 module: what it can do, and whether it is safe to use in your setup.",
    audience: "engineers",
    category: "DeveloperApplication",
    icon: "cpu",
    date: "2026-11-19",
  },
  {
    slug: "buck-converter-calculator",
    path: "/tools/buck-converter-calculator",
    name: "Buck converter calculator",
    title: "Buck Converter Calculator: Inductor & Capacitors | MuffinByteLabs",
    description:
      "Free buck converter calculator: duty cycle, inductor value, ripple and peak current, minimum output and input capacitance, from the standard power-stage equations.",
    blurb: "Duty cycle, inductor, peak current and the capacitors a step-down converter needs.",
    audience: "engineers",
    category: "DeveloperApplication",
    icon: "bolt",
    date: "2026-11-19",
  },
  {
    slug: "pcb-trace-width-calculator",
    path: "/tools/pcb-trace-width-calculator",
    name: "PCB trace width calculator",
    title: "PCB Trace Width Calculator (IPC-2221) | MuffinByteLabs",
    description:
      "Find the trace width for a current and temperature rise, per IPC-2221: outer and inner layers, any copper weight, plus resistance, voltage drop and power loss.",
    blurb: "The width a trace needs for its current, per IPC-2221, with its resistance and voltage drop.",
    audience: "engineers",
    category: "DeveloperApplication",
    icon: "thermo",
    date: "2026-11-19",
  },
  {
    slug: "pcb-design-cost-calculator",
    path: "/tools/pcb-design-cost-calculator",
    name: "PCB design cost estimator",
    title: "PCB Design Cost Calculator: Hours, Price & Time | MuffinByteLabs",
    description:
      "How much does PCB design cost? Pick the job, the board's size and features, and get a ballpark in hours, dollars and working days, at $30 an hour.",
    blurb: "A ballpark for your board in hours, dollars and working days, before you ask for a quote.",
    audience: "clients",
    category: "BusinessApplication",
    icon: "gauge",
    date: "2026-11-19",
  },
  {
    slug: "pcb-design-brief",
    path: "/tools/pcb-design-brief",
    name: "PCB project brief builder",
    title: "PCB Design Brief Template & Builder | MuffinByteLabs",
    description:
      "Answer a few questions and get a complete PCB design brief: what it does, power, chips, size, quantities, timeline and budget. Copy it or email it for a quote.",
    blurb: "Answer a few questions; get the brief a designer needs to quote your board.",
    audience: "clients",
    category: "BusinessApplication",
    icon: "file",
    date: "2026-11-19",
  },
  {
    slug: "pcb-glossary",
    path: "/tools/pcb-glossary",
    name: "PCB terms in plain English",
    title: "PCB Terms in Plain English: Gerber, BOM, DFM | MuffinByteLabs",
    description:
      "Gerber files, BOM, pick-and-place, DFM, vias, ENIG, NRE: the PCB and electronics words you will hear on a hardware project, explained in plain English.",
    blurb: "Gerber, BOM, DFM, NRE and the rest, explained for people who don't design boards.",
    audience: "clients",
    category: "reference",
    icon: "book",
    date: "2026-11-19",
  },
];

/** the older tool that lives outside /tools, listed with the others */
export const MEMORY_MAP_TOOL = {
  path: "/memory-map",
  name: "STM32F407 memory map explorer",
  blurb: "The STM32F407's whole address space as one tree, with register views and calculators.",
  icon: "map" as const,
};

export const TOOLS_HUB = {
  path: "/tools",
  title: "Free PCB Design Tools & Calculators | MuffinByteLabs",
  description:
    "Free tools for PCB engineers and product teams: an ESP32-S3 pin planner, buck converter and trace width calculators, a design cost estimator, a brief builder and a glossary.",
  date: "2026-11-19",
  /** the hub's share card, drawn by scripts/gen-tool-og.cjs */
  image: "/og/tools.png",
};

/** a tool's share card, drawn by scripts/gen-tool-og.cjs; run it after
    adding a tool, or the link previews with a missing image */
export const toolCard = (slug: string) => `/og/tool-${slug}.png`;

export function toolBySlug(slug: string): Tool {
  const t = TOOLS.find((x) => x.slug === slug);
  if (!t) throw new Error(`No tool "${slug}" in src/lib/tools.ts`);
  return t;
}

/** Field Notes that a tool continues: the post page shows the tool under it. */
export const POST_TOOLS: Record<string, string> = {
  "trace-width-is-a-thermal-problem": "pcb-trace-width-calculator",
  "protecting-the-input": "pcb-trace-width-calculator",
  "reading-your-fabs-capability-sheet": "pcb-trace-width-calculator",
  "buck-converter-layout-the-hot-loop": "buck-converter-calculator",
  "ap2112k-vs-ams1117": "buck-converter-calculator",
  "decoupling-placement-beats-value": "buck-converter-calculator",
  "firmware-constraints-behind-the-layout": "esp32-s3-pinout",
  "level-shifting-for-ws2812b": "esp32-s3-pinout",
  "usb-c-wont-enumerate": "esp32-s3-pinout",
  "one-pull-up-pair-per-i2c-bus": "esp32-s3-pinout",
  "rev-a-notes": "esp32-s3-pinout",
  "what-actually-ships-to-the-fab": "pcb-glossary",
  "bom-discipline": "pcb-glossary",
  "opto-isolation-and-creepage": "pcb-glossary",
  "ground-planes-and-return-paths": "pcb-glossary",
  "footprint-libraries-that-dont-rot": "pcb-glossary",
  "bring-up-order-smoke-rails-buses-firmware": "pcb-design-brief",
  "pcb-layout-mistakes-a-review-catches": "pcb-trace-width-calculator",
  "esp32-s3-strapping-pins": "esp32-s3-pinout",
  "how-much-does-pcb-design-cost": "pcb-design-cost-calculator",
  "how-to-write-a-pcb-design-brief": "pcb-design-brief",
  "choosing-a-buck-converter-inductor": "buck-converter-calculator",
  "2-layer-vs-4-layer-pcb": "pcb-glossary",
};
