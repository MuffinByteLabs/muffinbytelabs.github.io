"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { Chips, Seg } from "../fields";
import { copyText } from "../clipboard";
import {
  DEFAULT_SETUP,
  PINS,
  PSRAM_LABEL,
  STRAPPING,
  assess,
  isAnalogWithWifi,
  isQuiet,
  isTouch,
  type Level,
  type ModulePin,
  type Psram,
  type Setup,
} from "./pins";

/* ════════════════════════════════════════════════════════════════════════
   The ESP32-S3-WROOM-1 pin planner. The module is drawn as seen from
   above, every pad coloured by what it is in the visitor's setup; a click
   (or Enter) on any pad explains it, and pins can be named into a plan
   that copies out as text. The full pin table underneath is plain HTML,
   so everything here is also readable without the drawing.
   ════════════════════════════════════════════════════════════════════════ */

const LEVEL: Record<Level, { label: string; color: string }> = {
  free: { label: "Free", color: "#4fc384" },
  care: { label: "Use with care", color: "#eaa94c" },
  taken: { label: "Taken", color: "#f07167" },
  power: { label: "Power", color: "#8f8675" },
};

type Filter = "all" | "free" | "analog" | "touch" | "quiet" | "strapping" | "taken";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "free", label: "Free to use" },
  { id: "analog", label: "Analog, with Wi-Fi on" },
  { id: "touch", label: "Touch" },
  { id: "quiet", label: "Quiet at power-up" },
  { id: "strapping", label: "Strapping pins" },
  { id: "taken", label: "Taken" },
];

const TOGGLES: { key: keyof Omit<Setup, "psram">; label: string }[] = [
  { key: "usb", label: "Native USB on GPIO19/20" },
  { key: "uart0", label: "Serial console on UART0" },
  { key: "wifi", label: "Wi-Fi in use" },
  { key: "jtag", label: "External JTAG probe" },
  { key: "xtal32k", label: "32 kHz crystal" },
];

/* pad geometry, in drawing units: the module is 180 × 255 (18 × 25.5 mm) */
const PITCH = 12.7;
function padRect(p: ModulePin) {
  if (p.side === "left") return { x: -6, y: 72 + (p.pad - 1) * PITCH - 3.5, w: 16, h: 7 };
  if (p.side === "right") return { x: 170, y: 72 + (40 - p.pad) * PITCH - 3.5, w: 16, h: 7 };
  if (p.side === "bottom") return { x: 20.15 + (p.pad - 15) * PITCH - 3.5, y: 247, w: 7, h: 16 };
  return { x: 62, y: 128, w: 56, h: 56 };
}

function matches(p: ModulePin, s: Setup, f: Filter) {
  if (f === "all") return true;
  const lvl = assess(p, s).level;
  if (f === "free") return lvl === "free";
  if (f === "taken") return lvl === "taken";
  if (f === "analog") return isAnalogWithWifi(p, s);
  if (f === "touch") return isTouch(p, s);
  if (f === "quiet") return isQuiet(p, s);
  return p.gpio !== undefined && STRAPPING.includes(p.gpio);
}

