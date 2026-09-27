# Darshan Borse — Home of Investments

Personal site for Darshan Borse, financial advisor (AMFI-registered mutual fund
distributor, ARN-283719), for Indian families in India and abroad. Built
mobile-first: most visitors arrive from a WhatsApp link on a phone.

The site is a letterhead. Every page is paper, ink, a muted blue italic voice
and gold pen-marks; the home page tells one story and ends on the visitor's
own name; the About page is the letter.

## Stack

- TanStack Start (React 19, file-based routing), pre-rendered to static HTML
  at build time. There is no server at runtime: the deployable is
  `dist/client`, hosted on Cloudflare Pages (free, with the domain).
- Plain CSS on custom properties (`src/styles.css`). No utility framework.
- Self-hosted variable fonts (`public/fonts`): Manrope (display), DM Sans
  (body), Newsreader (the serif italic voice).
- No analytics, no cookies, no third-party requests.

## Run

```sh
npm i
npm run dev        # http://localhost:8080
npm run check      # typecheck + lint
npm run build      # writes robots/sitemap, then pre-renders to dist/client
npm run preview    # serves dist/client the way Cloudflare Pages will, at :8788
npm run brand      # rebuilds the icons, manifest and share image from brand/
```

QA switches: `?intro=0` skips the opening sequence, `?intro=1` forces it.

## Where things live

