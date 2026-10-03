/* ════════════════════════════════════════════════════════════════════════
   Stackup — the layers of the board, as a table rather than a picture.

   The earlier version drew a to-scale cross-section with labels floating
   beside it, so thin layers got illegible slivers of space and the text
   collided. A stackup is really a table, which is how every fab presents
   one: aligned rows, a swatch for the material, and the thickness written
   down instead of implied by three pixels of height.
   ════════════════════════════════════════════════════════════════════════ */

export type StackLayer = {
  name: string;
  role: string;
  /** finished thickness, written out — omitted where it is not stated */
  thickness?: string;
  kind: "copper" | "core" | "prepreg" | "mask";
};

const SWATCH: Record<StackLayer["kind"], string> = {
  copper: "linear-gradient(90deg, #8a5c2c, #d09a58 55%, #8a5c2c)",
  mask: "linear-gradient(90deg, #123a20, #1c522e)",
  core: "#4a4238",
  prepreg: "#3a342c",
};

const BAR_HEIGHT: Record<StackLayer["kind"], number> = {
  copper: 8,
  mask: 5,
  core: 13,
  prepreg: 10,
};

export function Stackup({
  layers,
  note,
  total = "1.6 mm FR-4",
  showLabel = true,
}: {
  layers: StackLayer[];
  note?: string;
  /** the finished board, written in the header row */
  total?: string;
  showLabel?: boolean;
}) {
  const copper = layers.filter((l) => l.kind === "copper").length;

  return (
    <div className="min-w-0">
      {showLabel && <span className="eyebrow block mb-2.5">Stackup</span>}

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-baseline justify-between gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-2)" }}
        >
          <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
            {copper}-layer
          </span>
          <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>
            {total}
          </span>
        </div>

        <ul className="m-0 p-0 list-none">
          {layers.map((l, i) => (
            <li
              key={`${l.name}-${i}`}
              className="grid items-center gap-3 px-4 py-2"
              style={{
                gridTemplateColumns: "14px minmax(0,1fr) auto",
                borderTop: i === 0 ? "none" : "1px solid var(--border-soft)",
              }}
            >
              <span
                aria-hidden
                className="rounded-sm"
                style={{
                  background: SWATCH[l.kind],
                  height: BAR_HEIGHT[l.kind],
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              />
              <span className="min-w-0">
                <span
                  className="block text-[12.5px] leading-5 truncate"
                  style={{
                    color: l.kind === "copper" ? "var(--text)" : "var(--text-2)",
                    fontWeight: l.kind === "copper" ? 500 : 400,
                  }}
                >
                  {l.name}
                </span>
                <span
                  className="block text-[11.5px] leading-4"
                  style={{ color: "var(--text-3)" }}
                >
                  {l.role}
                </span>
              </span>
              <span
                className="mono text-[11px] tabular-nums whitespace-nowrap"
                style={{ color: "var(--text-3)" }}
              >
                {l.thickness ?? ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {note && (
        <p className="mt-3 text-[12px] leading-5" style={{ color: "var(--text-3)" }}>
          {note}
        </p>
      )}
    </div>
  );
}

/** PCB 1 — 4-layer on the fab's 7628 stackup, both inner layers solid ground */
export const STACK_4L: StackLayer[] = [
  { name: "Top mask", role: "Soldermask", thickness: "—", kind: "mask" },
  { name: "L1 · Top", role: "Signal + pours", thickness: "1 oz", kind: "copper" },
  { name: "Prepreg", role: "7628", thickness: "0.21 mm", kind: "prepreg" },
  { name: "L2 · Inner", role: "Solid ground, no signals", thickness: "0.5 oz", kind: "copper" },
  { name: "Core", role: "FR-4", thickness: "1.06 mm", kind: "core" },
  { name: "L3 · Inner", role: "Solid ground, no signals", thickness: "0.5 oz", kind: "copper" },
  { name: "Prepreg", role: "7628", thickness: "0.21 mm", kind: "prepreg" },
  { name: "L4 · Bottom", role: "Signal + pours", thickness: "1 oz", kind: "copper" },
  { name: "Bottom mask", role: "Soldermask + ID block", thickness: "—", kind: "mask" },
];

/** PCB 2 — STM32 Industrial I/O Controller. Ground on L2, power regions on
    L3, and the isolation keep-outs cut through all four. Dielectric
    thicknesses come from the fab's stack-up, so they are not restated here. */
export const STACK_PCB2: StackLayer[] = [
  { name: "Top mask", role: "Soldermask", kind: "mask" },
  { name: "L1 · Top", role: "Parts and critical signals · USB referenced to L2", thickness: "1 oz", kind: "copper" },
  { name: "Prepreg", role: "FR-4", kind: "prepreg" },
  { name: "L2 · Inner", role: "Continuous main ground · barrier keep-outs only", thickness: "1 oz", kind: "copper" },
  { name: "Core", role: "FR-4", kind: "core" },
  { name: "L3 · Inner", role: "Power regions · slow routing · isolated islands", thickness: "1 oz", kind: "copper" },
  { name: "Prepreg", role: "FR-4", kind: "prepreg" },
  { name: "L4 · Bottom", role: "Secondary parts · slow signals · stitched ground", thickness: "1 oz", kind: "copper" },
  { name: "Bottom mask", role: "Soldermask + ID block", kind: "mask" },
];

/** Retired with the 2-layer ESP32 field I/O design that PCB 2 replaced —
    kept, like the other retired data, so restoring it is a render change. */
export const STACK_2L: StackLayer[] = [
  { name: "Top mask", role: "Soldermask", thickness: "—", kind: "mask" },
  { name: "L1 · Top", role: "Signal + field power", thickness: "1 oz", kind: "copper" },
  { name: "Core", role: "FR-4", thickness: "1.53 mm", kind: "core" },
  { name: "L2 · Bottom", role: "Unbroken ground return", thickness: "1 oz", kind: "copper" },
  { name: "Bottom mask", role: "Soldermask + ID block", thickness: "—", kind: "mask" },
];
