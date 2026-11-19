import ToolShell from "@/components/tools/ToolShell";
import BriefBuilder from "@/components/tools/brief/BriefBuilder";
import { BOOKING_URL, CONTACT_EMAIL, UPWORK_URL } from "@/components/pcb/pcbData";
import { pageMetadata } from "@/lib/pageMeta";
import { toolSchema } from "@/lib/schema";
import { toolBySlug, toolCard } from "@/lib/tools";

const tool = toolBySlug("pcb-design-brief");
export const metadata = pageMetadata({ title: tool.title, description: tool.description, path: tool.path, image: toolCard(tool.slug) });

export default function BriefPage() {
  return (
    <ToolShell
      tool={tool}
      schema={toolSchema(tool)}
      title={
        <>
          Write your <em>PCB brief</em>
        </>
      }
      lede="The questions a designer needs answered to quote your board, in one place. Answer what you can, skip what you don't know yet, and the brief writes itself on the right. Copy it, or send it straight to me."
      cta={{
        title: "Rather talk it through?",
        body: "Book a 15-minute video call and we'll go through the board together. If you'd rather keep the contract on a platform, I'm on Upwork too.",
        href: BOOKING_URL,
        external: true,
        label: "Book a 15-minute call",
        secondary: { href: UPWORK_URL, label: "Or hire me on Upwork" },
      }}
      about={
        <div className="tl-prose">
          <h2>Why a brief matters</h2>
          <p>
            A quote depends on a handful of facts: what the board does, how it is powered, how many you will make, how big it can be and when
            you need it. With them in the first email, the quote is accurate and nothing is discovered halfway through. Without them, the first
            few emails are questions.
          </p>

          <h2>Tips for a good one</h2>
          <ul>
            <li>
              <b>Say what it does, not how.</b> &ldquo;Logs soil moisture every hour and sends it over Wi-Fi&rdquo; is better than a parts
              list: choosing the parts is the designer&rsquo;s job.
            </li>
            <li>
              <b>Quantities change everything.</b> Five prototypes and five thousand units lead to different parts, assembly and cost
              targets.
            </li>
            <li>
              <b>Name the constraints early.</b> An enclosure you already have, a battery that must last a year, a market that needs
              certification: each one shapes the design from the start.
            </li>
            <li>
              <b>Share what exists.</b> A photo of a breadboard, a dev-kit wiring diagram or a similar product says a lot in one picture.
            </li>
          </ul>

          <h2>What happens next</h2>
          <p>
            You get a fixed price and a timeline in writing within 24 hours, with an NDA signed first if you need one. Nothing starts until you
            have agreed the number.
          </p>
        </div>
      }
    >
      <BriefBuilder email={CONTACT_EMAIL} />
    </ToolShell>
  );
}
