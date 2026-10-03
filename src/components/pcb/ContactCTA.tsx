import Reveal from "./Reveal";
import Icon from "@/components/ui/Icon";
import CopyEmail from "@/components/CopyEmail";
import { CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_STEPS } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   The close: one card that says how a job starts, in three steps, with the
   one action. The mailto opens with the four questions a quote needs
   already in the body — no form endpoint, no third party.
   ════════════════════════════════════════════════════════════════════════ */
export default function ContactCTA({
  title,
  lede,
  index,
}: {
  title?: React.ReactNode;
  lede?: string;
  /** the section number on the home page; omitted elsewhere */
  index?: string;
}) {
  return (
    <section id="contact" className="px-6 pb-24 sm:pb-28">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[26px] px-6 sm:px-12 py-12 sm:py-16"
            style={{
              border: "1px solid rgba(219,166,75,0.28)",
              background:
                "radial-gradient(90% 120% at 100% 0%, rgba(219,166,75,0.14), rgba(219,166,75,0) 55%), radial-gradient(70% 90% at 0% 100%, rgba(200,129,76,0.10), rgba(200,129,76,0) 60%), var(--surface)",
              boxShadow: "var(--shadow-lift)",
            }}
          >

            <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
              <div>
                <span className="kicker">
                  {index && <b>{index}</b>}
                  <span className="rule" aria-hidden />
                  Start a board
                </span>
                <h2 className="display mt-4 text-[2.5rem] sm:text-[3.3rem]" style={{ color: "var(--text)" }}>
                  {title ?? (
                    <>
                      Have a board that has to work <em>the first time</em>?
                    </>
                  )}
                </h2>
                <p className="lede mt-5 max-w-[50ch]">
                  {lede ??
                    "Send a paragraph about what it does. You get a fixed quote — scope, price and timeline in writing — within a day, and a money-back guarantee in the contract."}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href={CONTACT_MAILTO} className="btn btn-primary">
                    Send the brief
                    <Icon name="arrowRight" size={16} className="nudge" />
                  </a>
                  {/* the brief opens a mail app; this one is for webmail */}
                  <CopyEmail email={CONTACT_EMAIL} className="btn btn-ghost" />
                </div>
              </div>

              <ol className="m-0 p-0 list-none space-y-3">
                {CONTACT_STEPS.map((st) => (
                  <li
                    key={st.num}
                    className="flex gap-4 rounded-2xl p-5"
                    style={{ background: "rgba(13,12,11,0.55)", border: "1px solid var(--border-soft)" }}
                  >
                    <span
                      className="mono text-[12px] w-9 h-9 shrink-0 rounded-full inline-flex items-center justify-center"
                      style={{ color: "var(--accent)", border: "1px solid var(--accent-line)", background: "var(--accent-soft)" }}
                    >
                      {st.num}
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium leading-6" style={{ color: "var(--text)" }}>
                        {st.title}
                      </span>
                      <span className="block mt-1 text-[13.5px] leading-6" style={{ color: "var(--text-2)" }}>
                        {st.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
