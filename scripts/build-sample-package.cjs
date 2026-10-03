/* Builds public/downloads/pcb1-plant-monitor_rev-A.zip — PCB 1's real
   hand-off, laid out in the same numbered folders the Deliverables section
   promises every client. The section on the homepage reads its file tree and
   size from this zip's layout, so the site and the download cannot disagree.

       node scripts/build-sample-package.cjs

   Every file comes from the PUBLISHED repository (`origin/main` of the local
   clone), never from uncommitted local edits, so nothing ships here that is
   not already public. Datasheets in references/ are left out: they are the
   vendors' documents, not the deliverable.

   The zip is written by a small built-in writer (zlib deflate + CRC-32), so
   there is nothing to install. Timestamps are pinned to the source commit,
   so re-running on an unchanged repo produces an identical file.

   Repo location: ../PCB_Design/projects/ESP32S3_PlantMonitor_RevA beside
   this site, or set PCB1_REPO. */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { execFileSync } = require("child_process");

const REPO = process.env.PCB1_REPO || path.resolve(process.cwd(), "../PCB_Design/projects/ESP32S3_PlantMonitor_RevA");
const REF = "origin/main";
const ROOT = "pcb1-plant-monitor_rev-A";
const OUT = path.join(process.cwd(), "public", "downloads", `${ROOT}.zip`);
const MODEL = path.join(process.cwd(), "public", "boards", "mml01.glb");

const git = (...args) => execFileSync("git", ["-C", REPO, ...args], { maxBuffer: 64 * 1024 * 1024 });

/* ── where each published file lands in the package ──────────────────── */
function place(file) {
  const base = path.posix.basename(file);
  if (file.startsWith("references/") || file === ".gitignore" || file === "README.md") return null;
  if (file === "LICENSE") return "LICENSE";
  if (file === "docs/ESP32S3_PlantMonitor_RevA_Schematic.pdf") return `01_schematic/${base}`;
  if (file.startsWith("hardware/")) return `02_source/${file.slice("hardware/".length)}`;
  if (file === "fabrication/revA/GERBER-ESP32S3_PlantMonitor.zip") return `03_fabrication/${base}`;
  if (file === "fabrication/revA/ORDER_NOTES.md") return `03_fabrication/${base}`;
  if (file === "docs/ESP32S3_PlantMonitor_RevA_FabLayers.pdf") return `03_fabrication/${base}`;
  if (file === "docs/Fabrication_File_Primer.md") return `03_fabrication/${base}`;
  if (/^fabrication\/revA\/(BOM|CPL)-/.test(file)) return `04_assembly/${base}`;
  if (/^docs\/ESP32S3_PlantMonitor_RevA_BOM\.(md|xlsx)$/.test(file)) return `04_assembly/${base}`;
  if (/^docs\/images\/board_(top|bottom|iso)\.png$/.test(file)) return `05_3d/${base}`;
  if (file.startsWith("docs/images/")) return `06_docs/images/${base}`;
  if (file.startsWith("docs/")) return `06_docs/${file.slice("docs/".length)}`;
  if (file.startsWith("firmware/")) return `07_firmware/${file.slice("firmware/".length)}`;
  return null; // anything else in fabrication/ is the repo's own index
}

/* ── the two files written for the package itself ─────────────────────── */
const README = `# PCB 1 — ESP32-S3 Wi-Fi Plant Monitor, Rev A

Ray Malik · MuffinByteLabs · muffinbytelabs.com · muffinbytelabs@gmail.com

This is the complete hand-off for one board, organized the way every
project is delivered. Open the folders in order: each one is what the next
person in the chain needs, and nothing else.

| Folder | What is in it | Who uses it |
|---|---|---|
| \`01_schematic/\` | The full 8-sheet schematic as a PDF | Anyone reviewing the circuit — no design tool needed |
| \`02_source/\` | The editable design project: schematic, 4-layer board, project-local libraries and 3D models | The next engineer, for any change |
| \`03_fabrication/\` | The Gerber + drill zip exactly as uploaded, fab layer plots, and the order notes | The PCB fab — zip it and upload |
| \`04_assembly/\` | BOM with LCSC part numbers, pick-and-place (CPL), and a readable BOM | The assembly house |
| \`05_3d/\` | Renders of the populated board, and a glTF 3D model | Enclosure and mechanical work |
| \`06_docs/\` | Design document, the six review records, bring-up guide, pin map, engineering notes, Rev B plan | Bring-up, and the next revision |
| \`07_firmware/\` | The Arduino sketch for the ESP32-S3 | Bring-up and the demo application |

**Board:** 62.5 × 44.5 mm, 4-layer (signal / GND / GND / signal), 1.6 mm,
lead-free HASL. ESP32-S3-WROOM-1, USB-C with 1-cell LiPo charging,
BME280 + VEML7700 + capacitive soil probe.

**Verification:** final layout audit 2026-08-17 — 0 DRC errors, 0
unconnected items, 0 schematic-parity differences
(\`06_docs/reviews/Final_Layout_Review_RevA_2026-08-17.md\`).

Links inside the documents point at the original repository layout; the
repository itself is at https://github.com/MuffinByteLabs/esp32s3-plant-monitor.
`;

