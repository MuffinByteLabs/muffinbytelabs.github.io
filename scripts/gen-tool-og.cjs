/* Share cards for the free tools — the same canvas as the Field Note cards
   (warm graphite, the mark, the gold baseline bar), with the tool's name,
   its one-line blurb, and a small drawing of what the tool does on the
   right. Without these, every tool link previews as the homepage.

   Run after adding or renaming a tool:  node scripts/gen-tool-og.cjs
   Output: public/og/tool-<slug>.png and public/og/tools.png (the hub).
   gen-post-og.cjs leaves these alone when it prunes stale post cards. */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const OUT = path.join(process.cwd(), "public/og");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* greedy word wrap on an estimated glyph width, as in gen-post-og.cjs */
function wrap(text, fontSize, maxWidth, em = 0.53) {
  const maxChars = Math.floor(maxWidth / (fontSize * em));
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const tryLine = line ? `${line} ${word}` : word;
    if (tryLine.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = tryLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const GOLD = "#dba64b";
const MONO = "Consolas, 'Courier New', monospace";
const SERIF = "Georgia, 'Times New Roman', serif";

/* ── the drawings, each in a 300 × 300 box ───────────────────────────── */

function pinsGlyph() {
  const pads = [];
  const odd = { 2: "#4fc384", 5: "#eaa94c", 13: "#f07167", 18: "#4fc384", 20: "#eaa94c" };
  for (let i = 0; i < 11; i++) {
    const y = 112 + i * 16;
    for (const [side, x] of [[0, 34], [1, 244]]) {
      const n = side * 11 + i;
      pads.push(`<rect x="${x}" y="${y}" width="22" height="9" rx="2" fill="${odd[n] ?? "#c8814c"}" fill-opacity="${odd[n] ? 1 : 0.7}"/>`);
    }
  }
  return `
    <rect x="52" y="10" width="196" height="290" rx="10" fill="#1c1a17" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="3"/>
    <path d="M78 66 h24 v-32 h24 v32 h24 v-32 h24 v32 h24 v-32 h24" fill="none" stroke="${GOLD}" stroke-opacity="0.8" stroke-width="4" stroke-linejoin="round"/>
    <line x1="52" y1="90" x2="248" y2="90" stroke="${GOLD}" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="6 6"/>
    <rect x="78" y="112" width="144" height="150" rx="6" fill="#24211d" stroke="#3d372f" stroke-width="2"/>
    <text x="150" y="194" text-anchor="middle" font-family="${MONO}" font-size="21" fill="#8f8675">ESP32-S3</text>
    ${pads.join("\n    ")}`;
}

function buckGlyph() {
  return `
    <text x="0" y="62" font-family="${MONO}" font-size="20" fill="#8f8675">SW</text>
    <path d="M44 120 H70 V60 H110 V120 H150 V60 H190 V120 H230 V60 H270 V120 H296" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linejoin="round"/>
    <text x="0" y="214" font-family="${MONO}" font-size="20" fill="#8f8675">IL</text>
    <line x1="44" y1="236" x2="296" y2="236" stroke="#3d372f" stroke-width="2" stroke-dasharray="6 6"/>
    <path d="M44 248 L70 262 L110 210 L150 262 L190 210 L230 262 L270 210 L296 244" fill="none" stroke="#f1c978" stroke-width="4" stroke-linejoin="round"/>`;
}

function traceGlyph() {
  const heat = [112, 150, 188]
    .map((x) => `<path d="M${x} 92 q12 -14 0 -28 q-12 -14 0 -28" fill="none" stroke="#f07167" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round"/>`)
    .join("");
  return `
    ${heat}
    <line x1="84" y1="116" x2="216" y2="116" stroke="${GOLD}" stroke-width="2"/>
    <line x1="84" y1="106" x2="84" y2="126" stroke="${GOLD}" stroke-width="2"/>
    <line x1="216" y1="106" x2="216" y2="126" stroke="${GOLD}" stroke-width="2"/>
    <polygon points="84,180 216,180 206,144 94,144" fill="#c8814c"/>
    <rect x="0" y="180" width="300" height="84" fill="#2a251d" stroke="#3d372f" stroke-width="2"/>
    <rect x="0" y="264" width="300" height="12" fill="#c8814c" fill-opacity="0.55"/>
    <text x="288" y="230" text-anchor="end" font-family="${MONO}" font-size="18" fill="#8f8675">FR-4</text>`;
}

function costGlyph() {
  return `
    <text x="150" y="196" text-anchor="middle" font-family="${SERIF}" font-size="220" fill="${GOLD}" fill-opacity="0.9">$</text>
    <line x1="16" y1="262" x2="284" y2="262" stroke="#3d372f" stroke-width="5" stroke-linecap="round"/>
    <line x1="84" y1="262" x2="214" y2="262" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="84" cy="262" r="10" fill="#f1c978"/>
    <circle cx="214" cy="262" r="10" fill="#f1c978"/>`;
}

function briefGlyph() {
  const rows = [0, 1, 2, 3].map((i) => {
    const y = 96 + i * 46;
    const len = [130, 104, 118, 86][i];
    const box = `<rect x="66" y="${y}" width="24" height="24" rx="4" fill="none" stroke="${GOLD}" stroke-opacity="0.75" stroke-width="2.5"/>`;
    const tick = i < 3 ? `<path d="M71 ${y + 12} l5 6 l10 -12" fill="none" stroke="#f1c978" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` : "";
    const line = `<line x1="104" y1="${y + 12}" x2="${104 + len}" y2="${y + 12}" stroke="#3d372f" stroke-width="9" stroke-linecap="round"/>`;
    return box + tick + line;
  });
  return `
    <path d="M40 10 H200 L250 60 V296 H40 Z" fill="#1c1a17" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="3" stroke-linejoin="round"/>
    <path d="M200 10 V60 H250" fill="none" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="3" stroke-linejoin="round"/>
    <line x1="66" y1="62" x2="170" y2="62" stroke="${GOLD}" stroke-opacity="0.8" stroke-width="5" stroke-linecap="round"/>
    ${rows.join("\n    ")}`;
}

function glossaryGlyph() {
  return `
    <text x="6" y="176" font-family="${SERIF}" font-size="190" fill="#f4efe6" fill-opacity="0.92">Aa</text>
    <line x1="12" y1="214" x2="284" y2="214" stroke="${GOLD}" stroke-width="3" stroke-opacity="0.8"/>
    <line x1="12" y1="248" x2="250" y2="248" stroke="#3d372f" stroke-width="10" stroke-linecap="round"/>
    <line x1="12" y1="278" x2="196" y2="278" stroke="#3d372f" stroke-width="10" stroke-linecap="round"/>`;
}

function hubGlyph() {
  const labels = ["PINS", "BUCK", "TRACE", "COST", "BRIEF", "A–Z"];
  return labels
    .map((label, i) => {
      const x = (i % 2) * 152;
      const y = Math.floor(i / 2) * 104;
      const lit = i === 0;
      return `<rect x="${x}" y="${y}" width="136" height="88" rx="12" fill="${lit ? "#2a2215" : "#1c1a17"}" stroke="${GOLD}" stroke-opacity="${lit ? 0.9 : 0.35}" stroke-width="2.5"/>
    <text x="${x + 68}" y="${y + 52}" text-anchor="middle" font-family="${MONO}" font-size="20" letter-spacing="2" fill="${lit ? "#f1c978" : "#8f8675"}">${esc(label)}</text>`;
    })
    .join("\n    ");
}

const GLYPHS = {
  "esp32-s3-pinout": pinsGlyph,
  "buck-converter-calculator": buckGlyph,
  "pcb-trace-width-calculator": traceGlyph,
  "pcb-design-cost-calculator": costGlyph,
  "pcb-design-brief": briefGlyph,
  "pcb-glossary": glossaryGlyph,
};

/* where the greedy wrap would break a name awkwardly ("PCB terms in plain /
   English"), the lines are given by hand */
const BREAKS = {
  "pcb-glossary": ["PCB terms in", "plain English"],
  "pcb-design-brief": ["PCB project", "brief builder"],
};

/* ── one card ─────────────────────────────────────────────────────────── */

function card({ markURI, kicker, title, lines: given, blurb, glyph }) {
  let fontSize = 66;
  let lines = given ?? wrap(title, fontSize, 700, 0.5);
  while (!given && lines.length > 3 && fontSize > 44) {
    fontSize -= 6;
    lines = wrap(title, fontSize, 700, 0.5);
  }
  const lh = Math.round(fontSize * 1.16);
  const blurbLines = wrap(blurb, 28, 640, 0.47).slice(0, 4);
  const blurbLH = 40;
  const blockH = lines.length * lh + 26 + blurbLines.length * blurbLH;
  const top = Math.round(330 - blockH / 2);
  const firstBase = top + Math.round(fontSize * 0.8);
  const blurbTop = top + lines.length * lh + 26 + 28;

  const titleText = lines
    .map((l, i) => `<text x="96" y="${firstBase + i * lh}" font-family="${SERIF}" font-size="${fontSize}" fill="#f4efe6">${esc(l)}</text>`)
    .join("\n  ");
  const blurbText = blurbLines
    .map((l, i) => `<text x="96" y="${blurbTop + i * blurbLH}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="28" fill="#b1a899">${esc(l)}</text>`)
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="#15130f"/>
      <stop offset="55%" stop-color="#0f0e0d"/>
      <stop offset="100%" stop-color="#0b0a09"/>
    </linearGradient>
    <radialGradient id="glow" cx="26%" cy="12%" r="70%">
      <stop offset="0%" stop-color="#7e6034" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#7e6034" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="spot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2a2318" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#2a2318" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="1000" cy="318" r="250" fill="url(#spot)"/>

  <image xlink:href="${markURI}" x="96" y="72" width="64" height="64"/>
  <text x="178" y="114" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="26" fill="#aca395">MuffinByteLabs &#183; ${esc(kicker)}</text>

  ${titleText}
  ${blurbText}

  <g transform="translate(850 166)">${glyph()}
  </g>

  <text x="96" y="566" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="24" fill="#8c8372">Free, no sign-up &#183; Ray Malik &#183; muffinbytelabs.com</text>

  <rect x="0" y="622" width="1200" height="8" fill="${GOLD}" fill-opacity="0.85"/>
</svg>`;
}

(async () => {
  const { TOOLS } = await import(pathToFileURL(path.join(process.cwd(), "src/lib/tools.ts")).href);

  // the mark as warm-white ink, exactly as the other cards build it
  const { data, info } = await sharp("public/logo-mark.png")
    .resize(160, 160, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i += 4) {
    px[i] = 244;
    px[i + 1] = 239;
    px[i + 2] = 230;
    px[i + 3] = data[i + 3];
  }
  const mark = await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  const markURI = "data:image/png;base64," + mark.toString("base64");

  fs.mkdirSync(OUT, { recursive: true });

  const jobs = [
    {
      file: "tools.png",
      kicker: "Free tools",
      title: "Free PCB tools",
      blurb: "An ESP32-S3 pin planner, buck converter and trace width calculators, a design cost estimator, a brief builder and a plain-English glossary.",
      glyph: hubGlyph,
    },
    ...TOOLS.map((t) => {
      const glyph = GLYPHS[t.slug];
      if (!glyph) throw new Error(`gen-tool-og: no drawing for "${t.slug}" — add one to GLYPHS`);
      return { file: `tool-${t.slug}.png`, kicker: "Free tools", title: t.name, lines: BREAKS[t.slug], blurb: t.blurb, glyph };
    }),
  ];

  for (const job of jobs) {
    await sharp(Buffer.from(card({ markURI, ...job })))
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, job.file));
  }
  console.log(`${jobs.length} tool cards written to public/og/`);
})();
