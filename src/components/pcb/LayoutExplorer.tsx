"use client";

import { useId, useState } from "react";
import { BoardArt, type LayerKey } from "./BoardSVG";
import { MML01 } from "./layoutMML01";

const LAYER_LABEL: Record<LayerKey, string> = {
  all: "All",
  silk: "Silk",
  copper: "Copper",
  plane: "Ground",
  mask: "Mask",
  drill: "Drill",
};

/* ════════════════════════════════════════════════════════════════════════
   The 2D board viewer: the real layout, drawn from the KiCad board file,
   with a layer switch and a net tracer. Lifted out of the old board card
   unchanged in behaviour, so it can live inside a tab.

   It imports PCB 1's layout itself rather than taking it as a prop: a prop
   handed from a server component to a client one is serialised into the
   page, and this one is ~50 KB of coordinates. Imported here, it ships once
   in a cacheable script instead.
   ════════════════════════════════════════════════════════════════════════ */
const layout = MML01;

export default function LayoutExplorer({
  accent,
  name,
  idBase,
}: {
  accent: string;
  name: string;
  /** namespaces the SVG ids — a raw space would break every url(#...) */
  idBase: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [layer, setLayer] = useState<LayerKey>("all");
  const [net, setNet] = useState<string | null>(null);
  const litNet = layout.nets?.find((n) => n.key === net) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-6 lg:gap-8 min-w-0">
      <div className="min-w-0">
        <Control
          label="Layer"
          labelId={`${uid}-layer`}
          options={layout.layers.map((l) => ({ key: l, label: LAYER_LABEL[l] }))}
          value={layer}
          onChange={(k) => setLayer(k as LayerKey)}
        />
        <div
          className="mt-4 rounded-xl p-3 sm:p-5"
          style={{ background: "var(--bg-alt)", border: "1px solid var(--border-soft)" }}
        >
          <BoardArt
            layout={layout}
            layer={layer}
            powered
            accent={accent}
            net={net}
            idns={`${idBase}-${uid}`}
            label={`${name} — ${layout.w} by ${layout.h} millimetre board layout`}
          />
        </div>
      </div>

      <div className="min-w-0">
        <Control
          label="Trace a net"
          labelId={`${uid}-net`}
          options={(layout.nets ?? []).map((n) => ({ key: n.key, label: n.label, dot: n.color }))}
          value={net ?? ""}
          onChange={(k) => setNet((v) => (v === k ? null : k))}
        />
        {/* aria-live: pressing a net button swaps this text — without it
            the interaction is silent for a screen-reader user */}
        <div
          className="mt-4 rounded-xl p-4 sm:p-5 min-h-[120px]"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          aria-live="polite"
        >
          {litNet ? (
            <>
              <span className="inline-flex items-center gap-2 text-[12px] font-medium" style={{ color: "var(--text)" }}>
                <span aria-hidden className="w-2 h-2 rounded-full" style={{ background: litNet.color }} />
                {litNet.label}
              </span>
              <p className="mt-2 mb-0 text-[13px] leading-6" style={{ color: "var(--text-2)" }}>
                {litNet.note}
              </p>
            </>
          ) : (
            <p className="m-0 text-[13px] leading-6" style={{ color: "var(--text-3)" }}>
              Pick a net to light it through the copper. The geometry is the real board, drawn
              from its board file — the widths, the vias and the keep-outs are the ones that were
              sent to the fab.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Control({
  label,
  labelId,
  options,
  value,
  onChange,
}: {
  label: string;
  /** ties the eyebrow to the button group, so a screen reader announces
      "Layer, Copper, pressed" rather than a bare "Copper, pressed" */
  labelId: string;
  options: { key: string; label: string; dot?: string }[];
  value: string;
  onChange: (k: string) => void;
}) {
  return (
    <div>
      <span className="eyebrow block mb-2.5" id={labelId}>
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={labelId}>
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={value === o.key}
            className="seg inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1.5"
          >
            {o.dot && (
              <span aria-hidden className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: o.dot }} />
            )}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
