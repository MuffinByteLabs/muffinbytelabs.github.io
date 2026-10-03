/* Render the site's two designed social cards from the built site itself.

       npm run build
       node scripts/render-og-cards.cjs        → public/og.png, public/og/pcb-2.png

   Serves out/ on a local port, drives headless Chrome over the DevTools
   protocol (Node 22+ has a global WebSocket, so nothing to install), and
   screenshots each card. The cards borrow the live page's fonts, colour
   tokens, logo mask and the PCB 2 isolation-domain map, so they always
   match the pages they preview. Field Note cards are made by
   scripts/gen-post-og.cjs.

   Chrome is found at its default Windows path; set CHROME to override. */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const sharp = require("sharp");

const ROOT = path.join(process.cwd(), "out");
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SITE_PORT = 4322;
const CDP_PORT = 9334;

/* ── the card markup ─────────────────────────────────────────────────── */

const traces = (paths, vias) => `
<svg width="1200" height="630" viewBox="0 0 1200 630" style="position:absolute;inset:0" fill="none">
  <g stroke="#dba64b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.2">${paths
    .map((d) => `<path d="${d}"/>`)
    .join("")}</g>
  <g fill="#0d0c0b" stroke="#dba64b" stroke-opacity="0.55" stroke-width="2.5">${vias
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`)
    .join("")}</g>
</svg>`;

const HOME_TRACES = traces(
  ["M1200 92 H1086 L1030 148 H880", "M1200 128 H1110 L1062 176 H962", "M1200 470 H1120 L1066 524 H946", "M1200 506 H1150 L1112 544 H1030"],
  [[880, 148], [962, 176], [946, 524], [1030, 544]]
);
const PCB2_TRACES = traces(["M0 470 H40 L80 430 H170", "M0 500 H70 L104 466 H240"], [[170, 430], [240, 466]]);

const frame = (inner, tr) => `
<div id="card" style="position:fixed;left:0;top:0;width:1200px;height:630px;overflow:hidden;
  background:
    radial-gradient(70% 90% at 18% 0%, rgba(126,96,52,0.34), rgba(126,96,52,0) 60%),
    radial-gradient(60% 70% at 100% 100%, rgba(200,129,76,0.12), rgba(200,129,76,0) 60%),
    #0d0c0b;
  font-family: var(--font-geist-sans), system-ui, sans-serif; color:#f4efe6; z-index:9999">
  <div style="position:absolute;inset:0;
    background-image:linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);
    background-size:40px 40px;
    -webkit-mask-image:radial-gradient(80% 80% at 40% 40%,#000 30%,transparent 80%)"></div>
  ${tr}
  ${inner}
  <div style="position:absolute;left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,#a8792f,#f1c978,#dba64b)"></div>
</div>`;

const pill = (text) => `<span style="display:inline-flex;align-items:center;gap:10px;padding:7px 16px 7px 13px;border-radius:999px;
  color:#dba64b;background:rgba(219,166,75,0.08);border:1.5px solid rgba(219,166,75,0.32);font-size:19px;font-weight:500">
  <span style="width:9px;height:9px;border-radius:999px;background:#dba64b"></span>${text}</span>`;

const HOME = frame(
  `
  <div style="position:absolute;left:84px;top:78px;display:flex;align-items:center;gap:16px;color:#f4efe6">
    <span class="logo" style="width:46px;height:46px"></span>
    <span style="font-size:27px;font-weight:500;letter-spacing:-0.01em">MuffinByteLabs</span>
  </div>
  <div style="position:absolute;left:80px;top:168px">
    <div style="font-family:var(--font-instrument),serif;font-size:136px;line-height:1.02;padding-bottom:0.08em;letter-spacing:-0.015em;
      background:linear-gradient(180deg,#fbf7f0 20%,#d8ccb6 100%);-webkit-background-clip:text;color:transparent">Ray Malik</div>
    <div style="margin-top:22px;font-size:34px;color:#f4efe6;letter-spacing:-0.012em">PCB design engineer <span style="color:#8f8675">&middot;</span> <span style="color:#b1a899">freelance</span></div>
    <div style="margin-top:14px;font-size:24px;color:#8f8675">ESP32 &amp; STM32 boards &middot; four layers &middot; fab-ready manufacturing packages</div>
  </div>
  <div style="position:absolute;left:84px;bottom:58px;display:flex;gap:14px">
    ${pill("Fixed quote in 24 h")}
    ${pill("Money-back guarantee")}
    ${pill("Any EDA tool")}
  </div>
`,
  HOME_TRACES
);

const pcb2 = (svg) =>
  frame(
    `
  <div style="position:absolute;left:72px;top:64px;width:520px">
    <span style="font-family:var(--font-geist-mono),monospace;font-size:17px;letter-spacing:0.16em;color:#8f8675">PCB 2 &middot; REV A</span>
    <div style="margin-top:26px;font-family:var(--font-instrument),serif;font-size:82px;line-height:1.0;padding-bottom:0.06em;letter-spacing:-0.015em;
      background:linear-gradient(180deg,#fbf7f0 20%,#d8ccb6 100%);-webkit-background-clip:text;color:transparent">STM32 Industrial I/O Controller</div>
    <div style="margin-top:24px;font-size:23px;line-height:1.45;color:#b1a899">Four layers &middot; 9&ndash;30 V DC &middot; isolated RS-485 + CAN FD &middot; 4&ndash;20 mA &amp; 0&ndash;10 V &middot; hardware-gated outputs</div>
  </div>
  <div style="position:absolute;right:56px;top:84px;width:540px;padding:12px;border-radius:22px;background:#161513;border:1.5px solid #3d372f;
     box-shadow:0 30px 70px -30px rgba(0,0,0,1)">
    ${svg}
  </div>
  <div style="position:absolute;left:76px;bottom:52px;display:flex;align-items:center;gap:14px;color:#8f8675;font-size:20px">
    <span class="logo" style="width:30px;height:30px;color:#f4efe6"></span>
    <span><span style="color:#f4efe6">Ray Malik</span> &middot; muffinbytelabs.com</span>
  </div>
`,
    PCB2_TRACES
  );

/* ── plumbing: a static server for out/, and Chrome over CDP ─────────── */

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".txt": "text/plain" };

function serve() {
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split("?")[0]);
    for (const c of [p, p + ".html", path.join(p, "index.html")]) {
      const f = path.join(ROOT, c);
      if (fs.existsSync(f) && fs.statSync(f).isFile()) {
        res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
        return fs.createReadStream(f).pipe(res);
      }
    }
    res.writeHead(404);
    res.end();
  });
  return new Promise((r) => server.listen(SITE_PORT, () => r(server)));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(`http://localhost:${CDP_PORT}/json/version`);
      break;
    } catch {
      await sleep(200);
    }
  }
  /* /json/new must be a PUT, and the Host header has to carry the port or
     the socket URL comes back pointing at port 80 */
  const t = await (
    await fetch(`http://localhost:${CDP_PORT}/json/new?about:blank`, { method: "PUT", headers: { Host: `localhost:${CDP_PORT}` } })
  ).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl.replace(/ws:\/\/[^/]+/, `ws://localhost:${CDP_PORT}`));
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d);
      pending.delete(d.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  return { send, close: () => ws.close() };
}

