import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import Board3D from "./Board3D";
import BoardHeader, { BoardTitle } from "./BoardHeader";
import LayoutExplorer from "./LayoutExplorer";
import RepoFiles from "./RepoFiles";
import FlipPhoto from "./FlipPhoto";
import { BOARDS, type BoardImage } from "./pcbData";
import { Stackup, STACK_4L } from "./Stackup";
import Tabs from "@/components/ui/Tabs";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import DomainMap from "@/components/pcb2/DomainMap";
import { PCB2_STATS, PCB2_SLUG } from "@/components/pcb2/data";

/* ════════════════════════════════════════════════════════════════════════
   Two boards in full — the counterpart to the client work above it.
   Client files are private; these two are Ray's own, so they can be looked
   at as closely as a visitor likes.

   PCB 1 is the deep one: a photograph of the assembled board that turns
   over, then the 3D model, the layout drawn from the board file, the
   renders, the stack-up and the public repository, behind a row of tabs.

   PCB 2 is a short card — what it is, four numbers and its zoning map —
   that hands off to its own case-study page, where the detailed drawings
   live. On the homepage those drawings were the most crowded thing on it.

   Server-rendered; only the tabs, the photo flip, the 3D viewer and the
   layout explorer ship JavaScript.
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

export default function BoardsGallery({ index }: { index?: string }) {
  const [pcb1, pcb2] = BOARDS;

  return (
    <section id="boards" className="px-6 pb-24 sm:pb-32">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHead
            index={index}
            label="In full"
            title={
              <>
                Two boards, <em>in full</em>
              </>
            }
            lede="Client files are private. These two boards are my own, so you can look as closely as you like."
          />
        </Reveal>

        <div className="mt-10 sm:mt-12 space-y-5 sm:space-y-6">
          {/* ── PCB 1 ─────────────────────────────────────────────────── */}
          <Reveal>
            <article id="pcb-1" className="card card-static edge-glow min-w-0">
              <div className="px-5 sm:px-9 pt-7 sm:pt-9 pb-6">
                <BoardHeader board={pcb1} />
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
              <div className="px-5 sm:px-9 py-7 sm:py-9 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-x-12 gap-y-8 items-center">
                <div className="min-w-0">
                  <BoardTitle board={pcb2} />

                  <ul className="mt-6 m-0 p-0 list-none grid grid-cols-2 gap-x-6 gap-y-4">
                    {PCB2_STATS.map((s) => (
                      <li key={s.label} className="min-w-0">
                        <span className="block display text-[1.6rem] leading-none" style={{ color: "var(--text)" }}>
                          {s.value}
                        </span>
                        <span className="block mt-1.5 text-[12px] leading-[1.45]" style={{ color: "var(--text-3)" }}>
                          {s.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href={PCB2_SLUG} className="btn btn-primary mt-8">
                    Read the case study
                    <Icon name="arrowRight" size={16} className="nudge" />
                  </Link>
                </div>

                <div className="min-w-0">
                  {/* the map is its own figure and draws its own panel */}
                  <DomainMap id="dmap-home" fit />
                  <p className="mt-3 mb-0 text-[12px] leading-5" style={{ color: "var(--text-3)" }}>
                    How the board is zoned: main ground, and five islands that only an isolator, an
                    isolated supply or a relay may cross.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
