import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import Board3D from "./Board3D";
import BoardHeader from "./BoardHeader";
import LayoutExplorer from "./LayoutExplorer";
import RepoFiles from "./RepoFiles";
import FlipPhoto from "./FlipPhoto";
import { BOARDS, type BoardImage } from "./pcbData";
import { Stackup, STACK_4L, STACK_PCB2 } from "./Stackup";
import Tabs from "@/components/ui/Tabs";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import ArchitectureDiagram from "@/components/pcb2/ArchitectureDiagram";
import DomainMap, { DomainLegend } from "@/components/pcb2/DomainMap";
import PowerTree from "@/components/pcb2/PowerTree";
import { InputBudget, ServiceBudget } from "@/components/pcb2/Budgets";
import { DESIGN_RULES, PCB2_IO, DOMAIN_COLOR, PCB2_SLUG } from "@/components/pcb2/data";

/* ════════════════════════════════════════════════════════════════════════
   WORK — two boards as a pair of panels with the same shape: what it is,
   its key numbers, and a good look at it behind a row of tabs.

   PCB 1 opens on a photograph of the assembled board that turns over to
   show the back, then the 3D model,
   the layout drawn from the board file, the renders, the stack-up and the
   public repository. PCB 2 opens on the engineering drawings that decided
   it, with the long version on its own case-study page.

   Server-rendered; only the tabs, the 3D viewer, the layout explorer and
   the architecture tracer ship JavaScript.
   ════════════════════════════════════════════════════════════════════════ */

const PCB1_NOTES: { title: string; body: string }[] = [
  {
    title: "Both inner layers are solid ground",
    body: "No signals on either plane, so every trace has its return directly underneath.",
  },
  {
    title: "A real 90 Ω USB pair",
    body: "0.29 mm tracks, 0.20 mm gap, length-matched, with not a single via on either leg.",
  },
  {
    title: "Twelve labelled test points",
    body: "Nine SMD pads plus a through-hole UART recovery trio.",
  },
];

