# Accessibility

Target: WCAG 2.1 AA. Checked on every push by the end-to-end suite (axe-core,
`wcag2a` and `wcag2aa` rules, no serious or critical violations) and by
Lighthouse's accessibility category (minimum 95).

## What the site does

- **Semantics first.** One `h1` per page, headings in order, landmarks
  (`header`-equivalent letterhead, `main`, `nav`, `footer`), real links and
  buttons, a skip link to the content.
- **Motion respects preferences.** Under `prefers-reduced-motion` the opening
  sequence is skipped, every entrance and scroll effect is replaced by its
  finished state, and page transitions are instant.
- **Nothing depends on JavaScript to be readable.** Scroll-revealed content
  is visible by default and only hidden once the page has hydrated.
- **Decorative motion is hidden from assistive technology.** The rotating
  goal word, the slips on the desk, the drawn lines and the transition
  overlay are `aria-hidden`; the hero carries a full accessible name that
  lists every goal.
- **Visible focus** on every interactive element; touch targets are at least
  24 × 24 CSS pixels with clear space between.
- **Contrast**: body text on paper and on ink exceeds 7:1; the muted italic
  voice on paper exceeds 4.5:1.
- **The name field** in the ending is a labelled input; the pre-written
  message reads as a sentence to screen readers.
- **Language** is declared (`en`), text scales with the viewport, and
  nothing scrolls sideways at any width.

## Known limits

- The opening sequence is a deliberate delay of a few seconds before the hero
  is readable. It can be skipped with a tap, a key, or a scroll, and is not
  shown at all under reduced motion.
- The custom cursor is pointer-only and purely visual.
