import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = {
  title: "No route to that page | MuffinByteLabs",
  robots: { index: false, follow: true },
};

/* Next's built-in 404 is a bare "This page could not be found" with no way
   out of it. A link in an old proposal or an emailed repo URL can land a
   client here, so it gets the same voice as the rest of the site — and an
   open circuit, which is what a dead link is. */
export default function NotFound() {
  return (
    <section className="relative overflow-hidden px-6 pt-36 pb-32">
      <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
      <div className="max-w-xl mx-auto text-center">
        <svg aria-hidden viewBox="0 0 360 90" className="mx-auto w-full max-w-[360px] h-auto" fill="none">
          <path d="M0 45H120L140 25H158" stroke="#dba64b" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
          <path d="M202 25H220L240 45H360" stroke="#dba64b" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 45H120L140 25H158" stroke="#f5d189" strokeWidth="3" strokeLinecap="round" className="trace-run" />
          <circle cx="164" cy="25" r="6" fill="#0d0c0b" stroke="#dba64b" strokeWidth="2.5" />
          <circle cx="196" cy="25" r="6" fill="#0d0c0b" stroke="#dba64b" strokeOpacity="0.6" strokeWidth="2.5" />
          <path d="M174 14l12 22M186 14l-12 22" stroke="#f07167" strokeWidth="2" strokeLinecap="round" />
          <text x="180" y="72" textAnchor="middle" fontSize="11" fill="#8f8675" className="svg-mono" style={{ letterSpacing: "0.18em" }}>
            OPEN CIRCUIT
          </text>
        </svg>

        <span className="eyebrow block mt-8">Error 404</span>

        <h1 className="display mt-3 text-[2.8rem] sm:text-[3.6rem]" style={{ color: "var(--text)" }}>
          No route to <em>that page</em>
        </h1>

        <p className="lede mt-5">
          The address exists, the page at the end of it does not. It was probably renamed in a
          revision — the board work and the notes are both still here.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Icon name="arrowLeft" size={16} />
            Back to the work
          </Link>
          <Link href="/blog" className="btn btn-ghost">
            Field Notes
          </Link>
          <a
            href="mailto:muffinbytelabs@gmail.com?subject=Broken%20link%20on%20muffinbytelabs.com"
            className="link-quiet text-[13.5px] px-3 py-2"
          >
            Tell me what broke
          </a>
        </div>
      </div>
    </section>
  );
}