/** a photo or render in a quiet frame, with its tag and one-line caption */
function Figure({ im, wide = false }: { im: BoardImage; wide?: boolean }) {
  return (
    <figure className={`m-0 min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--border)", background: "var(--bg-alt)" }}
      >
        <Image
          src={im.src}
          alt={im.alt}
          width={im.width}
          height={im.height}
          className={`block w-full h-auto ${wide ? "sm:max-h-[520px] sm:object-contain" : ""}`}
          sizes={wide ? "(max-width: 1152px) 100vw, 1060px" : "(max-width: 640px) 100vw, 520px"}
        />
        <span
          className="absolute top-3 left-3 text-[10.5px] px-2 py-1 rounded-md mono tracking-wide"
          style={{ color: "var(--text)", background: "rgba(10,9,8,0.72)", border: "1px solid var(--border)" }}
        >
          {im.tag}
        </span>
      </div>
      <figcaption className="mt-2.5 text-[12.5px] leading-5" style={{ color: "var(--text-3)" }}>
        {im.caption}
      </figcaption>
    </figure>
  );
}

export default function BoardsGallery() {
  const [pcb1, pcb2] = BOARDS;

  return (
    <section id="work" className="px-6 pb-24 sm:pb-32">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHead
            index="01"
            label="Work"
            title={
              <>
                Boards, <em>start to finish</em>
              </>
            }
            lede="A closer look at two recent boards — each taken from a blank schematic to assembled hardware."
          />
        </Reveal>

        <div className="mt-12 sm:mt-14 space-y-10 sm:space-y-14">
          {/* ── PCB 1 ─────────────────────────────────────────────────── */}
          <Reveal>
            <article id="pcb-1" className="card card-static edge-glow min-w-0">
              <div className="px-5 sm:px-9 pt-7 sm:pt-9 pb-6">
                <BoardHeader board={pcb1} index="01" />
              </div>
              <div className="px-3 sm:px-9 pb-6 sm:pb-9">
                <Tabs
                  label={`${pcb1.id} views`}
                  items={[
                    {
                      key: "photos",
                      label: "Photos",
                      icon: "eye",
                      content: pcb1.photos?.[1] ? <FlipPhoto front={pcb1.photos[0]} back={pcb1.photos[1]} /> : null,
                    },
                    {
                      key: "3d",
                      label: "3D model",
                      icon: "cube",
                      content: pcb1.model ? (
                        <Board3D
                          src={pcb1.model}
                          poster={pcb1.images?.[0]?.src}
                          label={`${pcb1.name} — rotatable 3D model`}
                          showLabel={false}
                        />
                      ) : null,
                    },
                    {
                      key: "layout",
                      label: "Layout & nets",
                      icon: "board",
                      content: (
                        <LayoutExplorer accent={pcb1.accent} name={pcb1.name} idBase="pcb-1" />
                      ),
                    },
                    {
                      key: "renders",
                      label: "Renders",
                      icon: "spark",
                      content: (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {(pcb1.images ?? []).map((im, i) => (
                            <Figure key={im.src} im={im} wide={i === 0} />
                          ))}
                        </div>
                      ),
                    },
                    {
                      key: "stack",
                      label: "Stack-up",
                      icon: "layers",
                      content: (
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 md:gap-10">
                          <Stackup layers={STACK_4L} showLabel={false} />
                          <ul className="m-0 p-0 list-none space-y-5 self-center">
                            {PCB1_NOTES.map((n) => (
                              <li key={n.title} className="flex gap-3.5">
                                <span className="mt-0.5" style={{ color: "var(--accent)" }}>
                                  <Icon name="check" size={17} />
                                </span>
                                <span>
                                  <span className="block text-[14px] font-medium" style={{ color: "var(--text)" }}>
                                    {n.title}
                                  </span>
                                  <span className="block mt-1 text-[13px] leading-6" style={{ color: "var(--text-2)" }}>
                                    {n.body}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    },
                    {
                      key: "files",
                      label: "Files",
                      icon: "folder",
                      content: <RepoFiles />,
                    },
                  ]}
                />
              </div>
            </article>
          </Reveal>

          {/* ── PCB 2 ─────────────────────────────────────────────────── */}
          <Reveal>
            <article id="pcb-2" className="card card-static edge-glow min-w-0">
              <div className="px-5 sm:px-9 pt-7 sm:pt-9 pb-6">
                <BoardHeader board={pcb2} index="02" />
              </div>
              <div className="px-3 sm:px-9 pb-2">
                <Tabs
                  label={`${pcb2.id} views`}
                  /* the architecture drawing scrolls sideways on a phone;
                     the domain map fits one */
                  mobileFirst="domains"
                  items={[
                    {
                      key: "arch",
                      label: "Architecture",
                      icon: "flag",
                      content: <ArchitectureDiagram compact />,
                    },
                    {
                      key: "domains",
                      label: "Isolation domains",
                      icon: "isolation",
                      content: (
                        <div>
                          <DomainMap id="dmap-home" />
                          <DomainLegend />
                        </div>
                      ),
                    },
                    {
                      key: "power",
                      label: "Power tree",
                      icon: "bolt",
                      content: (
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-8 lg:gap-10">
                          <PowerTree />
                          <div className="space-y-8 lg:pt-1">
                            <InputBudget />
                            <ServiceBudget />
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: "stack",
                      label: "Stack-up",
                      icon: "layers",
                      content: (
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 md:gap-10">
                          <Stackup layers={STACK_PCB2} showLabel={false} total="1.6 mm FR-4 · 1 oz" />
                          <div className="self-center">
                            <span className="eyebrow">Design rules</span>
                            <dl
                              className="mt-3 m-0 grid grid-cols-2 gap-px rounded-xl overflow-hidden"
                              style={{ background: "var(--border-soft)", border: "1px solid var(--border-soft)" }}
                            >
                              {DESIGN_RULES.map((r) => (
                                <div key={r.label} className="px-4 py-3" style={{ background: "var(--surface)" }}>
                                  <dt className="text-[11.5px]" style={{ color: "var(--text-3)" }}>
                                    {r.label}
                                  </dt>
                                  <dd className="m-0 mt-1 mono text-[13px]" style={{ color: "var(--text)" }}>
                                    {r.value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>

              {/* ── the I/O, at a glance ───────────────────────────────── */}
              <div className="px-5 sm:px-9 pt-8 pb-8 sm:pb-9">
                <span className="eyebrow">I/O at a glance</span>
                <ul
                  className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px m-0 p-0 list-none rounded-xl overflow-hidden"
                  style={{ background: "var(--border-soft)", border: "1px solid var(--border-soft)" }}
                >
                  {PCB2_IO.map((io) => (
                    <li key={io.name} className="px-4 py-4 flex gap-3.5" style={{ background: "var(--surface)" }}>
                      <span
                        className="display text-[1.55rem] leading-none tabular-nums w-9 shrink-0"
                        style={{ color: DOMAIN_COLOR[io.domain] }}
                      >
                        {io.count}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-medium" style={{ color: "var(--text)" }}>
                          {io.name}
                        </span>
                        <span className="block mt-0.5 text-[12px] leading-5" style={{ color: "var(--text-3)" }}>
                          {io.part}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link href={PCB2_SLUG} className="btn btn-primary">
                    The full case study
                    <Icon name="arrowRight" size={16} className="nudge" />
                  </Link>
                  <span className="text-[13px]" style={{ color: "var(--text-3)" }}>
                    The I/O, the architecture and the protection, on one page.
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
