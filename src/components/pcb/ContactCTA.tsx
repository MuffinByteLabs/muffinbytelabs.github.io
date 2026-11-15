import Reveal from "./Reveal";
import Icon from "@/components/ui/Icon";
import CopyEmail from "@/components/CopyEmail";
import { CONTACT_EMAIL, CONTACT_MAILTO, PROJECT_STEPS, UPWORK_URL } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   The close: one card with the one action on the left, and how a project
   runs on the right — five stages on a single line, so a client can see
   that nothing is drawn before they agree a price and nothing is released
   before they have reviewed it. The mailto opens with the four questions a
   quote needs already in the body — no form endpoint, no third party.
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
            className="relative overflow-hidden rounded-[26px] px-6 sm:px-12 py-12 sm:py-14"
            style={{
              border: "1px solid rgba(219,166,75,0.28)",
              background:
                "radial-gradient(90% 120% at 100% 0%, rgba(219,166,75,0.14), rgba(219,166,75,0) 55%), radial-gradient(70% 90% at 0% 100%, rgba(200,129,76,0.10), rgba(200,129,76,0) 60%), var(--surface)",
              boxShadow: "var(--shadow-lift)",
            }}
          >
            <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
              <div>
                <span className="kicker">
                  {index && <b>{index}</b>}
                  <span className="rule" aria-hidden />
                  Start a project
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
                    "Send a paragraph about what it does. Within a day you get a fixed quote in writing: scope, price and timeline."}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href={CONTACT_MAILTO} className="btn btn-primary">
                    Send the brief
                    <Icon name="arrowRight" size={16} className="nudge" />
                  </a>
                  {/* the brief opens a mail app; this one is for webmail */}
                  <CopyEmail email={CONTACT_EMAIL} className="btn btn-ghost" />
                </div>
                <p className="mt-5 mb-0 text-[13.5px]" style={{ color: "var(--text-3)" }}>
                  Rather keep the contract on a platform?{" "}
                  <a
                    href={UPWORK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-gold inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    My Upwork profile
                    <Icon name="arrowUpRight" size={13} />
                  </a>
                </p>
              </div>

              <div>
                <h3 className="eyebrow m-0">How a project runs</h3>
                <ol className="steps mt-5 m-0 p-0 list-none">
                  {PROJECT_STEPS.map((st) => (
                    <li key={st.num} className="step">
                      <span className="step-num mono" aria-hidden>
                        {st.num}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium leading-6" style={{ color: "var(--text)" }}>
                          {st.title}
                        </span>
                        <span className="block mt-0.5 text-[13.5px] leading-6" style={{ color: "var(--text-2)" }}>
                          {st.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