async function shoot(cdp, url, buildCard, out) {
  await cdp.send("Page.navigate", { url: `http://localhost:${SITE_PORT}${url}` });
  await sleep(2000);
  await cdp.send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
  const html = await buildCard(cdp);
  await cdp.send("Runtime.evaluate", { expression: `document.body.innerHTML = ${JSON.stringify(html)}; 1` });
  await sleep(500);
  const shot = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
  /* palette-quantised, as the committed cards always were */
  await sharp(Buffer.from(shot.result.data, "base64")).png({ palette: true, quality: 92, compressionLevel: 9 }).toFile(out);
  console.log("wrote", out, fs.statSync(out).size, "bytes");
}

(async () => {
  if (!fs.existsSync(path.join(ROOT, "index.html"))) {
    console.error("out/ is missing — run `npm run build` first.");
    process.exit(1);
  }
  const server = await serve();
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--remote-debugging-port=${CDP_PORT}`,
      "--remote-allow-origins=*",
      `--user-data-dir=${path.join(require("os").tmpdir(), "mbl-og-chrome")}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    const cdp = await connect();
    await cdp.send("Page.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
    await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

    await shoot(
      cdp,
      "/work/stm32-industrial-io",
      async (c) => {
        const r = await c.send("Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const s = document.querySelector('header figure svg');
            const c = s.cloneNode(true);
            c.removeAttribute('style');
            c.setAttribute('width', '516');
            c.setAttribute('height', String(Math.round(516 * 604 / 770)));
            return c.outerHTML;
          })()`,
        });
        return pcb2(r.result.result.value);
      },
      path.join("public", "og", "pcb-2.png")
    );
    await shoot(cdp, "/", async () => HOME, path.join("public", "og.png"));
    cdp.close();
  } finally {
    chrome.kill();
    server.close();
  }
})();
