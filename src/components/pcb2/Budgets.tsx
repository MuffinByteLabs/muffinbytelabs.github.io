import { INPUT_BUDGET, SERVICE_BUDGET } from "./data";

/* ════════════════════════════════════════════════════════════════════════
   The two budgets every PCB 2 power decision had to fit inside, drawn as
   plain bars. Both come straight from the planning arithmetic in the
   project (docs/calcs/controller_budget.py) — four 0.5 A loads plus 5 W of
   service power at 85 % — and are labelled as the calculations they are.
   ════════════════════════════════════════════════════════════════════════ */

const BOARD_BUDGET_A = 3;

export function InputBudget() {
  return (
    <figure className="m-0">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">Input current vs. supply</span>
        <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>
          3 A board budget
        </span>
      </figcaption>
      <ul className="mt-4 m-0 p-0 list-none space-y-3">
        {INPUT_BUDGET.map((b) => {
          const pct = (b.amps / BOARD_BUDGET_A) * 100;
          return (
            <li key={b.volts} className="grid grid-cols-[42px_minmax(0,1fr)_64px] items-center gap-3">
              <span className="mono text-[12px] tabular-nums" style={{ color: "var(--text-2)" }}>
                {b.volts} V
              </span>
              <span
                className="relative block h-[10px] rounded-full overflow-hidden"
                style={{ background: "var(--surface-3)" }}
                aria-hidden
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #a5612f, var(--d-field))",
                  }}
                />
              </span>
              <span className="mono text-[12px] tabular-nums text-right" style={{ color: "var(--text)" }}>
                {b.amps.toFixed(2)} A
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 mb-0 text-[12px] leading-5" style={{ color: "var(--text-3)" }}>
        All four outputs at 0.5 A plus 5 W of service power at 85 % efficiency. The worst case is
        the lowest supply: 2.65 A at 9 V leaves ≈ 0.35 A of headroom under the 3 A continuous
        budget. Planning arithmetic, before protection losses.
      </p>
    </figure>
  );
}

export function ServiceBudget() {
  const total = SERVICE_BUDGET.reduce((a, b) => a + b.mA, 0);
  return (
    <figure className="m-0">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="eyebrow">5 V service allocation</span>
        <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>
          {total.toLocaleString("en-US")} mA ceiling
        </span>
      </figcaption>
      <div
        className="mt-4 flex h-[14px] rounded-full overflow-hidden"
        style={{ background: "var(--surface-3)" }}
        aria-hidden
      >
        {SERVICE_BUDGET.map((s, i) => (
          <span
            key={s.label}
            style={{
              width: `${(s.mA / total) * 100}%`,
              background: s.color,
              opacity: s.label === "Margin" ? 0.6 : 0.85,
              borderLeft: i === 0 ? "none" : "2px solid var(--surface)",
            }}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-6 gap-y-2 m-0 p-0 list-none">
        {SERVICE_BUDGET.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-[12.5px]">
            <span className="inline-flex items-center gap-2 min-w-0" style={{ color: "var(--text-2)" }}>
              <span aria-hidden className="w-2 h-2 rounded-[3px] shrink-0" style={{ background: s.color }} />
              <span>{s.label}</span>
            </span>
            <span className="mono tabular-nums text-[11.5px]" style={{ color: "var(--text-3)" }}>
              {s.mA}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
