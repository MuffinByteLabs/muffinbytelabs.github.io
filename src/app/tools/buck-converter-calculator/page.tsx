import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import BuckCalculator from "@/components/tools/buck/BuckCalculator";
import { CONTACT_MAILTO } from "@/components/pcb/pcbData";
import { pageMetadata } from "@/lib/pageMeta";
import { toolSchema } from "@/lib/schema";
import { toolBySlug, toolCard } from "@/lib/tools";

const tool = toolBySlug("buck-converter-calculator");
export const metadata = pageMetadata({ title: tool.title, description: tool.description, path: tool.path, image: toolCard(tool.slug) });

export default function BuckPage() {
  return (
    <ToolShell
      tool={tool}
      schema={toolSchema(tool)}
      title={
        <>
          Buck converter <em>calculator</em>
        </>
      }
      lede="Everything a step-down converter's power stage needs from its input range, output and switching frequency: duty cycle, inductor, peak and ripple currents, and the input and output capacitors. With the schematic and the inductor current drawn from your numbers."
      cta={{
        title: "Power stages that work on the first spin.",
        body: "I design and lay out converters like this on client boards: part selection, the hot loop, the thermals. If yours is next, or it is already on the bench and misbehaving, let's talk.",
        href: CONTACT_MAILTO,
        label: "Start a project",
        secondary: { href: "/services#svc-03", label: "Board already misbehaving?" },
      }}
      about={
        <div className="tl-prose">
          <h2>The equations</h2>
          <p>
            These are the standard continuous-conduction equations, as set out in TI&rsquo;s application report SLVA477B,{" "}
            <i>Basic Calculation of a Buck Converter&rsquo;s Power Stage</i>, plus the usual input-capacitor terms:
          </p>
          <ul className="tl-formulas">
            <li>
              Duty cycle: <span className="tl-formula-inline">D = Vout / (Vin · η)</span>
            </li>
            <li>
              Inductance: <span className="tl-formula-inline">L = Vout · (Vin,max − Vout) / (ΔIL · fsw · Vin,max)</span>
            </li>
            <li>
              Peak current: <span className="tl-formula-inline">Ipk = Iout + ΔIL / 2</span>
            </li>
            <li>
              Output capacitor: <span className="tl-formula-inline">Cout ≥ ΔIL / (8 · fsw · ΔVout)</span>, with{" "}
              <span className="tl-formula-inline">ESR ≤ ΔVout / ΔIL</span>
            </li>
            <li>
              Input capacitor: <span className="tl-formula-inline">Cin ≥ Iout · D · (1 − D) / (fsw · ΔVin)</span>, carrying{" "}
              <span className="tl-formula-inline">Iout · √(D · (1 − D))</span> RMS
            </li>
          </ul>

          <h2>Why two input voltages</h2>
          <p>
            Ripple current grows with the input voltage, so the inductor is sized at the highest input, and the peak current that sets its
            saturation rating comes from there too. The duty cycle is largest at the lowest input, which is where a controller&rsquo;s maximum
            duty cycle can stop it regulating. The input capacitor works hardest at a duty cycle of 50%, or as close to it as your input range
            gets.
          </p>

          <h2>Turning the numbers into parts</h2>
          <ul>
            <li>
              <b>Inductor:</b> the calculator rounds up to the next standard value. Pick a part whose saturation current is comfortably above
              the peak current (20–30% margin is common) and whose rated current is above the RMS current.
            </li>
            <li>
              <b>Output capacitors:</b> ceramics have tiny ESR but lose capacitance under DC bias: a 10&nbsp;µF part in a small package can
              offer only a few µF at 3.3&nbsp;V. Check the manufacturer&rsquo;s bias curve and add parts until the derated value clears the
              minimum.
            </li>
            <li>
              <b>Input capacitors:</b> they must sit right at the switch and ground pins, and their ripple-current rating has to cover the RMS
              current.
            </li>
            <li>
              <b>Your controller&rsquo;s datasheet wins:</b> if it gives its own inductor range, minimum output capacitance or compensation
              values, use them. These equations are the starting point, not the last word.
            </li>
          </ul>

          <h2>Layout matters as much as the values</h2>
          <p>
            A buck with the right parts in the wrong places will ring, radiate and run hot. The loop from the input capacitor through the switch
            and back to ground is the one that matters; the Field Note{" "}
            <Link href="/blog/buck-converter-layout-the-hot-loop" className="link-gold">
              Buck Converter Layout: The Loop That Matters
            </Link>{" "}
            walks through it.
          </p>
        </div>
      }
    >
      <BuckCalculator />
    </ToolShell>
  );
}
