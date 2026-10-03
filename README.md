# muffinbytelabs.com

Portfolio and bidding site for **MuffinByteLabs** — Ray Malik, freelance PCB design engineer.

Written for a client who skims for thirty seconds: hero → work → deliverables → contact. PCB 1 opens on photos of the assembled board, and its Files tab links into the full public project ([MuffinByteLabs/esp32s3-plant-monitor](https://github.com/MuffinByteLabs/esp32s3-plant-monitor)) — design source, the exact package uploaded to the fab, the firmware and the design reviews. PCB 2 — the STM32 Industrial I/O Controller — has a short case study at `/work/stm32-industrial-io`. The copy is tool-neutral: no page names an EDA tool.

## Stack

- [Next.js](https://nextjs.org) static export (`output: "export"`) — no server, no third-party requests, no cookies
- Tailwind CSS v4, one design-token sheet in `src/app/globals.css`: dark only, warm graphite + ENIG gold, plus a functional domain palette (`--d-*`) that means the same thing in every diagram on the site
- Component classes (`.btn`, `.card`, `.chip`, `.tab`, …) live in a cascade layer, so a Tailwind utility on the same element always wins
- MDX for the Field Notes blog (`src/content/*.mdx`, frontmatter drives the index, RSS at `/feed.xml`). `src/content/index.ts` is generated before every `dev` / `build` run and holds one lazy import per post, so opening a post compiles only that post
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`

## Working on it

```bash
npm ci
npm run dev     # local dev server
npm run build   # static export into out/
```

## Where things live

| Path | What |
|---|---|
| `src/components/pcb/pcbData.ts` | Homepage content — boards (photos, renders), services, the deliverable folder, repo links |
| `src/components/pcb2/data.ts` | Everything on the PCB 2 case study, each number traced to the project's own engineering documents |
| `src/components/pcb2/` | PCB 2 drawings: the traceable architecture diagram, the isolation-domain map, power tree, budgets, permission gate |
| `src/components/pcb/` | PCB 1 viewers (3D model, layout + net tracer, stack-up, repo files), the exploded layer stack, and the homepage sections |
| `src/components/ui/` | Shared primitives — `Icon`, `Tabs`, `SectionHead` |
| `src/app/work/stm32-industrial-io/` | The PCB 2 case-study page |

## Adding to PCB 2

- **Photos** — add a `photos` array to `BOARDS[1]` in `pcbData.ts`, the same shape as PCB 1's, and give its card a Photos tab.
- **Repo published** — add a `repo` to `BOARDS[1]`, and the card header links straight to it.

## Scripts

| Script | Purpose |
|---|---|
| `scripts/gen-board-layout.py` | Generates the interactive 2D board art (and the exploded layer stack's geometry) from the real board file |
| `scripts/export-board-3d.sh` | Exports and compresses the rotatable 3D board model (glTF + Draco) |
| `scripts/render-og-cards.cjs` | Renders `public/og.png` and `public/og/pcb-2.png` from the built site, in its own fonts — drives local Chrome directly, nothing to install |
| `scripts/gen-og-image.cjs` | Older sharp-only fallback for `public/og.png`, drawn with system fonts |
| `scripts/gen-post-og.cjs` | Renders one share card per Field Note into `public/og/` — run after adding a post |
| `scripts/gen-post-index.cjs` | Writes `src/content/index.ts`; runs automatically before `dev` and `build` |
| `scripts/build-sample-package.cjs` | Builds `public/downloads/pcb1-plant-monitor_rev-A.zip` — PCB 1's real hand-off in the numbered folders the Deliverables section shows — from the published repo (`origin/main`). Re-run after the PCB 1 repo changes |
