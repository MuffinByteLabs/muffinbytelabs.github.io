"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { Chips, Seg, Stat } from "../fields";
import { usd } from "../format";
import { EXTRAS, LAYERS, SCOPES, SIZES, estimate, type ExtraId, type ScopeId, type SizeId } from "./costModel";

/* ════════════════════════════════════════════════════════════════════════
   The design cost estimator: what kind of job, how big a board, which of
   the features that cost time, then a ballpark in hours, dollars and
   working days. The rate and the address arrive as props from the server
   page, so this file pulls no site data into the browser.
   ════════════════════════════════════════════════════════════════════════ */

export default function CostEstimator({ rate, email, booking }: { rate: number; email: string; booking: string }) {
  const [scope, setScope] = useState<ScopeId>("new");
  const [size, setSize] = useState<SizeId>("medium");
  const [layers, setLayers] = useState(2);
  const [extras, setExtras] = useState<ExtraId[]>([]);

  const e = useMemo(() => estimate({ scope, size, layers, extras, rate }), [scope, size, layers, extras, rate]);
  const job = SCOPES.find((s) => s.id === scope)!;
  const board = SIZES.find((s) => s.id === size)!;
  const extraLabels = EXTRAS.filter((x) => extras.includes(x.id)).map((x) => x.label);

  const mailto = `mailto:${email}?subject=${encodeURIComponent("PCB project quote")}&body=${encodeURIComponent(
    [
      "Hi Ray,",
      "",
      "I used your cost estimator:",
      `- Job: ${job.label}`,
      `- Board: ${board.label} (${board.note})`,
      `- Layers: ${LAYERS.find((l) => l.id === layers)?.label}`,
      ...(extraLabels.length ? [`- Also: ${extraLabels.join("; ")}`] : []),
      `- Ballpark: ${e.hours[0]}–${e.hours[1]} hours (${usd(e.cost[0])}–${usd(e.cost[1])})`,
      "",
      "About the project:",
      "",
    ].join("\n")
  )}`;

  return (
    <div className="tl-grid">
      <div className="card card-static tl-panel">
        <div className="tl-field">
          <span className="tl-label" id="tl-job">
            The job
          </span>
          <div className="tl-options" role="group" aria-labelledby="tl-job">
            {SCOPES.map((s) => (
              <button key={s.id} type="button" className="tl-option" aria-pressed={s.id === scope} onClick={() => setScope(s.id)}>
                <span className="tl-option-title">{s.label}</span>
                <span className="tl-option-note">{s.includes}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="tl-field">
          <Seg label="The board" value={size} onChange={setSize} options={SIZES.map((s) => ({ id: s.id, label: s.label }))} />
          <p className="tl-hint">{board.note}.</p>
        </div>
        <Seg label="Copper layers" value={layers} onChange={setLayers} options={LAYERS.map((l) => ({ id: l.id, label: l.label }))} />
        <Chips
          label="On the board (pick any)"
          options={EXTRAS.map((x) => x.label)}
          values={extraLabels}
          onChange={(vals) => setExtras(EXTRAS.filter((x) => vals.includes(x.label)).map((x) => x.id))}
        />
      </div>

      <div className="card card-static tl-panel tl-out tl-sticky" aria-live="polite">
        <Stat accent label="Ballpark" value={`${usd(e.cost[0])}–${usd(e.cost[1])}`} note={`${e.hours[0]}–${e.hours[1]} hours at $${rate} an hour`} />
        <div className="tl-rows">
          {/* a review or a debug job has its own published turnaround, which
              is calendar time; showing work-days beside it would read as a
              contradiction, so it gets the turnaround alone */}
          {e.turnaround ? (
            <div className="tl-row">
              <span className="tl-row-label">How it runs</span>
              <span className="tl-row-value">{e.turnaround}</span>
            </div>
          ) : (
            <div className="tl-row">
              <span className="tl-row-label">Time to the finished files</span>
              <span className="tl-row-value mono">
                {e.days[0] === e.days[1] ? e.days[0] : `${e.days[0]}–${e.days[1]}`} working day{e.days[1] > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {e.needsFab && (
            <div className="tl-row">
              <span className="tl-row-label">Then, at the factory</span>
              <span className="tl-row-value">usually 1–3 weeks to make, assemble and ship the boards</span>
            </div>
          )}
        </div>
        <div className="tl-included">
          <span className="tl-label">What you get</span>
          <p>
            {job.includes}{" "}
            <Link href={`/services#${job.service}`} className="link-gold">
              See the service
            </Link>
          </p>
        </div>
        <p className="tl-fine">
          A ballpark from typical projects, not a quote. Send your brief and you get a fixed price in writing within 24 hours, with a
          money-back guarantee in the contract.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-1">
          <a href={mailto} className="btn btn-primary">
            <Icon name="mail" size={15} />
            Email me this estimate
          </a>
          <Link href="/tools/pcb-design-brief" className="link-gold text-[13.5px] font-medium">
            Or write a full brief first
          </Link>
        </div>
        <p className="tl-fine">
          Rather talk it through?{" "}
          <a href={booking} target="_blank" rel="noopener noreferrer" className="link-gold">
            Book a 15-minute call
          </a>
          .
        </p>
      </div>
    </div>
  );
}
