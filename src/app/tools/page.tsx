import Link from "next/link";
import SectionHead from "@/components/ui/SectionHead";
import Icon from "@/components/ui/Icon";
import ToolCards from "@/components/tools/ToolCards";
import { pageMetadata } from "@/lib/pageMeta";
import { jsonLd, toolsHubSchema } from "@/lib/schema";
import { MEMORY_MAP_TOOL, TOOLS, TOOLS_HUB } from "@/lib/tools";

export const metadata = pageMetadata({ title: TOOLS_HUB.title, description: TOOLS_HUB.description, path: TOOLS_HUB.path, image: TOOLS_HUB.image });

/* ════════════════════════════════════════════════════════════════════════
   /tools: every free tool, split by who it is for. Engineers come for a
   number they need today; product teams come to understand what a board
   costs and what the words mean. Both find the person who made them.
   ════════════════════════════════════════════════════════════════════════ */
export default function ToolsPage() {
  const engineers = [...TOOLS.filter((t) => t.audience === "engineers"), MEMORY_MAP_TOOL];
  const clients = TOOLS.filter((t) => t.audience === "clients");
  return (
    <div className="relative overflow-hidden px-6 pt-32 pb-24 sm:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(toolsHubSchema(TOOLS_HUB, [...engineers, ...clients]))} />
      <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
      <div className="max-w-6xl mx-auto">
        <SectionHead
          as="h1"
          label="Free tools"
          title={
            <>
              Free <em>PCB tools</em>
            </>
          }
          lede="Calculators and references from real board work, free to use: no sign-up, nothing stored, and nothing you type leaves your browser. Half are for engineers at the bench, half for the people paying for the board."
        />

        <section className="mt-14" aria-labelledby="for-engineers">
          <div className="tl-hub-head">
            <h2 id="for-engineers" className="display">
              For engineers
            </h2>
            <p>Numbers you need while you design: pins, power stages, trace widths, registers.</p>
          </div>
          <ToolCards tools={engineers} className="mt-6" />
        </section>

        <section className="mt-16" aria-labelledby="for-teams">
          <div className="tl-hub-head">
            <h2 id="for-teams" className="display">
              For product teams
            </h2>
            <p>What a board costs to design, what to send a designer, and what the jargon means.</p>
          </div>
          <ToolCards tools={clients} className="mt-6" />
        </section>

        <section className="mt-16" aria-labelledby="for-fun">
          <Link href="/#spot-the-fault" className="card card-link group tl-hub-fun">
            <span className="tl-card-icon" aria-hidden>
              <Icon name="play" size={20} />
            </span>
            <span>
              <span id="for-fun" className="block text-[16px] font-semibold tracking-[-0.014em]" style={{ color: "var(--text)" }}>
                And one for fun: Spot the fault
              </span>
              <span className="block mt-1 text-[13.5px] leading-6" style={{ color: "var(--text-2)" }}>
                Five layout mistakes are hiding on a practice board. How many can you find in 60 seconds?
              </span>
            </span>
            <span className="ml-auto transition-transform group-hover:translate-x-1" style={{ color: "var(--accent)" }} aria-hidden>
              <Icon name="arrowRight" size={16} />
            </span>
          </Link>
        </section>
      </div>
    </div>
  );
}
