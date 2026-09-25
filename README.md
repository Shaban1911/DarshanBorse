# Darshan Borse — Home of Investments

Personal site for Darshan Borse, financial advisor (AMFI-registered mutual fund
distributor, ARN-283719), for Indian families in India and abroad. Built
mobile-first: most visitors arrive from a WhatsApp link on a phone.

The site is a letterhead. Every page is paper, ink, a muted blue italic voice
and gold pen-marks; the home page tells one story and ends on the visitor's
own name; the About page is the letter.

## Stack

- TanStack Start (React 19, file-based routing, SSR) on Nitro, deployed as a
  Cloudflare Worker.
- Plain CSS on custom properties (`src/styles.css`). No utility framework.
- Self-hosted variable fonts (`public/fonts`): Manrope (display), DM Sans
  (body), Newsreader (the serif italic voice).
- No analytics, no cookies, no third-party requests.

## Run

```sh
npm i
npm run dev        # http://localhost:8080
npm run check      # typecheck + lint
npm run build      # writes robots/sitemap, then builds to .output
```

Preview the production build in the Cloudflare runtime (stop it before the
next build — it locks `.output`):

```sh
cd .output && npx wrangler dev --port 8787 --compatibility-date 2026-09-01
```

QA switches: `?intro=0` skips the opening sequence, `?intro=1` forces it.

## Where things live

| Path | Role |
| --- | --- |
| `src/lib/site.ts` | Every fact the site states: name, title, registration, phone, address, reach, hero goals, intro words, placeholders. Edit copy facts here, nowhere else. |
| `src/routes/index.tsx` | The home page: hero, recognition slips, the plan stage, the conversation, the ending. |
| `src/routes/about.tsx` | The letter: opening, four paragraphs, the record, the office, hello. |
| `src/routes/__root.tsx` | Head (metadata, preloads, canonical), the 404 and error pages, the intro decision script. |
| `src/components/SiteChrome.tsx` | The fixed letterhead (name, About/Home, Contact, WhatsApp pill), the footer, scroll state. |
| `src/components/Intro.tsx` | The opening sequence and the curtain. CSS-timed from first paint; JS only skips and unmounts. |
| `src/components/PageWipe.tsx` | Page transitions (sheet rises, route changes, curtains part) and `WipeLink`. |
| `src/components/HeroGoal.tsx` | The rotating goal word in the hero. |
| `src/components/PlanSheet.tsx` | The written one-page plan on its pile of sheets. |
| `src/components/LastPage.tsx` | The ending: "A plan for you." and the pre-written WhatsApp message. |
| `src/components/Reveal.tsx`, `RollText.tsx` | Scroll reveals and per-word masks. |
| `src/components/ResponsiveImage.tsx` | AVIF/WebP/fallback `<picture>` from the variants in `src/assets`. |
| `src/components/Cursor.tsx` | Pointer-only custom cursor (inverts over ink). |
| `src/server.ts`, `src/start.ts`, `src/lib/error-*.ts` | Server entry with a friendly 500 page; CSRF middleware. |
| `scripts/seo.mjs` | Pre-build: robots.txt, and sitemap.xml once `siteUrl` is set. |
| `public/_headers` | Security and cache headers for Cloudflare. |

## Design system, in short

- Colours: paper `#f6f3ed`, ink `#061212`, the italic voice `#3c6669`, gold
  `#b09367`. Gold is for marks (full stops, underlines, dots), never for text.
- Two voices: the visitor thinks in Newsreader italic; Darshan answers in
  Manrope. DM Sans carries running text.
- Edges: paper sheets arrive on an angled cut with a shadow (`.sheet-edge`,
  alternating `.edge-left`); ink floods in as a curve (`.edge-wave`); the
  hero and the ending are covered/revealed, never cut.
- Motion is CSS: entrances are timed from first paint (`--intro-offset`),
  scroll effects use scroll/view timelines with a static fallback, and
  everything respects `prefers-reduced-motion`.
- Words are plain English. No idioms, no jargon. English is a second language
  for most readers.

## Conventions worth keeping

- Colours in sRGB hex. Any `color-mix()` declaration is preceded by a plain
  fallback. Any `svh` is preceded by `vh`.
- Reveal blocks are hidden only under `:root[data-hydrated]`, so the page
  reads fully if JavaScript never runs.
- Entrance animations on the letterhead fill *backwards*, never forwards, or
  Safari can never hide them again.
- Nothing scrolls sideways: `html { overflow-x: clip }` plus clipping on the
  intro and the pinned stage.
- Dhule and Pune are office addresses, not a service area.

## Before launch

1. Set `siteUrl` in `src/lib/site.ts` to the live origin (no trailing slash).
   This switches on the sitemap, canonical tags and absolute share addresses.
2. Replace `public/og-image.jpg` (1200×630) and `public/favicon.ico` with the
   final identity; add an Apple touch icon and a web manifest when the logo
   arrives.
3. Confirm the values marked `PLACEHOLDER_` in `src/lib/site.ts`, and the
   IRDAI licence number.
4. `npm run build`, then `npx wrangler deploy` from `.output`.
