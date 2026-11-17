# muffinbytelabs.com

Portfolio and bidding site for **MuffinByteLabs** — Ray Malik, freelance PCB design engineer.

Written for a client who skims for thirty seconds: hero → client work → two boards in full → deliverables → contact.

- **Client work** is five boards and circuits engineered for clients, each beside a generic drawing made for the site. See the rules below before touching it.
- **Two boards in full** are Ray's own. PCB 1 opens on a photo of the assembled board that turns over, and its Files tab links into the full public project ([MuffinByteLabs/esp32s3-plant-monitor](https://github.com/MuffinByteLabs/esp32s3-plant-monitor)) — design source, the exact package uploaded to the fab, the firmware and the design reviews. PCB 2 — the STM32 Industrial I/O Controller — is a short card that leads to its case study at `/work/stm32-industrial-io`, where its four engineering drawings sit behind tabs.
- The copy is tool-neutral: no page names an EDA tool.

## Client work

The projects in `CLIENT_WORK` (`src/components/pcb/pcbData.ts`) belong to clients and are shown with their agreement. Each card is finished work: what the board is, and what was engineered on it. The rules:

- no client or company name and no product name;
- no client images, renders, schematics or documents — the drawings in `ClientArt.tsx` are generic and were made for the site;
- every sentence is engineering Ray did on that board.

Anything more specific — a board render, a photo, a quote from the client — needs that client's say-so first.

## Rate and Upwork

The hourly rate (`HOURLY_RATE`) and the Upwork profile (`UPWORK_URL`) are declared once in `pcbData.ts`. The hero, the contact card, the footer, the services page and the structured data (`src/lib/schema.ts`) all read them from there — change them in one place.

## Search engines and AI assistants

- **Structured data**: `src/lib/schema.ts` describes the person, the practice and its hourly offer, the services, the two boards, the homepage questions (FAQPage) and the breadcrumbs of every page. Facts only, and the repeated text is read from the same data the pages render.
- **`/llms.txt` and `/llms-full.txt`**: the site as Markdown for AI assistants ([llmstxt.org](https://llmstxt.org)), generated at build time by `src/lib/llms.ts`.
- **`robots.txt`**: open to every crawler, with the AI crawlers named one by one (`src/app/robots.ts`).
- **Sitemap dates**: hand-maintained in `src/lib/pageDates.ts`, which the structured data also reads. Bump a date when that page's content changes.
- **Google Search Console**: the property `https://muffinbytelabs.com/` is verified by the `verification.google` tag in `src/app/layout.tsx`. Keep the tag, or Search Console loses the site.
- **IndexNow**: after each deploy, `scripts/indexnow.mjs` sends the sitemap's URLs to Bing and the other IndexNow engines. The key in the script must match the file `public/09d8636ab91637c33324b8bbb54b3ca1.txt`.

## Visitor analytics

Cloudflare Web Analytics counts visits and page views, with no cookies and no tracking of individual visitors. The beacon and its site token sit at the end of `<body>` in `src/app/layout.tsx`, in production builds only (so `npm run dev` never counts as a visit); the numbers are in the Cloudflare dashboard under **Analytics → Web analytics**. The footer tells visitors ("anonymous stats"), so change the two together.

## Spot the fault

The homepage's mini game: a practice board with five layout mistakes and a 60-second clock. `src/components/pcb/SpotTheFault.tsx` is the card and its Play button. The game itself (`src/components/pcb/faultGame/`) is a separate JavaScript file that downloads only when someone presses Play, starting early when the pointer reaches the button, so the homepage carries none of its weight.

- `faultGame/faults.ts`: the nine mistakes the board can carry, each with a title, an explanation and a click area. Each round switches on five of them at random.
- `faultGame/FaultBoard.tsx`: the board, drawn so every mistake area exists both right and wrong. A new mistake needs both drawings and a click area that touches no other.
- The board's copper is listed as data (`segs`, `smds`, `holes`, `vias`), so the ground pour can be cut around it automatically: everything that isn't ground is drawn into the pour's mask, fattened by the clearance. Add new copper to those lists, not as loose JSX, or the pour runs straight over it.
- On a narrow screen the board turns a quarter-turn so it fills a phone. Clicks are mapped through that turn, so click areas stay in plain board units.
- Explanations must stay accurate engineering: they are the part a client actually reads.

## Stack

- [Next.js](https://nextjs.org) static export (`output: "export"`) — no server and no cookies; the one third-party request is the Cloudflare Web Analytics beacon
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
| `src/components/pcb/pcbData.ts` | Homepage content — client work, boards (photos, renders), services, the deliverable folder, the project steps, the rate, the Upwork and repo links |
| `src/components/pcb/ClientWork.tsx`, `ClientArt.tsx` | The client-work section and its five generic drawings |
| `src/components/pcb2/data.ts` | Everything on the PCB 2 case study, each number traced to the project's own engineering documents |
| `src/components/pcb2/` | PCB 2 drawings: the traceable architecture diagram, the isolation-domain map, power tree, budgets, permission gate — grouped behind tabs by `Pcb2Drawings.tsx` |
| `src/components/pcb/` | PCB 1 viewers (3D model, layout + net tracer, stack-up, repo files), the exploded layer stack, and the homepage sections |
| `src/components/pcb/SpotTheFault.tsx`, `faultGame/` | The Spot the fault mini game: the homepage card, and the game it loads on Play |
| `src/components/ui/` | Shared primitives — `Icon`, `Tabs`, `SectionHead`, `Unbroken` (headings that never break at a hyphen) |
| `src/app/work/stm32-industrial-io/` | The PCB 2 case-study page |

## Adding to PCB 2

- **Photos** — add a `photos` array to `BOARDS[1]` in `pcbData.ts`, the same shape as PCB 1's, and show them in its card in `BoardsGallery.tsx`.
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
