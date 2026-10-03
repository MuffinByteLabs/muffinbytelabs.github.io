import { PLATES, plateSvg } from "@/components/pcb/layerPlates";

/* The exploded layer stack's plates, written out as static SVG files at
   build time (/layers/pcb1-top.svg, …) — the same pattern as feed.xml, so
   the drawings live in cacheable files instead of inside the homepage. */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return PLATES.map((p) => ({ plate: `pcb1-${p.key}.svg` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ plate: string }> }) {
  const { plate } = await params;
  const key = plate.replace(/^pcb1-/, "").replace(/\.svg$/, "");
  const svg = plateSvg(key);
  if (!svg) return new Response("Not found", { status: 404 });
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
}
