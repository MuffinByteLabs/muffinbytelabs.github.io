import { POWER_TREE, type Rail } from "./data";

/* ════════════════════════════════════════════════════════════════════════
   The power tree as a nested list rather than a drawing: it reflows on a
   phone instead of shrinking, and a screen reader walks it as the
   hierarchy it is. The connector lines are CSS (.ptree in globals.css).

   The "USB" badge marks the only rails still alive when the board runs
   from USB alone — the whole point of the source-selection design is that
   this list stays this short.
   ════════════════════════════════════════════════════════════════════════ */

const COLOR: Record<Rail["domain"], string> = {
  field: "var(--d-field)",
  logic: "var(--d-logic)",
  analog: "var(--d-analog)",
  rs485: "var(--d-rs485)",
  can: "var(--d-can)",
  main: "var(--d-main)",
  relay: "var(--d-relay)",
};

function Node({ r }: { r: Rail }) {
  const c = COLOR[r.domain];
  return (
    <li>
      <div className="pnode">
        <span aria-hidden className="pnode-bar" style={{ background: c }} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="mono text-[12.5px] font-medium" style={{ color: "var(--text)" }}>
              {r.name}
            </span>
            <span
              className="mono text-[11px] px-1.5 py-[1px] rounded-md"
              style={{ color: c, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
            >
              {r.volts}
            </span>
            {r.usb && (
              <span
                className="mono text-[10px] px-1.5 py-[1px] rounded-md"
                style={{ color: "var(--ok)", border: "1px solid rgba(79,195,132,0.35)" }}
                title="Alive in USB-only service mode"
              >
                USB
              </span>
            )}
          </div>
          <p className="m-0 mt-1 text-[12.5px] leading-5" style={{ color: "var(--text-2)" }}>
            {r.role}
            <span style={{ color: "var(--text-3)" }}> &middot; {r.part}</span>
          </p>
        </div>
      </div>
      {r.children && r.children.length > 0 && (
        <ul>
          {r.children.map((ch) => (
            <Node key={ch.name} r={ch} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function PowerTree() {
  return (
    <div>
      <ul className="ptree" aria-label="Power tree, from the input terminal to every rail">
        <Node r={POWER_TREE} />
      </ul>
      <p className="mt-4 text-[12px] leading-5 inline-flex items-center gap-2" style={{ color: "var(--text-3)" }}>
        <span
          className="mono text-[10px] px-1.5 py-[1px] rounded-md"
          style={{ color: "var(--ok)", border: "1px solid rgba(79,195,132,0.35)" }}
        >
          USB
        </span>
        the only rails alive when the board runs from USB alone
      </p>
    </div>
  );
}
