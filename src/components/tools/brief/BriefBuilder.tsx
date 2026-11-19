"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { Chips, TextField } from "../fields";
import { copyText } from "../clipboard";
import { EMPTY_BRIEF, OPTIONS, QUESTION_COUNT, answered, formatBrief, type Brief } from "./brief";

/* ════════════════════════════════════════════════════════════════════════
   The brief builder: the questions on the left, the brief they make on
   the right, updating as you type. Copy it anywhere, or send it through
   your own email app. Nothing is stored or sent by the page itself.
   ════════════════════════════════════════════════════════════════════════ */

/** a mailto body longer than this may be cut short by some email apps */
const MAILTO_SAFE = 1800;

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="tl-section">
      <legend>
        <span className="mono">{String(n).padStart(2, "0")}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export default function BriefBuilder({ email }: { email: string }) {
  const [b, setB] = useState<Brief>(EMPTY_BRIEF);
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");
  const set = <K extends keyof Brief>(k: K) => (v: Brief[K]) => setB((prev) => ({ ...prev, [k]: v }));
  const one = (k: "stage" | "chip" | "enclosure" | "fab" | "budget") => (vals: string[]) => setB((prev) => ({ ...prev, [k]: vals[0] ?? "" }));

  const text = useMemo(() => formatBrief(b, "muffinbytelabs.com/tools/pcb-design-brief"), [b]);
  const done = answered(b);
  const subject = b.project.trim() ? `PCB project brief: ${b.project.trim()}` : "PCB project brief";
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  const long = text.length > MAILTO_SAFE;

  async function copy() {
    setCopied((await copyText(text)) ? "ok" : "fail");
    setTimeout(() => setCopied(""), 2500);
  }

  return (
    <div className="tl-grid tl-grid-brief">
      <div className="card card-static tl-panel">
        <Section n={1} title="What it is">
          <TextField label="Project name" value={b.project} onChange={set("project")} placeholder="e.g. Soil moisture logger" />
          <TextField label="What does it do?" multiline value={b.what} onChange={set("what")} placeholder="In a sentence or two, the way you'd explain it to a friend." />
          <TextField label="Who uses it, and where?" value={b.users} onChange={set("users")} placeholder="e.g. gardeners, outdoors, all year" />
          <Chips label="Where it lives" options={OPTIONS.environment} values={b.environment} onChange={set("environment")} />
        </Section>

        <Section n={2} title="Where it stands">
          <Chips single label="What you have today" options={OPTIONS.stage} values={b.stage ? [b.stage] : []} onChange={one("stage")} />
          <TextField label="Anything that exists already" multiline value={b.existing} onChange={set("existing")} placeholder="Sketches, a dev-kit prototype, a schematic, an old board, links to similar products." />
        </Section>

        <Section n={3} title="Power">
          <Chips label="Powered from" options={OPTIONS.power} values={b.power} onChange={set("power")} />
          <TextField label="Anything else about power" value={b.powerNotes} onChange={set("powerNotes")} placeholder="e.g. must run a year on two AA cells" />
        </Section>

        <Section n={4} title="Electronics">
          <Chips single label="Main chip" options={OPTIONS.chip} values={b.chip ? [b.chip] : []} onChange={one("chip")} />
          <Chips label="Connectivity" options={OPTIONS.links} values={b.links} onChange={set("links")} />
          <TextField label="Sensors, displays, motors and other parts" multiline value={b.parts} onChange={set("parts")} placeholder="e.g. a temperature sensor, an e-paper display, two relays" />
        </Section>

        <Section n={5} title="Size and enclosure">
          <TextField label="Largest the board can be" value={b.size} onChange={set("size")} placeholder="e.g. 50 × 30 mm, or 'fits in my hand'" />
          <Chips single label="Enclosure" options={OPTIONS.enclosure} values={b.enclosure ? [b.enclosure] : []} onChange={one("enclosure")} />
        </Section>

        <Section n={6} title="Quantities and cost">
          <div className="tl-pair">
            <TextField label="Prototype boards" value={b.protoQty} onChange={set("protoQty")} placeholder="e.g. 5" />
            <TextField label="First production run" value={b.prodQty} onChange={set("prodQty")} placeholder="e.g. 500" />
          </div>
          <TextField label="Target cost per finished board" value={b.unitCost} onChange={set("unitCost")} placeholder="e.g. under $15 at 500 units" />
          <Chips single label="Manufacturer" options={OPTIONS.fab} values={b.fab ? [b.fab] : []} onChange={one("fab")} />
        </Section>

        <Section n={7} title="Timeline and budget">
          <TextField label="Deadline" value={b.deadline} onChange={set("deadline")} placeholder="e.g. prototypes in hand by March" />
          <Chips single label="Design budget" options={OPTIONS.budget} values={b.budget ? [b.budget] : []} onChange={one("budget")} />
          <Chips label="Certifications needed" options={OPTIONS.certs} values={b.certs} onChange={set("certs")} />
        </Section>

        <Section n={8} title="You">
          <div className="tl-pair">
            <TextField label="Your name" value={b.name} onChange={set("name")} />
            <TextField label="Company (optional)" value={b.company} onChange={set("company")} />
          </div>
        </Section>
      </div>

      <div className="card card-static tl-panel tl-out tl-sticky">
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow">Your brief</span>
          <span className="mono text-[12px]" style={{ color: "var(--text-3)" }}>
            {done} of {QUESTION_COUNT} answered
          </span>
        </div>
        <pre className="tl-brief" aria-live="polite">
          {text}
        </pre>
        <div className="flex flex-wrap items-center gap-3">
          <a href={mailto} className="btn btn-primary btn-sm">
            <Icon name="mail" size={14} />
            Email it to Ray
          </a>
          <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>
            <Icon name={copied === "ok" ? "check" : "copy"} size={14} />
            {copied === "ok" ? "Copied" : copied === "fail" ? "Couldn't copy" : "Copy the brief"}
          </button>
          {done > 0 && (
            <button type="button" className="link-quiet text-[13px]" onClick={() => setB(EMPTY_BRIEF)}>
              Start over
            </button>
          )}
        </div>
        {long && (
          <p className="tl-fine">A long brief can be cut short by some email apps: use Copy and paste it into your email instead.</p>
        )}
        <p className="tl-fine">
          Nothing you type leaves this page until you send it yourself: the email opens in your own app, ready to edit. Every question is
          optional; blanks are left out.
        </p>
      </div>
    </div>
  );
}
