import { PERMIT_INPUTS, PERMIT_OUTPUTS } from "./data";

/* ════════════════════════════════════════════════════════════════════════
   The hardware output permission, drawn as the AND gate it is. HTML on
   either side so it reflows on a phone — inputs, gate, outputs stack —
   and an SVG gate in the middle.
   ════════════════════════════════════════════════════════════════════════ */
export default function PermissionGate() {
  return (
    <div
      className="rounded-2xl p-5 sm:p-7"
      style={{ background: "var(--bg-alt)", border: "1px solid var(--border-soft)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] items-center gap-5 md:gap-0">
        {/* the four conditions */}
        <ul className="m-0 p-0 list-none space-y-2.5">
          {PERMIT_INPUTS.map((p) => (
            <li key={p.name} className="relative flex items-center">
              <span
                className="flex-1 rounded-xl px-4 py-2.5"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <span className="block mono text-[12.5px]" style={{ color: "var(--text)" }}>
                  {p.name}
                </span>
                <span className="block text-[11.5px] leading-5" style={{ color: "var(--text-3)" }}>
                  {p.from}
                </span>
              </span>
              <span aria-hidden className="hidden md:block w-6 h-px" style={{ background: "var(--d-safety)", opacity: 0.6 }} />
            </li>
          ))}
        </ul>

        {/* the gate */}
        <div className="flex md:block justify-center">
          <svg viewBox="0 0 150 170" className="w-[120px] md:w-full h-auto" role="img" aria-label="A four-input AND gate">
            <g stroke="var(--d-safety)" strokeWidth={1.6} fill="none" strokeLinecap="round">
              {[38, 68, 100, 130].map((y) => (
                <path key={y} d={`M0 ${y} H34`} opacity={0.6} />
              ))}
              <path d="M34 22 H76 A62 62 0 0 1 76 146 H34 Z" fill="rgba(240,113,103,0.07)" />
              <path d="M138 84 H150" />
            </g>
            <text x={80} y={80} textAnchor="middle" fontSize={20} fill="var(--text)" className="svg-serif">
              AND
            </text>
            <text x={80} y={100} textAnchor="middle" fontSize={9} fill="var(--text-3)" className="svg-mono" style={{ letterSpacing: "0.12em" }}>
              IN HARDWARE
            </text>
          </svg>
        </div>

        {/* what it gates */}
        <ul className="m-0 p-0 list-none space-y-2.5">
          {PERMIT_OUTPUTS.map((o) => (
            <li key={o.name} className="flex items-center">
              <span aria-hidden className="hidden md:block w-6 h-px" style={{ background: "var(--d-safety)", opacity: 0.6 }} />
              <span
                className="flex-1 rounded-xl px-4 py-2.5"
                style={{ background: "rgba(240,113,103,0.06)", border: "1px solid rgba(240,113,103,0.3)" }}
              >
                <span className="block text-[13px] font-medium" style={{ color: "var(--text)" }}>
                  {o.name}
                </span>
                <span className="block text-[11.5px] leading-5" style={{ color: "var(--text-3)" }}>
                  {o.note}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 mb-0 text-[12.5px] leading-6" style={{ color: "var(--text-3)" }}>
        External pull-downs hold every command pin off through reset and with the MCU unpowered.
        The switch&rsquo;s diagnostic-enable pin is deliberately <em>not</em> treated as an output
        disable &mdash; the gate is the only thing allowed to be one.
      </p>
    </div>
  );
}
