# Contributing

## Before you push

```sh
npm run verify     # typecheck, lint, unit tests, production build
npm run test:e2e   # end-to-end and accessibility checks (needs Chrome)
```

CI runs the same, plus Lighthouse budgets.

## Commits

Conventional Commits, one change per commit:

- `feat:` something a visitor can see or do
- `fix:` a defect, with the symptom in the body
- `perf:` measurably faster or lighter
- `refactor:` no behaviour change
- `docs:`, `test:`, `chore:`, `ci:`

Subject in the imperative, under 72 characters. If a change alters how the
page looks on a phone, say so in the body.

## Where changes go

- Copy and facts: `src/lib/site.ts` only.
- Styles: the file for that concern under `src/styles/`; keep the import
  order in `src/styles.css`.
- A new section: its markup in the route, its styles in one new file, its
  desktop composition in `breakpoints.css`, its reduced-motion equivalent in
  `reduced-motion.css`.

## Rules the tests enforce

- No console errors, failed requests, broken images or horizontal overflow on
  any page at any scroll position.
- No serious or critical accessibility violations.
- Hero goals fit one line on a 360 px phone.
- The site config keeps one phone number, one origin, one registration.