function Module({
  setup,
  filter,
  selected,
  plan,
  onSelect,
}: {
  setup: Setup;
  filter: Filter;
  selected: number;
  plan: Record<number, string>;
  onSelect: (pad: number) => void;
}) {
  return (
    <svg viewBox="-70 -14 320 330" className="tl-module" role="group" aria-label="ESP32-S3-WROOM-1 module, top view. Each pad is a button.">
      {/* the module: antenna end at the top, the shield can below it */}
      <rect x={0} y={0} width={180} height={255} rx={6} fill="#1a1815" stroke="#3d372f" strokeWidth={1.2} />
      <rect x={4} y={4} width={172} height={54} rx={4} fill="#221c2b" />
      <path d="M22 44 V18 H40 V44 H58 V18 H76 V44 H94 V18 H112 V44 H130 V18 H148 V44 H158" fill="none" stroke="#c27c4b" strokeOpacity={0.55} strokeWidth={2} />
      <text x={90} y={54} textAnchor="middle" fontSize={7} fill="#8f8675" letterSpacing={1.2} style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}>
        ANTENNA · KEEP COPPER OUT
      </text>
      <rect x={14} y={66} width={152} height={170} rx={4} fill="#24211d" stroke="#2e2a25" />
      <text x={90} y={100} textAnchor="middle" fontSize={9.5} fill="#b1a899" letterSpacing={0.6} style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}>
        ESP32-S3-WROOM-1
      </text>

      {PINS.map((p) => {
        const a = assess(p, setup);
        const r = padRect(p);
        const on = matches(p, setup, filter);
        const isSel = selected === p.pad;
        const inPlan = plan[p.pad] !== undefined;
        const color = LEVEL[a.level].color;
        const label = p.name === "EPAD" ? "" : p.name;
        const cy = r.y + r.h / 2;
        const cx = r.x + r.w / 2;
        return (
          <g
            key={p.pad}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`Pad ${p.pad}, ${p.name}${p.gpio !== undefined ? `, GPIO${p.gpio}` : ""}: ${LEVEL[a.level].label}${inPlan ? `, planned as ${plan[p.pad]}` : ""}`}
            className="tl-pad"
            style={{ opacity: on ? 1 : 0.22 }}
            onClick={() => onSelect(p.pad)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(p.pad);
              }
            }}
          >
            {p.side === "center" ? (
              <>
                {[0, 1, 2].flatMap((i) =>
                  [0, 1, 2].map((j) => <rect key={`${i}${j}`} x={r.x + i * 20} y={r.y + j * 20} width={16} height={16} rx={2} fill={color} fillOpacity={0.55} />)
                )}
                <rect x={r.x - 4} y={r.y - 4} width={r.w + 4} height={r.h + 4} rx={4} fill="transparent" stroke={isSel ? "#ffffff" : "none"} strokeWidth={1.6} />
              </>
            ) : (
              <>
                {/* a generous invisible hit area around the small pad */}
                <rect x={r.x - 3} y={r.y - 3} width={r.w + 6} height={r.h + 6} fill="transparent" />
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={1.5} fill={color} stroke={isSel ? "#ffffff" : "none"} strokeWidth={1.6} />
              </>
            )}
            {label &&
              (p.side === "bottom" ? (
                <text
                  x={cx + 3}
                  y={271}
                  transform={`rotate(-90 ${cx + 3} 271)`}
                  textAnchor="end"
                  fontSize={8.5}
                  fill={isSel ? "#ffffff" : "#b1a899"}
                  style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
                >
                  {label}
                </text>
              ) : (
                <text
                  x={p.side === "left" ? -11 : 191}
                  y={cy + 3}
                  textAnchor={p.side === "left" ? "end" : "start"}
                  fontSize={8.5}
                  fill={isSel ? "#ffffff" : "#b1a899"}
                  style={{ fontFamily: "var(--font-geist-mono), ui-monospace, monospace" }}
                >
                  {label}
                </text>
              ))}
            {inPlan && (
              <circle
                cx={p.side === "left" ? -42 : p.side === "right" ? 220 : p.side === "bottom" ? cx : r.x + r.w + 6}
                cy={p.side === "bottom" ? 299 : p.side === "center" ? r.y - 6 : cy}
                r={3}
                fill="#f1c978"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function PinPlanner() {
  const [setup, setSetup] = useState<Setup>(DEFAULT_SETUP);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState(4);
  const [plan, setPlan] = useState<Record<number, string>>({});
  const [net, setNet] = useState("");
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");

  const pin = PINS.find((p) => p.pad === selected) ?? PINS[3];
  const a = assess(pin, setup);
  const counts = useMemo(() => {
    const c: Record<Level, number> = { free: 0, care: 0, taken: 0, power: 0 };
    for (const p of PINS) c[assess(p, setup).level]++;
    return c;
  }, [setup]);

  const planned = PINS.filter((p) => plan[p.pad] !== undefined);
  const setupLine = `${PSRAM_LABEL[setup.psram]} · USB ${setup.usb ? "on" : "off"} · UART0 console ${setup.uart0 ? "on" : "off"} · Wi-Fi ${setup.wifi ? "on" : "off"}${setup.jtag ? " · JTAG probe" : ""}${setup.xtal32k ? " · 32 kHz crystal" : ""}`;

  function select(pad: number) {
    setSelected(pad);
    setNet(plan[pad] ?? "");
  }

  async function copyPlan() {
    const rows = planned.map((p) => {
      const pa = assess(p, setup);
      return `${plan[p.pad].padEnd(14)} ${p.name.padEnd(5)} pad ${String(p.pad).padStart(2)}  ${LEVEL[pa.level].label}${pa.level !== "free" && pa.notes[0] ? ` (${pa.notes[0].text})` : ""}`;
    });
    const text = [
      "ESP32-S3-WROOM-1 pin plan",
      setupLine,
      "",
      ...rows,
      "",
      "Made with https://muffinbytelabs.com/tools/esp32-s3-pinout",
    ].join("\n");
    setCopied((await copyText(text)) ? "ok" : "fail");
    setTimeout(() => setCopied(""), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── the setup ───────────────────────────────────────────────── */}
      <div className="card card-static tl-panel">
        <Seg
          label="Module (the part number's PSRAM letters)"
          value={setup.psram}
          wrap
          onChange={(v: Psram) => setSetup({ ...setup, psram: v })}
          options={(Object.keys(PSRAM_LABEL) as Psram[]).map((k) => ({ id: k, label: PSRAM_LABEL[k] }))}
        />
        <Chips
          label="In your design"
          options={TOGGLES.map((t) => t.label)}
          values={TOGGLES.filter((t) => setup[t.key]).map((t) => t.label)}
          onChange={(vals) => setSetup({ ...setup, ...Object.fromEntries(TOGGLES.map((t) => [t.key, vals.includes(t.label)])) })}
        />
      </div>

      {/* ── the module and the selected pin ─────────────────────────── */}
      <div className="tl-grid tl-grid-module">
        <div className="card card-static tl-panel">
          <div className="tl-legend" aria-label="Pin status in this setup">
            {(["free", "care", "taken", "power"] as Level[]).map((l) => (
              <span key={l}>
                <i style={{ background: LEVEL[l].color }} /> {LEVEL[l].label} <b className="mono">{counts[l]}</b>
              </span>
            ))}
          </div>
          <Module setup={setup} filter={filter} selected={selected} plan={plan} onSelect={select} />
          <Seg label="Highlight" value={filter} wrap onChange={setFilter} options={FILTERS} />
        </div>

        <div className="card card-static tl-panel tl-out" aria-live="polite">
          <div className="tl-pin-head">
            <span className="tl-badge" style={{ color: LEVEL[a.level].color, borderColor: LEVEL[a.level].color }}>
              {LEVEL[a.level].label}
            </span>
            <h2 className="display tl-pin-name">{pin.name}</h2>
            <span className="mono tl-pin-sub">
              {pin.gpio !== undefined ? `GPIO${pin.gpio} · ` : ""}module pad {pin.pad}
            </span>
          </div>
          <p className="tl-pin-headline">{a.headline}</p>
          {a.notes.length > 0 && (
            <ul className="tl-notes">
              {a.notes.map((n) => (
                <li key={n.text} data-tone={n.tone}>
                  {n.text}
                </li>
              ))}
            </ul>
          )}
          {pin.fn.length > 0 && (
            <div className="tl-fns">
              <span className="tl-label">Fixed functions</span>
              <div className="tl-chips">
                {pin.fn.map((f) => (
                  <span key={f} className="chip chip-mono">
                    {f}
                  </span>
                ))}
              </div>
              <p className="tl-hint">
                UART, I²C, SPI, PWM and most other signals can also be routed to any free GPIO through the GPIO matrix.
              </p>
            </div>
          )}
          {pin.gpio !== undefined && (
            <form
              className="tl-plan-add"
              onSubmit={(e) => {
                e.preventDefault();
                const name = net.trim();
                if (!name) return;
                setPlan({ ...plan, [pin.pad]: name });
              }}
            >
              <label className="tl-label" htmlFor="tl-net">
                Use it for
              </label>
              <div className="tl-plan-row">
                <input id="tl-net" className="tl-input mono" placeholder="e.g. LED_STATUS" value={net} onChange={(e) => setNet(e.target.value)} maxLength={24} />
                <button type="submit" className="btn btn-ghost btn-sm" disabled={!net.trim()}>
                  {plan[pin.pad] !== undefined ? "Rename" : "Add to plan"}
                </button>
                {plan[pin.pad] !== undefined && (
                  <button
                    type="button"
                    className="link-quiet text-[13px]"
                    onClick={() => {
                      const next = { ...plan };
                      delete next[pin.pad];
                      setPlan(next);
                      setNet("");
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── the plan ────────────────────────────────────────────────── */}
      {planned.length > 0 && (
        <div className="card card-static tl-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="eyebrow m-0">Your pin plan · {planned.length}</h2>
            <div className="flex items-center gap-4">
              <button type="button" className="btn btn-primary btn-sm" onClick={copyPlan}>
                <Icon name={copied === "ok" ? "check" : "copy"} size={14} />
                {copied === "ok" ? "Copied" : copied === "fail" ? "Couldn't copy" : "Copy as text"}
              </button>
              <button type="button" className="link-quiet text-[13px]" onClick={() => setPlan({})}>
                Clear
              </button>
            </div>
          </div>
          <ul className="tl-plan">
            {planned.map((p) => {
              const pa = assess(p, setup);
              return (
                <li key={p.pad}>
                  <button type="button" onClick={() => select(p.pad)}>
                    <i style={{ background: LEVEL[pa.level].color }} />
                    <span className="mono tl-plan-net">{plan[p.pad]}</span>
                    <span className="mono tl-plan-pin">
                      {p.name} · pad {p.pad}
                    </span>
                    <span className="tl-plan-note">{pa.level === "free" ? "Free" : pa.notes[0]?.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── every pin, as a table ───────────────────────────────────── */}
      <div className="card card-static tl-panel">
        <h2 className="eyebrow m-0">Every pin, in this setup</h2>
        <div className="tl-table-wrap">
          <table className="tl-table">
            <thead>
              <tr>
                <th>Pad</th>
                <th>Name</th>
                <th>GPIO</th>
                <th>Status</th>
                <th>Functions</th>
              </tr>
            </thead>
            <tbody>
              {PINS.map((p) => {
                const pa = assess(p, setup);
                return (
                  <tr key={p.pad} data-selected={p.pad === selected || undefined}>
                    <td className="mono">{p.pad}</td>
                    <td>
                      <button type="button" className="tl-table-pin mono" onClick={() => select(p.pad)}>
                        {p.name}
                      </button>
                    </td>
                    <td className="mono">{p.gpio ?? "–"}</td>
                    <td>
                      <span className="tl-dot" style={{ background: LEVEL[pa.level].color }} />
                      {LEVEL[pa.level].label}
                    </td>
                    <td className="mono tl-table-fn">{p.fn.filter((f) => !f.startsWith("GPIO")).join(" · ") || "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
