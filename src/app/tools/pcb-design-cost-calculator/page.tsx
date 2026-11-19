import ToolShell from "@/components/tools/ToolShell";
import CostEstimator from "@/components/tools/cost/CostEstimator";
import { BOOKING_URL, CONTACT_EMAIL, CONTACT_MAILTO, HOURLY_RATE, HOURLY_RATE_USD } from "@/components/pcb/pcbData";
import { pageMetadata } from "@/lib/pageMeta";
import { toolSchema } from "@/lib/schema";
import { toolBySlug, toolCard } from "@/lib/tools";

const tool = toolBySlug("pcb-design-cost-calculator");
export const metadata = pageMetadata({ title: tool.title, description: tool.description, path: tool.path, image: toolCard(tool.slug) });

export default function CostPage() {
  return (
    <ToolShell
      tool={tool}
      schema={toolSchema(tool)}
      title={
        <>
          What will my board <em>cost to design?</em>
        </>
      }
      lede={`Pick the job, the size of the board and what is on it, and get a ballpark in hours, dollars and working days at ${HOURLY_RATE} an hour. Then send it, and get the exact number in writing.`}
      cta={{
        title: "Get the exact number.",
        body: "Send a few lines about your board and you get a fixed price in writing within 24 hours, with a money-back guarantee in the contract.",
        href: CONTACT_MAILTO,
        label: "Ask for a quote",
        secondary: { href: "/tools/pcb-design-brief", label: "Build your brief first" },
      }}
      about={
        <div className="tl-prose">
          <h2>What drives the cost</h2>
          <ul>
            <li>
              <b>Where you start.</b> An idea needs the circuit designed and the parts chosen before any layout; a finished schematic needs
              only the layout. A review is a fraction of either.
            </li>
            <li>
              <b>How much is on the board.</b> The part count is the best single measure of the work: every part is chosen, placed, routed
              and checked.
            </li>
            <li>
              <b>The features that take care.</b> Fast signals need controlled impedance, radios need an antenna kept clear, power
              conversion needs its hot loop and its heat planned, mains needs safe spacing, and a fixed enclosure leaves less room to route.
            </li>
            <li>
              <b>Layers.</b> More layers make a dense board easier to route, but add stack-up and plane planning.
            </li>
          </ul>

          <h2>Hourly or a fixed price</h2>
          <p>
            Open-ended work is billed at {HOURLY_RATE} an hour. A defined job, such as a new board, a review or a redraw, gets a fixed price
            in writing within 24 hours of your brief. Either way you see the number before any work starts.
          </p>

          <h2>What the estimate doesn&rsquo;t include</h2>
          <p>
            The factory bills the boards, the parts and the assembly directly, and certification tests are run by a test lab. Those depend on
            your quantities and markets, not on the design work.
          </p>
        </div>
      }
    >
      <CostEstimator rate={HOURLY_RATE_USD} email={CONTACT_EMAIL} booking={BOOKING_URL} />
    </ToolShell>
  );
}
