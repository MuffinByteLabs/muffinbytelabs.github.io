import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import TraceCalculator from "@/components/tools/trace/TraceCalculator";
import { CONTACT_MAILTO } from "@/components/pcb/pcbData";
import { pageMetadata } from "@/lib/pageMeta";
import { toolSchema } from "@/lib/schema";
import { toolBySlug, toolCard } from "@/lib/tools";

const tool = toolBySlug("pcb-trace-width-calculator");
export const metadata = pageMetadata({ title: tool.title, description: tool.description, path: tool.path, image: toolCard(tool.slug) });

export default function TraceWidthPage() {
  return (
    <ToolShell
      tool={tool}
      schema={toolSchema(tool)}
      title={
        <>
          PCB trace width <em>calculator</em>
        </>
      }
      lede="How wide a trace has to be for its current, on an outer or inner layer, at any copper weight, from the IPC-2221 formula. Or turn it around: what current a trace you already have can carry. Its resistance, voltage drop and heat come with it."
      cta={{
        title: "Power paths sized right, the first time.",
        body: "On every board I lay out, power traces are sized to their current and checked for drop, heat and the fab's limits before the files go out. Need a layout, or a second look at yours?",
        href: CONTACT_MAILTO,
        label: "Start a project",
        secondary: { href: "/services#svc-01", label: "Or get your layout reviewed" },
      }}
      about={
        <div className="tl-prose">
          <h2>How it works</h2>
          <p>
            IPC-2221, the generic standard for printed board design, relates the current a trace can carry to how much it may heat up:
          </p>
          <p className="tl-formula">I = k · ΔT<sup>0.44</sup> · A<sup>0.725</sup></p>
          <ul>
            <li>
              <b>I</b> is the current in amps, <b>ΔT</b> the temperature rise in °C, and <b>A</b> the copper&rsquo;s cross-section in square mils.
            </li>
            <li>
              <b>k</b> is 0.048 for outer layers and 0.024 for inner layers.
            </li>
          </ul>
          <p>
            The calculator solves for the cross-section, then divides by the copper&rsquo;s thickness to get the width. 1 oz copper is about
            35&nbsp;µm (1.378&nbsp;mil) thick, 2&nbsp;oz twice that.
          </p>

          <h2>Why inner layers need wider traces</h2>
          <p>
            An outer trace sheds heat into the air. An inner one is wrapped in laminate, which conducts heat poorly, so IPC-2221 halves{" "}
            <b>k</b> for it. For the same current and rise, an inner trace comes out a little over two and a half times as wide.
          </p>

          <h2>Choosing the temperature rise</h2>
          <p>
            10&nbsp;°C keeps the copper close to the board&rsquo;s temperature and leaves margin for a warm enclosure. A higher rise buys a
            narrower trace, but the heat goes into the board and the parts next to it: add the rise to your worst-case ambient and check it
            against their limits.
          </p>

          <h2>Resistance and voltage drop</h2>
          <p>
            Copper&rsquo;s resistance climbs about 0.39% for every °C, so the resistance here is worked out at the trace&rsquo;s working
            temperature: ambient plus the rise. A long, narrow trace can be thermally fine and still drop enough voltage to matter. Check the
            drop on any power trace that feeds something sensitive, such as an ADC reference or a radio.
          </p>

          <h2>Where the formula stops</h2>
          <p>
            The formula is a fit to curves measured decades ago, valid up to 35&nbsp;A on outer layers and 17.5&nbsp;A on inner ones, widths up
            to 400&nbsp;mil, rises of 10–100&nbsp;°C and copper from 0.5 to 3&nbsp;oz; the calculator warns outside those. IPC-2152 replaced
            the curves in 2009 with new measurements that account for board thickness and nearby copper planes, and it generally allows
            narrower inner traces. IPC-2221 remains the standard first estimate; for a tight design, check IPC-2152 or ask your fab.
          </p>
          <p>
            More on this in the Field Note{" "}
            <Link href="/blog/trace-width-is-a-thermal-problem" className="link-gold">
              Trace Width Is a Thermal Problem
            </Link>
            .
          </p>
        </div>
      }
    >
      <TraceCalculator />
    </ToolShell>
  );
}
