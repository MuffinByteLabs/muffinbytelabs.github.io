import ExplodeStage from "./ExplodeStage";
import { MML01 } from "./layoutMML01";
import { PLATES, PLATE_PAD, plateUrl } from "./layerPlates";

/* ════════════════════════════════════════════════════════════════════════
   PCB 1, exploded into the seven files its fab received.

   Every plate is real geometry out of the board file — the routed copper,
   the vias, the pads, the plane cut-outs — split the way a Gerber viewer
   splits it. The plates are SVG files (see layerPlates.ts) laid in a CSS 3D
   scene; scrolling through the section pulls them apart, hovering one lifts
   it. No WebGL, and the only JavaScript is the switch in ExplodeStage.
   ════════════════════════════════════════════════════════════════════════ */

/* each plate image carries a margin around the board (for the antenna that
   overhangs the top edge), so it sits that far outside the plate's box */
const { w: W, h: H } = MML01;
const IMG_BOX: React.CSSProperties = {
  left: `${(-PLATE_PAD.x / W) * 100}%`,
  top: `${(-PLATE_PAD.top / H) * 100}%`,
  width: `${((W + PLATE_PAD.x * 2) / W) * 100}%`,
  height: `${((H + PLATE_PAD.top + PLATE_PAD.bottom) / H) * 100}%`,
};

export default function LayerStack() {
  return (
    <ExplodeStage
      className="lstack"
      label="PCB 1 drawn as an exploded stack of its fabrication layers: drill, bottom copper, two inner ground planes, top copper, solder mask and silkscreen, each labelled with its Gerber file"
    >
      <div className="lscene" aria-hidden>
        {PLATES.map((p, i) => (
          <div key={p.key} className="lplate" style={{ "--i": i } as React.CSSProperties}>
            <div className="lplate-in">
              {/* a plain <img>: an SVG drawing, already the right size — the
                  image optimiser has nothing to add */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={plateUrl(p.key)} alt="" loading="lazy" decoding="async" draggable={false} style={IMG_BOX} />
              <span className="llabel">
                {p.name}
                <b>.{p.file}</b>
              </span>
            </div>
          </div>
        ))}
      </div>
    </ExplodeStage>
  );
}
