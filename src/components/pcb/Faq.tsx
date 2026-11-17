import Reveal from "./Reveal";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import { FAQ } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   The questions a client asks before writing (price, time, files, tools,
   NDA, Upwork), answered in a line or two each.

   Native <details>: no JavaScript, works from the keyboard, and every
   answer is in the page's HTML even while it is closed, so search engines
   and AI assistants read all of it. The same words are published as
   FAQPage structured data (homeSchema) and in /llms.txt.
   ════════════════════════════════════════════════════════════════════════ */
export default function Faq({ index }: { index?: string }) {
  return (
    <section id="faq" className="px-6 pb-24 sm:pb-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-x-14 gap-y-10 items-start">
        <Reveal>
          <SectionHead
            index={index}
            label="Questions"
            title={
              <>
                What clients <em>ask first</em>
              </>
            }
            lede="Price, time, files and tools, answered in a line or two."
          />
        </Reveal>

        <Reveal delay={70}>
          <div className="card card-static">
            {FAQ.map((f) => (
              <details key={f.q} className="faq-item">
                <summary className="faq-q">
                  <h3 className="faq-q-text">{f.q}</h3>
                  <span className="faq-plus" aria-hidden>
                    <Icon name="plus" size={18} />
                  </span>
                </summary>
                <div className="faq-a">
                  <p>{f.a}</p>
                  {f.link && (
                    <a
                      href={f.link.href}
                      {...(f.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...(f.link.download ? { download: true } : {})}
                      className="link-gold inline-flex items-center gap-1.5 mt-3 text-[13.5px] font-medium"
                    >
                      {f.link.label}
                      <Icon name={f.link.external ? "arrowUpRight" : f.link.download ? "download" : "arrowRight"} size={14} />
                    </a>
                  )}
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
