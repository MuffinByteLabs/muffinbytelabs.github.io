import fs from "fs";
import path from "path";
import Reveal from "./Reveal";
import LayerStack from "./LayerStack";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import { DELIVERABLES, DELIVERABLE_ROOT, DELIVERABLE_ZIP } from "./pcbData";

/* ════════════════════════════════════════════════════════════════════════
   Deliverables — what arrives at the end of every job, and how it is laid
   out. One folder, numbered in the order it gets used, the same shape on
   every project; beside it, PCB 1's fabrication files pulled apart in 3D.

   The tree is PCB 1's real package, and the zip is offered right under it.
   Its size and file count are read off the zip at build time, so the label
   can never go stale.

   Server-rendered; the layer stack's only JavaScript is its explode switch.
   ════════════════════════════════════════════════════════════════════════ */

/** size and file count of the published zip, from its end-of-directory record */
function zipFacts() {
  const file = path.join(process.cwd(), "public", DELIVERABLE_ZIP);
  if (!fs.existsSync(file)) return null;
  const buf = fs.readFileSync(file);
  return {
    mb: (buf.length / 1048576).toFixed(1),
    files: buf.readUInt16LE(buf.length - 22 + 10),
  };
}

export default function Deliverables() {
  const zip = zipFacts();
  return (
    <section id="deliverables" className="px-6 pb-24 sm:pb-32">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHead
            index="02"
            label="Deliverables"
            title={
              <>
                One organized package, <em>every time</em>
              </>
            }
            lede="Every job ends in the same versioned folder — so your fab, your assembler and your next engineer can each pick it up without a phone call. This one is PCB 1's, exactly as delivered."
          />
        </Reveal>

        <Reveal>
          <div className="card card-static edge-glow mt-10 sm:mt-12 overflow-hidden grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* ── the fabrication layers, exploded ─────────────────────── */}
            <figure className="m-0 relative px-4 sm:px-6 pt-6 pb-5" style={{ background: "var(--bg-alt)" }}>
              <LayerStack />
              <figcaption className="text-[12px] leading-5 max-w-[46ch]" style={{ color: "var(--text-3)" }}>
                <span className="mono" style={{ color: "var(--accent)" }}>03_fabrication/</span>, pulled apart:
                PCB 1&rsquo;s real copper, one file per layer. Hover a layer to lift it.
              </figcaption>
            </figure>

            {/* ── the folder ──────────────────────────────────────────── */}
            <div
              className="px-5 sm:px-8 py-7 sm:py-8 border-t lg:border-t-0 lg:border-l flex flex-col justify-center"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <span className="inline-flex items-center gap-2.5 font-mono text-[13.5px]" style={{ color: "var(--text)" }}>
                <span style={{ color: "var(--accent)" }}>
                  <Icon name="folder" size={18} />
                </span>
                {DELIVERABLE_ROOT}
              </span>

              <ul className="ftree mt-3 m-0 p-0 list-none">
                {DELIVERABLES.map((d) => (
                  <li key={d.name} className="ftree-row">
                    <span className="flex items-center gap-2 min-w-0">
                      <span style={{ color: d.hi ? "var(--accent)" : "var(--text-3)" }}>
                        <Icon name={d.kind === "dir" ? "folder" : "file"} size={15} />
                      </span>
                      <span
                        className="font-mono text-[12.5px] whitespace-nowrap"
                        style={{ color: d.hi ? "var(--accent-bright)" : "var(--text)" }}
                      >
                        {d.name}
                      </span>
                    </span>
                    <span className="text-[12.5px] leading-5" style={{ color: "var(--text-3)" }}>
                      {d.note}
                    </span>
                  </li>
                ))}
              </ul>

              {zip && (
                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a href={DELIVERABLE_ZIP} download className="btn btn-ghost btn-sm">
                    <Icon name="download" size={15} />
                    Download this package
                  </a>
                  <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>
                    ZIP &middot; {zip.mb} MB &middot; {zip.files} files
                  </span>
                </div>
              )}
              <p className="mt-4 mb-0 text-[13px] leading-6" style={{ color: "var(--text-2)" }}>
                Yours in your EDA tool&rsquo;s native format.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
