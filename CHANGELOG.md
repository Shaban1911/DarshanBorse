# Changelog

All notable changes to this site. Dates are release dates.

## Unreleased

### Fixed

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
