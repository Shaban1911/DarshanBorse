# Changelog

All notable changes to this site. Dates are release dates.

## Unreleased

### Added

- Unit tests (Vitest) for the site config, word masks, the rotating goal and
  the sitemap script; end-to-end and accessibility tests (Playwright, axe).
- Continuous integration: typecheck, lint, tests, build, Lighthouse budgets.
- Design, accessibility and contribution notes under `docs/`.

### Changed

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
