# Changelog

All notable changes to this site. Dates are release dates.

## Unreleased

### Fixed

- The scroll choreography now runs everywhere: where the engine has no
  scroll-driven animations, or paints them wrongly (WebKit), a small driver
  in `src/lib/scroll-motion.ts` runs the same timelines by hand and the
  stylesheet maps its progress to the same transforms. iPhones get the slips
  gathering, the sheet growing and the thread drawing exactly as Chrome does.
- Older iPhones showed a transparent band at the top of a paper section while
  scrolling over the hero: WebKit created the section's layer late. On WebKit
  the sections now have their own layers from the start.
- Safari 26 (iPhone) painted the hero's portrait and disc, the slips and the
  plan sheet above the sections and the letterhead: WebKit lifts anything with
  a scroll-driven animation over the page. The head script now marks WebKit
  `data-static` before first paint and those sections keep their still
  version, the same one older engines get; `?static=1` previews it.
- Phones that never updated (iOS 15 and earlier Safari) lost the hero and the
  plan stage: the CSS build was stripping the `vh`/`hidden` fallbacks written
  before `svh`/`clip`, and the disc size lived in a custom property holding
  `svh`. CSS now goes through PostCSS with explicit browser targets, modern
  units in custom properties sit behind feature queries, the focus ring and
  the letterhead's thinned colours have fallbacks, and `npm run build` fails
  if a fallback goes missing. Two polyfills cover `Object.hasOwn` and
  `Array.prototype.at`.

### Added

- `?debug=1` shows a small readout on any page: the motion path the head
  script chose, the engine, whether reduced motion is on, whether the scroll
  driver runs, and the viewport, for checking a device in the field.
- Search: titles and descriptions per page written for the searches people
  make, a robots directive, complete share tags, and a structured-data graph
  (the practice as a financial service with address, phone, map and area
  served; Darshan with his credentials; the site; each page; a breadcrumb on
  About), all built from `site.ts` in `src/lib/seo.ts` and covered by unit
  tests. `docs/SEO.md` lists the off-site work that decides local rankings.
- The plan stage holds twenty slips: PPF, EPF, NPS, bonds, home and car loans,
  household expenses, cash in hand, life insurance and real estate join the
  ten it had, re-scattered for phone and desktop.
- The identity: a mark made from the site's own growth line and gold full stop
  on the hero's warm disc, a wordmark in the letterhead's faces, and the
  derived favicon, SVG icon, Apple touch icon, web manifest and share image,
  all built from `brand/` by `npm run brand`.
- Unit tests (Vitest) for the site config, word masks, the rotating goal and
  the sitemap script; end-to-end and accessibility tests (Playwright, axe).
- Continuous integration: typecheck, lint, tests, build, Lighthouse budgets.
- Design, accessibility and contribution notes under `docs/`.

### Changed

- About opens with a promise instead of a stance: "Someone who explains every
  line." The lead stays in his voice: "I'm Darshan Borse … until it makes
  sense. Yours will too."
- The phone ending's photograph is cut with his face at the centre of the
  disc; the caption reads "Dhule, Pune, and anywhere on WhatsApp."
- The cursor is the system arrow's shape and size in the letterhead's
  colours, as a CSS image cursor: ink on paper, paper on ink, gold over links
  and buttons. The JavaScript dot-and-ring follower is gone.
- The scrollbar is kept, thin and in the palette where the engine allows, with
  the gutter reserved so the opening sequence no longer shifts the page.
- The site is now fully static: every page is pre-rendered to HTML at build
  time and `dist/client` is the whole deployable, hosted on Cloudflare Pages.
  The worker, Nitro and the runtime server files are gone; the 404 page is
  pre-rendered to `404.html`.
- Own Vite configuration; the Lovable build wrapper, Tailwind and the UI-kit
  layer are removed. The stylesheet is split into per-concern files.
- The opening sequence's timing lives in the stylesheet only; the page
  transition's timing lives in its component only.

### Fixed

- The ending's heading read "A plan foryou" to assistive technology.

## 2026-09-26

### Added

- Self-hosted fonts, security headers, hero image preloads, canonical and
  share addresses driven by one `siteUrl`, a pre-build robots/sitemap step.
- A 404 page in the site's own words.

### Changed

- The About page rebuilt as the letter. Page transitions between home and
  About. The letterhead shows Home when away from home.

## 2026-09-25

- First complete version of the site: opening sequence, hero, recognition,
  the plan, the conversation, the ending, footer.