| Path                                                | Role                                                                                                                                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/site.ts`                                   | Every fact the site states: name, title, registration, phone, address, reach, hero goals, intro words, placeholders. Edit copy facts here, nowhere else.                             |
| `src/routes/index.tsx`                              | The home page: hero, recognition slips, the plan stage, the conversation, the ending.                                                                                                |
| `src/routes/about.tsx`                              | The letter: opening, four paragraphs, the record, the office, hello.                                                                                                                 |
| `src/routes/__root.tsx`                             | Head (metadata, preloads, canonical), the 404 and error pages, the intro decision script.                                                                                            |
| `src/components/SiteChrome.tsx`                     | The fixed letterhead (name, About/Home, Contact, WhatsApp pill), the footer, scroll state.                                                                                           |
| `src/components/Intro.tsx`                          | The opening sequence and the curtain. CSS-timed from first paint; JS only skips and unmounts.                                                                                        |
| `src/components/PageWipe.tsx`                       | Page transitions (sheet rises, route changes, curtains part) and `WipeLink`.                                                                                                         |
| `src/components/HeroGoal.tsx`                       | The rotating goal word in the hero.                                                                                                                                                  |
| `src/components/PlanSheet.tsx`                      | The written one-page plan on its pile of sheets.                                                                                                                                     |
| `src/components/LastPage.tsx`                       | The ending: "A plan for you." and the pre-written WhatsApp message.                                                                                                                  |
| `src/components/Reveal.tsx`, `RollText.tsx`         | Scroll reveals and per-word masks.                                                                                                                                                   |
| `src/components/ResponsiveImage.tsx`                | AVIF/WebP/fallback `<picture>` from the variants in `src/assets`.                                                                                                                    |
| `src/components/Cursor.tsx`                         | Pointer-only custom cursor (inverts over ink).                                                                                                                                       |
| `src/routes/404.tsx`, `src/components/NotFound.tsx` | The 404 page, also pre-rendered to `404.html` so the host serves it with a real 404.                                                                                                 |
| `src/lib/seo.ts`                                    | Search: each page's title and description, the shared head entries, and the structured-data graph (practice, person, site, page, breadcrumb), all from `site.ts`. See `docs/SEO.md`. |
| `scripts/seo.mjs`                                   | Pre-build: robots.txt, and sitemap.xml once `siteUrl` is set.                                                                                                                        |
| `public/_headers`                                   | Security headers for every file, long cache for assets and fonts.                                                                                                                    |
| `brand/`                                            | The identity: mark, wordmark and lockup SVGs, the build script that derives the favicons, app icons, manifest and share image from them, and `index.html`, a sheet showing it all.   |

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

## Browsers

The floor is Safari 14 / iOS 14, Chrome 87, Firefox 78 and Edge 88, set once
as `TARGETS` in `vite.config.ts`: iPhones that never updated are the reason.
Three rules keep the site whole there:

- Every modern value follows a value those engines understand, in the same
  rule: `min-height: 100vh` before `100svh`, `overflow-x: hidden` before
  `clip`, a hex colour before `color-mix()`.
- A custom property never carries a modern unit on its own (a variable cannot
  be fallen back by repetition; every declaration that uses it would fail
  instead). The base value uses the old unit and the modern one sits in
  `@supports (height: 1svh) { … }`.
- Selectors an old engine cannot parse (`:focus-visible`) get their own rule,
  because an unknown pseudo-class drops the whole selector list.

The scroll choreography (the hero's drift, the slips gathering into the plan,
the thread, the ink's overlap) is written twice and must stay in step: as
native scroll-driven animations in the stylesheet, and as the same timelines
run by hand in `src/lib/scroll-motion.ts`. The head script decides before
first paint and sets `data-motion` on `<html>`: `native` where the engine has
scroll-driven animations and paints them right, `js` for engines without them
and for every WebKit browser (Safari 26 paints anything with a scroll-driven
animation above the rest of the page), `none` for the still version.
`?motion=native|js|none` previews any of them; the end-to-end suite audits the
`js` and `none` pages. `data-engine="webkit"` lets the stylesheet give the
paper sections their own layers, since WebKit otherwise paints them late over
the pinned hero. Revisit both WebKit rules when a Safari release fixes them.

`npm run build` ends with `scripts/check-css.mjs`, which reads the built
stylesheet and fails the build if any of that has been lost. CSS goes through
PostCSS and the esbuild minifier: Lightning CSS was dropping the fallbacks.
Two one-line polyfills (`Object.hasOwn`, `Array.prototype.at`) sit in the head
script for Safari before 15.4.

## Conventions worth keeping

- Colours in sRGB hex. Any `color-mix()` declaration is preceded by a plain
  fallback. Any `svh` is preceded by `vh`.
- Reveal blocks are hidden only under `:root[data-hydrated]`, so the page
  reads fully if JavaScript never runs.
- Entrance animations on the letterhead fill _backwards_, never forwards, or
  Safari can never hide them again.
- Nothing scrolls sideways: `html { overflow-x: clip }` plus clipping on the
  intro and the pinned stage.
- Dhule and Pune are office addresses, not a service area.

## Quality

```sh
npm run verify     # typecheck, lint, unit tests, production build
npm run test:e2e   # end-to-end + accessibility (Playwright, axe) against the dev server
```

CI (`.github/workflows/ci.yml`) runs the same on every push, plus Lighthouse
budgets (`lighthouserc.json`). Design rationale, the accessibility statement
and the contribution rules live in `docs/` and `CONTRIBUTING.md`; releases in
`CHANGELOG.md`.

## Before launch

1. `siteUrl` in `src/lib/site.ts` is the live origin (no trailing slash); it
   drives the sitemap, canonical tags and absolute share addresses. The domain
   (homeofinvestments.com, registered at GoDaddy) uses Cloudflare nameservers
   and is attached to the Pages project as a custom domain, with www alongside
   it. A Cloudflare Redirect Rule (dashboard: Rules, "Redirect from WWW to
   root") sends www to the bare domain; the Pages `_redirects` file cannot
   redirect across hostnames.
2. If the identity changes, edit `brand/` and run `npm run brand`; it rewrites
   the favicons, app icons, manifest and share image in `public/`.
3. Confirm the values marked `PLACEHOLDER_` in `src/lib/site.ts`, and the
   IRDAI licence number.
4. `npm run build`, then `npm run deploy` (Cloudflare Pages; the first run
   asks you to log in and creates the project).

© Darshan Borse. All rights reserved. Site by Shahaban Mallick.
