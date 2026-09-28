# Design notes

How the site is meant to read, and why the pieces are shaped the way they are.
Read this before changing copy, colour, motion or section order.

## The one idea

The site is a letterhead, and the pages are what is written on it. Paper,
ink, a muted blue italic voice, gold pen-marks. Nothing else is allowed in.
That single constraint produces every other decision below.

## The story, in order

1. **Opening** — three beats: *your money. your goals. one plan.* Words roll in
   one character at a time behind a curtain that parts.
2. **Hero** — "A plan for your …" and a rotating goal in the visitor's own
   terms (retirement, dream home, marriage, education, bad months, whole
   life). One sentence beneath. Him on a warm disc. A faint growth line,
   with honest dips.
3. **Recognition** — "Does this sound like you?" Four slips of paper in the
   visitor's voice, first person. A thread stitches through them. The turn:
   *You're not behind. It just hasn't been put together yet.*
4. **The plan** — a pinned stage. The things a family here owns scatter as
   slips, gather into a pile, and the page grows out of it: "A plan for
   ____", four lines in his voice, six key words underlined as if by a pen,
   signed.
5. **How it starts** — ink. The two voices finally talk: a six-line exchange
   that ends on *One page, with your name on it.*
6. **The ending** — the ink lifts and he is at his desk. "A plan for you."
   The first message is pre-written in the visitor's voice with one blank for
   their name. One button. He reads every message himself.
7. **About** — the letter. Who am I trusting with this? *Someone who explains
   every line.* Four paragraphs, the record, the office, hello.

## Two voices

- The **visitor** thinks in Newsreader italic. Questions, worries, the first
  message.
- **Darshan** answers in Manrope. Headlines and every line he would say.
- DM Sans carries running text and the record.

Gold marks the moments a pen would: full stops, underlines, the dot at the
end of a drawn line. Gold is never used for text.

## Colour

| Token | Value | Role |
| --- | --- | --- |
| paper | `#f6f3ed` | ground |
| ink | `#061212` | type, and the dark sections |
| mineral | `#3c6669` | the italic voice |
| gold | `#b09367` | marks |
| card | `#fcfaf6` | a sheet of paper on the paper |

Three grounds in the whole story: paper, ink, paper. The one photograph with
its own colour is the last thing on the page.

## Edges

Every section change means something:

- paper → paper: a straight angled cut with a soft shadow (`.sheet-edge`),
  alternating direction so the page zig-zags;
- paper → ink: ink floods up as a curve (`.edge-wave`), because ink is not
  paper and should not be cut;
- the hero and the ending are covered and revealed, never cut.

## Motion rules

- One orchestrated moment per screen. Entrances roll through masks; scroll
  effects drift; nothing bounces.
- Everything is CSS, timed from first paint, so a slow phone sees the same
  choreography as a fast one, just later.
- Scroll-driven sequences use scroll and view timelines and degrade to their
  finished state where unsupported.
- `prefers-reduced-motion` gets static equivalents of everything.

## Words

Plain English, short sentences, no idioms, no jargon. English is a second
language for most readers. Every fact on the page comes from
`src/lib/site.ts`; anything unconfirmed is marked `PLACEHOLDER_`.

## Cursor and scrollbar

The cursor keeps the system arrow's shape and size and takes the letterhead's
colours: ink on paper, paper on ink, gold over anything that can be pressed.
It is a CSS image cursor (`public/cursors/`, SVG with PNG fallback), so it
tracks the pointer with no lag, costs no JavaScript, and appears only on
pointer devices. Text fields keep the system I-beam. Nothing else in the
stylesheet sets `cursor`.

The scrollbar stays. It is how a visitor knows where they are on a long
page. It is thin and in the palette where the engine allows (`scrollbar-width`,
`scrollbar-color`, with `::-webkit-scrollbar` for older Chrome and Safari),
the platform's own elsewhere, and an overlay on phones regardless. The gutter
is reserved so the page does not shift when the opening sequence locks and
releases scrolling.
