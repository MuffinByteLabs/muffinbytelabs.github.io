import Tabs from "@/components/ui/Tabs";
import { Stackup, STACK_PCB2 } from "@/components/pcb/Stackup";
import ArchitectureDiagram from "./ArchitectureDiagram";
import DomainMap, { DomainLegend } from "./DomainMap";
import PowerTree from "./PowerTree";
import { InputBudget, ServiceBudget } from "./Budgets";
import { DESIGN_RULES } from "./data";

/* ════════════════════════════════════════════════════════════════════════
   PCB 2's engineering drawings, one at a time: the architecture, the
   isolation domains, the power tree and the stack-up.

   They used to sit on the homepage card, where four dense drawings were
   the most crowded thing on the page. They live on the case-study page
   now, behind tabs, so a reader who wants them gets all four and a reader
   who does not sees one.
   ════════════════════════════════════════════════════════════════════════ */
export default function Pcb2Drawings() {
  return (
    <Tabs
      label="PCB 2 drawings"
      /* the architecture drawing is the widest; a phone opens on the map */
      mobileFirst="domains"
      items={[
        {
          key: "arch",
          label: "Architecture",
          icon: "flag",
          content: <ArchitectureDiagram />,
        },
        {
          key: "domains",
          label: "Isolation domains",
          icon: "isolation",
          content: (
            <div>
              <DomainMap id="dmap-tabs" />
              <DomainLegend />
            </div>
          ),
        },
        {
          key: "power",
          label: "Power tree",
          icon: "bolt",
          content: (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-8 lg:gap-10">
              <PowerTree />
              <div className="space-y-8 lg:pt-1">
                <InputBudget />
                <ServiceBudget />
              </div>
            </div>
          ),
        },
        {
          key: "stack",
          label: "Stack-up",
          icon: "layers",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 md:gap-10">
              <Stackup layers={STACK_PCB2} showLabel={false} total="1.6 mm FR-4 · 1 oz" />
              <div className="self-center">
                <span className="eyebrow">Design rules</span>
                <dl
                  className="mt-3 m-0 grid grid-cols-2 gap-px rounded-xl overflow-hidden"
                  style={{ background: "var(--border-soft)", border: "1px solid var(--border-soft)" }}
                >
                  {DESIGN_RULES.map((r) => (
                    <div key={r.label} className="px-4 py-3" style={{ background: "var(--surface)" }}>
                      <dt className="text-[11.5px]" style={{ color: "var(--text-3)" }}>
                        {r.label}
                      </dt>
                      <dd className="m-0 mt-1 mono text-[13px]" style={{ color: "var(--text)" }}>
                        {r.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