const CHANGELOG = `# Changelog — PCB 1, ESP32-S3 Wi-Fi Plant Monitor

## Rev A

- **2026-08-24** — Firmware written against the hardware contract: deep-sleep wake cycle, battery cut-offs, MQTT with Home Assistant discovery.
- **2026-08-21** — Ordered at JLCPCB: 5 boards, fabricated and assembled. The uploaded package is frozen in \`03_fabrication/\` and \`04_assembly/\`.
- **2026-08-17** — Final layout audit: 0 DRC errors, 0 unconnected items, 0 schematic-parity differences. Cleared to order.
- **2026-08-16** — DRC / ERC cleanup and finishing review (silkscreen, branding, DNP and BOM exclusions).
- **2026-08-15** — Routing complete; stitching vias added around the RF module.
- **2026-08-10 → 08-12** — Placement review and re-check; outline reduced to 62.5 × 44.5 mm with R4.25 corners.
- **2026-08-02** — USB-C footprint made project-local; shield-leg drill corrected to the connector drawing.
- **2026-07-22** — Second, independent netlist review. No blocking findings; cleared for layout.
- **2026-07-20** — Pre-fabrication design review: three blocking findings (USB-C ground pins, battery-sense chain, stale BOM), all fixed the same day.
- **2026-07-14** — Schematic capture started.
`;

/* ── a minimal zip writer ─────────────────────────────────────────────── */
function dosStamp(d) {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

function writeZip(entries, stamp) {
  const { time, date } = dosStamp(stamp);
  const local = [];
  const central = [];
  let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const crc = zlib.crc32(e.data) >>> 0;
    const deflated = zlib.deflateRawSync(e.data, { level: 9 });
    /* store anything deflate cannot shrink — the Gerber zip, the PNGs */
    const stored = deflated.length >= e.data.length;
    const body = stored ? e.data : deflated;
    const method = stored ? 0 : 8;

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0x0800, 6); // UTF-8 names
    lh.writeUInt16LE(method, 8);
    lh.writeUInt16LE(time, 10);
    lh.writeUInt16LE(date, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(body.length, 18);
    lh.writeUInt32LE(e.data.length, 22);
    lh.writeUInt16LE(name.length, 26);
    local.push(lh, name, body);

    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0x0800, 8);
    ch.writeUInt16LE(method, 10);
    ch.writeUInt16LE(time, 12);
    ch.writeUInt16LE(date, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(body.length, 20);
    ch.writeUInt32LE(e.data.length, 24);
    ch.writeUInt16LE(name.length, 28);
    ch.writeUInt32LE(offset, 42);
    central.push(ch, name);

    offset += lh.length + name.length + body.length;
  }
  const cd = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, cd, end]);
}

/* ── build it ─────────────────────────────────────────────────────────── */
const files = git("ls-tree", "-r", "--name-only", REF).toString().split("\n").filter(Boolean);
const entries = [];
for (const f of files) {
  const dest = place(f);
  if (dest) entries.push({ name: `${ROOT}/${dest}`, data: git("show", `${REF}:${f}`) });
}
entries.push({ name: `${ROOT}/05_3d/pcb1-3d-model.glb`, data: fs.readFileSync(MODEL) });
entries.push({ name: `${ROOT}/README.md`, data: Buffer.from(README) });
entries.push({ name: `${ROOT}/CHANGELOG.md`, data: Buffer.from(CHANGELOG) });
entries.sort((a, b) => a.name.localeCompare(b.name));

const stamp = new Date(git("log", "-1", "--format=%cI", REF).toString().trim());
const zip = writeZip(entries, stamp);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT) : null;
if (!prev || !prev.equals(zip)) fs.writeFileSync(OUT, zip);

/* a one-line-per-folder summary, so a changed layout is obvious at a glance */
const top = new Map();
for (const e of entries) {
  const parts = e.name.slice(ROOT.length + 1).split("/");
  const key = parts.length > 1 ? `${parts[0]}/` : parts[0];
  top.set(key, (top.get(key) ?? 0) + 1);
}
console.log(`${path.relative(process.cwd(), OUT)} — ${entries.length} files, ${(zip.length / 1048576).toFixed(1)} MB`);
for (const [k, n] of top) console.log(`  ${k.padEnd(16)} ${n} file${n === 1 ? "" : "s"}`);
