import {
  BOARDS,
  CLIENT_WORK,
  CONTACT_EMAIL,
  DELIVERABLE_ZIP,
  DELIVERABLES,
  FAQ,
  HOURLY_RATE,
  PROJECT_STEPS,
  REPO,
  SERVICES,
  UPWORK_URL,
} from "@/components/pcb/pcbData";
import { PCB2, PCB2_SLUG, PCB2_STATS } from "@/components/pcb2/data";
import { getAllPosts, getPostBody } from "@/lib/posts";
import { SITE } from "@/lib/schema";

/* ════════════════════════════════════════════════════════════════════════
   /llms.txt and /llms-full.txt — the site as plain Markdown for AI
   assistants, following the llmstxt.org convention.

   Built at build time from the same data the pages render, so neither file
   can say something the site does not. llms.txt is the short guide: who,
   what, price, how to hire, and where to read more. llms-full.txt adds
   every service, project and answer in full, and the full text of every
   Field Note.
   ════════════════════════════════════════════════════════════════════════ */

const SUMMARY = `Ray Malik is a freelance PCB design engineer working as MuffinByteLabs. He takes a board from an idea to a package a factory can build from (schematic, 2- and 4-layer layout, Gerbers, drill, BOM and pick-and-place) and reviews existing designs before they are ordered. ${HOURLY_RATE} an hour, or a fixed price quoted in writing within 24 hours.`;

const FACTS = [
  "Boards: ESP32 and STM32 microcontroller boards, sensor and measurement boards, USB-C power and protection, relay and LED drivers, and isolated industrial I/O (RS-485, CAN).",
  `Price: ${HOURLY_RATE} an hour for open-ended work. A defined job gets a fixed price in writing within 24 hours, with a money-back guarantee written into the contract.`,
  "Files: delivered in the client's own EDA tool. Every manufacturing package passes its DRC and ERC checks with zero errors before it is handed over.",
  "Works remotely with clients anywhere, and signs an NDA before any files are shared when asked.",
  `Hire: email ${CONTACT_EMAIL}, or through Upwork at ${UPWORK_URL}`,
];

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE}${p}`);
const serviceUrl = (id: string) => `${SITE}/services#${id.toLowerCase()}`;

function head(): string[] {
  return ["# Ray Malik — MuffinByteLabs", "", `> ${SUMMARY}`, "", ...FACTS.map((f) => `- ${f}`)];
}

function pages(): string[] {
  const pcb1 = BOARDS[0];
  return [
    "## Pages",
    "",
    `- [Home](${SITE}/): recent client projects, two of Ray's own boards in full, what a delivery contains, how a project runs, and answers to the questions clients ask first.`,
    `- [Services](${SITE}/services): ${SERVICES.length} services, from a pre-fab design review to a new board from idea to fab, each with its turnaround.`,
    `- [${PCB2.id}: ${PCB2.name}](${SITE}${PCB2_SLUG}): case study. ${PCB2.tagline}`,
    `- [${pcb1.id}: ${pcb1.name}](${REPO.url}): the complete project, public on GitHub. ${pcb1.summary}`,
    `- [Sample delivery package](${abs(DELIVERABLE_ZIP)}): the folder every job is delivered in, as a zip.`,
    `- [Field Notes](${SITE}/blog): articles on PCB layout, power, manufacturing files and board bring-up.`,
  ];
}

function services(full: boolean): string[] {
  return [
    "## Services",
    "",
    ...SERVICES.flatMap((s) => {
      const line = `- [${s.title}](${serviceUrl(s.id)}): ${s.desc} Turnaround: ${s.turnaround}.`;
      return full ? [line, ...s.bullets.map((b) => `  - ${b}`)] : [line];
    }),
  ];
}

function clientWork(): string[] {
  return [
    "## Recent client projects",
    "",
    "Boards and circuits engineered for clients. The designs belong to the clients, so the descriptions stay general and no client is named.",
    "",
    ...CLIENT_WORK.map((c) => `- **${c.title}** (${c.kind}): ${c.summary} (${c.facts.join("; ")})`),
  ];
}

function ownBoards(): string[] {
  const pcb1 = BOARDS[0];
  return [
    "## Ray's own boards, published in full",
    "",
    `### ${pcb1.id}: ${pcb1.name}`,
    "",
    pcb1.summary,
    "",
    `Specs: ${pcb1.specs.join(", ")}. The whole project is public: ${REPO.url}`,
    "",
    `### ${PCB2.id}: ${PCB2.name}`,
    "",
    `${PCB2.tagline} ${PCB2.summary}`,
    "",
    `Specs: ${PCB2.specs.join(", ")}.`,
    "",
    ...PCB2_STATS.map((s) => `- ${s.value}: ${s.label}`),
    "",
    `Case study: ${SITE}${PCB2_SLUG}`,
  ];
}

function delivery(): string[] {
  return [
    "## What a delivery contains",
    "",
    `Every job is delivered as one organized folder. A real one can be downloaded: ${abs(DELIVERABLE_ZIP)}`,
    "",
    ...DELIVERABLES.map((d) => `- \`${d.name}\`: ${d.note}`),
  ];
}

function projectSteps(): string[] {
  return ["## How a project runs", "", ...PROJECT_STEPS.map((s) => `${Number(s.num)}. **${s.title}.** ${s.body}`)];
}

function questions(): string[] {
  return ["## Questions clients ask first", "", ...FAQ.flatMap((f) => [`### ${f.q}`, "", f.a, ""])];
}

function notesList(): string[] {
  return ["## Field Notes", "", ...getAllPosts().map((p) => `- [${p.title}](${SITE}/blog/${p.slug}): ${p.excerpt}`)];
}

/** Push a post's own headings down two levels, so a "## Section" inside a
    post sits under the post's "### Title". Code fences are left alone. */
function demote(md: string, by: number): string {
  let fenced = false;
  return md
    .split("\n")
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      return !fenced && /^#{1,6}\s/.test(line) ? "#".repeat(by) + line : line;
    })
    .join("\n");
}

function notesFull(): string[] {
  return [
    "## Field Notes",
    "",
    ...getAllPosts().flatMap((p) => [
      `### ${p.title}`,
      "",
      `${SITE}/blog/${p.slug} · ${p.date} · ${p.tag}`,
      "",
      demote(getPostBody(p.slug), 2),
      "",
    ]),
  ];
}

function optional(full: boolean): string[] {
  return [
    "## Optional",
    "",
    `- [STM32F407 Memory Map Explorer](${SITE}/memory-map): a free interactive tool for the STM32F407 address space, with register views and address, bit-band and baud-rate calculators.`,
    `- [RSS feed](${SITE}/feed.xml): new Field Notes as they are published.`,
    ...(full
      ? []
      : [`- [Everything in full](${SITE}/llms-full.txt): every service, project and answer, and the full text of every Field Note.`]),
  ];
}

function join(sections: string[][]): string {
  return sections.map((s) => s.join("\n").trimEnd()).join("\n\n") + "\n";
}

export function llmsTxt(): string {
  return join([head(), pages(), services(false), clientWork(), questions(), notesList(), optional(false)]);
}

export function llmsFullTxt(): string {
  return join([
    head(),
    pages(),
    services(true),
    clientWork(),
    ownBoards(),
    delivery(),
    projectSteps(),
    questions(),
    notesFull(),
    optional(true),
  ]);
}
