import Reveal from "./Reveal";
import ClientArt from "./ClientArt";
import SectionHead from "@/components/ui/SectionHead";
import Unbroken from "@/components/ui/Unbroken";
import { CLIENT_WORK } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   Client work — the first thing after the hero, because "has he done this
   for someone else?" is the first thing a client wants answered.

   Each card is a board or circuit engineered for a client: what the
   board is, and what was engineered on it. No client is named and no
   client file is shown, and the section says so out loud — a client
   reading it is also learning how their own project will be treated.

   Five cards: two wide on top, three beneath. Server-rendered.
   ════════════════════════════════════════════════════════════════════════ */

/* a six-column grid from xl: two wide cards, then three. Below that the
   cards go two-up — three across would squeeze the drawings — and the
   fifth spans the row. */
const SPAN = ["xl:col-span-3", "xl:col-span-3", "xl:col-span-2", "xl:col-span-2", "md:col-span-2 xl:col-span-2"];

export default function ClientWork({ index }: { index?: string }) {
  return (
    <section id="work" className="px-6 pb-24 sm:pb-32">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHead
            index={index}
            label="Client work"
            title={
              <>
                Recent <em>client projects</em>
              </>
            }
            lede="Boards and circuits engineered for clients. The designs are theirs, so the descriptions stay general and no client is named."
          />
        </Reveal>

        <ul className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 sm:gap-5 m-0 p-0 list-none">
          {CLIENT_WORK.map((c, i) => (
            <li key={c.title} className={SPAN[i]}>
              <Reveal delay={(i % 3) * 70} className="h-full">
                <article className="card card-static h-full overflow-hidden flex flex-col">
                  <div className={`client-art ${i < 2 ? "client-art-wide" : ""}`}>
                    <ClientArt art={c.art} />
                  </div>
                  <div className="px-6 sm:px-7 pt-6 pb-7 flex flex-col flex-1">
                    <span className="mono text-[10.5px] tracking-[0.14em] uppercase" style={{ color: "var(--accent)" }}>
                      {c.kind}
                    </span>
                    <h3 className="display mt-2.5 text-[1.55rem] sm:text-[1.7rem]" style={{ color: "var(--text)" }}>
                      <Unbroken>{c.title}</Unbroken>
                    </h3>
                    <p className="mt-3 mb-0 text-[14px] leading-[1.7]" style={{ color: "var(--text-2)" }}>
                      {c.summary}
                    </p>
                    <ul className="mt-auto pt-5 flex flex-wrap gap-2 m-0 p-0 list-none">
                      {c.facts.map((f) => (
                        <li key={f} className="chip chip-mono">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
