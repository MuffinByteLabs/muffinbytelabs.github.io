import Link from "next/link";
import SectionHead from "@/components/ui/SectionHead";
import Icon from "@/components/ui/Icon";
import ToolCards from "./ToolCards";
import { TOOLS, MEMORY_MAP_TOOL, type Tool } from "@/lib/tools";
import { jsonLd } from "@/lib/schema";

/* ════════════════════════════════════════════════════════════════════════
   The frame every tool page shares: breadcrumb, heading, the tool, then
   the explanation search engines and careful readers both want, a way to
   hire the person who built it, and the other tools.

   Server-rendered. Only the tool itself (the `children`) ships JavaScript,
   and only on its own page.
   ════════════════════════════════════════════════════════════════════════ */
export default function ToolShell({
  tool,
  schema,
  title,
  lede,
  children,
  about,
  cta,
}: {
  tool: Tool;
  schema: unknown;
  title: React.ReactNode;
  lede: React.ReactNode;
  children: React.ReactNode;
  /** how it works: prose, server-rendered */
  about?: React.ReactNode;
  cta: { title: string; body: string; href: string; label: string; external?: boolean; secondary?: { href: string; label: string } };
}) {
  /* the same audience first, then the rest, then the memory map */
  const others = [
    ...TOOLS.filter((t) => t.slug !== tool.slug && t.audience === tool.audience),
    ...TOOLS.filter((t) => t.audience !== tool.audience),
    MEMORY_MAP_TOOL,
  ].slice(0, 3);

  return (
    <div className="relative overflow-hidden px-6 pt-28 sm:pt-32 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <div aria-hidden className="grid-bg absolute inset-0 -z-10" />
      <div className="max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb" className="tl-crumbs">
          <Link href="/tools" className="link-quiet">
            Free tools
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{tool.name}</span>
        </nav>

        <SectionHead
          as="h1"
          className="mt-6"
          label={tool.audience === "engineers" ? "Free tool · for engineers" : "Free tool · for product teams"}
          title={title}
          lede={lede}
        />

        <div className="mt-10 sm:mt-12">{children}</div>

        {about && <div className="tl-about">{about}</div>}

        <aside className="card card-static edge-glow tl-cta">
          <div>
            <span className="eyebrow">Made by Ray Malik, freelance PCB designer</span>
            <h2 className="display mt-2 mb-0 text-[1.75rem] leading-tight" style={{ color: "var(--text)" }}>
              {cta.title}
            </h2>
            <p className="mt-2 mb-0 text-[14.5px] leading-7 max-w-[56ch]" style={{ color: "var(--text-2)" }}>
              {cta.body}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 shrink-0">
            <a
              href={cta.href}
              className="btn btn-primary"
              {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {cta.label}
              <Icon name="arrowRight" size={15} className="nudge" />
            </a>
            {cta.secondary &&
              (cta.secondary.href.startsWith("http") ? (
                <a href={cta.secondary.href} target="_blank" rel="noopener noreferrer" className="link-gold text-[13.5px] font-medium">
                  {cta.secondary.label}
                </a>
              ) : (
                <Link href={cta.secondary.href} className="link-gold text-[13.5px] font-medium">
                  {cta.secondary.label}
                </Link>
              ))}
          </div>
        </aside>

        <div className="mt-20">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="eyebrow m-0">More free tools</h2>
            <Link href="/tools" className="link-quiet inline-flex items-center gap-1.5 text-[13px]">
              All tools <Icon name="arrowRight" size={13} />
            </Link>
          </div>
          <ToolCards tools={others} className="mt-5" />
        </div>
      </div>
    </div>
  );
}
