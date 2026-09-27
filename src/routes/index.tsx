import { createFileRoute, Link } from "@tanstack/react-router";
import heroSmall from "../assets/darshan-cutout-400.avif?url";
import heroLarge from "../assets/darshan-cutout-812.avif?url";
import { HeroGoal } from "@/components/HeroGoal";
import { pageMeta, structuredData } from "@/lib/seo";
import { LastPage } from "@/components/LastPage";
import { PlanSheet } from "@/components/PlanSheet";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { Reveal } from "@/components/Reveal";
import { RollText } from "@/components/RollText";
import { startScrollMotion, wantsScrollMotion } from "@/lib/scroll-motion";
import { useEffect } from "react";
import {
  phoneHref,
  email,
  instagramUrl,
  mapsUrl,
  arn,
  registration,
  yearsExperience,
  legalName,
  cities,
  ogImage,
  irdaiLabel,
  tradeNameNote,
  heroGoals,
  heroSentence,
  PLACEHOLDER_firstCallLength,
  PLACEHOLDER_reviewCadence,
  PLACEHOLDER_languages,
} from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta("home"),
    links: [
      // The hero portrait is the largest paint on the page: fetch it before the parser finds it.
      {
        rel: "preload",
        as: "image",
        href: heroSmall,
        type: "image/avif",
        media: "(max-width: 767px)",
      },
      {
        rel: "preload",
        as: "image",
        href: heroLarge,
        type: "image/avif",
        media: "(min-width: 768px)",
      },
    ],
    scripts: [{ type: "application/ld+json", children: structuredData("home") }],
  }),
  component: HomePage,
});

/**
 * Situations, not categories — so the visitor recognises themselves.
 * First person, in the visitor's own voice (serif italic throughout the
 * site): "that's me" lands harder than "that's you". Each is one slip of
 * paper on a desk; they alternate left and right (see .notes in CSS) so the
 * thread has a strip to run down beside each one, and the tilt makes the
 * pile look scattered — which is the point the heading then makes.
 */
const situations = [
  {
    line: "I have some SIPs, a few mutual funds and an LIC policy. I don't know if they add up to anything.",
    tilt: "-1.6deg",
  },
  { line: "Money goes out every month. I couldn't tell you what it is for.", tilt: "1.3deg" },
  {
    line: "Someone sold me a policy years ago. I still can't explain what it does.",
    tilt: "-.9deg",
  },
  {
    line: "I earn well. I save every month. But none of it is connected to a goal.",
    tilt: "1.5deg",
  },
];

/**
 * The slips that gather: what a family here actually holds, in their own
 * words. What is scattered — not what he sells. Offsets are from the
 * centre of the desk, in a loose ring, so gathering means converging.
 */
const scattered = [
  // nine loose rows down the desk, long words kept off the edges and the
  // bottom-right corner left to the WhatsApp pill; --n is the gathering order
  { word: "SIPs", x: "-31vw", y: "-28vh", r: "-8deg", s: 1.05 },
  { word: "Mutual funds", x: "6vw", y: "-28vh", r: "4deg", s: 1 },
  { word: "FDs", x: "34vw", y: "-27vh", r: "-3deg", s: 0.95 },
  { word: "PPF", x: "-14vw", y: "-21vh", r: "6deg", s: 0.9 },
  { word: "Home loan", x: "22vw", y: "-20vh", r: "-5deg", s: 1 },
  { word: "Stocks", x: "-32vw", y: "-14vh", r: "-4deg", s: 1 },
  { word: "Gold", x: "-2vw", y: "-13vh", r: "7deg", s: 1.1 },
  { word: "NPS", x: "31vw", y: "-13vh", r: "3deg", s: 0.9 },
  { word: "RDs", x: "-20vw", y: "-7vh", r: "-6deg", s: 0.95 },
  { word: "Term insurance", x: "14vw", y: "-6vh", r: "-2deg", s: 1 },
  { word: "EPF", x: "-33vw", y: "0vh", r: "5deg", s: 0.9 },
  { word: "Bonds", x: "-8vw", y: "1vh", r: "-7deg", s: 1 },
  { word: "Car loan", x: "26vw", y: "1vh", r: "4deg", s: 0.95 },
  { word: "LIC policies", x: "-18vw", y: "8vh", r: "3deg", s: 1.05 },
  { word: "Cash in hand", x: "22vw", y: "8vh", r: "-4deg", s: 1 },
  { word: "ULIPs", x: "-34vw", y: "15vh", r: "-3deg", s: 0.95 },
  { word: "Real estate", x: "-2vw", y: "15vh", r: "5deg", s: 0.95 },
  { word: "Life insurance", x: "30vw", y: "15vh", r: "3deg", s: 1 },
  { word: "Household expenses", x: "10vw", y: "22vh", r: "-4deg", s: 1 },
  { word: "Health insurance", x: "-12vw", y: "29vh", r: "-5deg", s: 1.05 },
];

/**
 * The plan, written — the first page in Darshan's voice, reading on from the
 * title: "A plan for ____ starts with your goals…". The underlined words are
 * the six things a plan holds; goals come first because that is the whole
 * argument. Every line is something a distributor can actually promise.
 */
const planLines = [
  <>
    starts with your <b>goals</b>: what you're saving for, how much each needs, and by when.
  </>,
  <>
    Then the <b>investments</b> that serve each one, the <b>cover</b> that protects them, and the{" "}
    <b>tax</b> you'd otherwise lose.
  </>,
  <>
    What you <b>already have</b> goes in: the SIPs, the policies, the FDs, the gold. Nothing undone
    for its own sake.
  </>,
  <>
    And we <b>read it together</b> {PLACEHOLDER_reviewCadence}, so it keeps up with your life.
  </>,
];

/**
 * How it starts — as the exchange itself, not a description of one. The two
 * voices the site has used all along finally talk: the visitor in the serif
 * italic, Darshan in the grotesk. No bubbles, no names, no labels. Six lines,
 * and it ends on the page the reader has just seen.
 */
const dialogue = [
  [
    "you",
    "Hi Darshan. I've got a few SIPs, an LIC policy and some FDs, and honestly no idea if they add up to anything.",
  ],
  [
    "him",
    `They usually add up to more than people think. Let's find out: ${PLACEHOLDER_firstCallLength} on the phone, or across a table in Dhule or Pune, in ${PLACEHOLDER_languages}. Nothing to prepare.`,
  ],
  ["you", "Is there a minimum? Do I have to buy something?"],
  [
    "him",
    "There's no minimum I insist on, and nothing to buy. We talk about what you have and what you're saving for. If I'm not the right person for it, I'll say so.",
  ],
  ["you", "And then?"],
  ["him", "Then I write it down. One page, with your name on it."],
] as const;

function HomePage() {
  // the scroll choreography by hand, where the engine cannot run it natively
  useEffect(() => (wantsScrollMotion() ? startScrollMotion() : undefined), []);

  return (
    <>
      {/* ═══ hero: one sentence, one face, one action ═══
          The intro ends on "just a plan." — this answers: a plan for WHAT.
          Same character-mask mechanic, so it reads as the intro's fourth line. */}
      <section className="home-hero paper">
        {/* a growth line, drawn in — with honest dips, not a hockey stick.
            No axes, no numbers: a metaphor, never a claim. */}
        <svg
          className="hero-line"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            pathLength="1"
            vectorEffect="non-scaling-stroke"
            d="M -20 820 C 90 805 140 760 200 745 C 265 728 290 770 330 720 C 375 665 395 610 440 590 C 490 570 505 630 545 595 C 600 545 615 470 670 445 C 720 422 740 470 785 425 C 835 375 860 300 915 268 C 950 248 980 235 1020 220"
          />
          <path
            className="hero-line-now"
            vectorEffect="non-scaling-stroke"
            d="M 1000 226 l .01 0"
          />
        </svg>

        <div className="hero-copy">
          <h1
            className="hero-title"
            aria-label={`A plan for your ${heroGoals.map((g) => g.replace(/\.$/, "").toLowerCase()).join(", your ")}.`}
          >
            <span className="hero-lead" aria-hidden="true">
              <RollText className="hero-word">A plan for your</RollText>
            </span>
            <HeroGoal words={heroGoals} />
          </h1>
          <p className="hero-sentence">{heroSentence}</p>
        </div>

        {/* the person, on a warm ground — head above the disc, feet below the fold */}
        <div className="hero-disc" aria-hidden="true" />
        <figure className="hero-portrait">
          <ResponsiveImage
            name="darshan-cutout"
            alt={`${legalName}, ${registration}`}
            width={812}
            height={1289}
            sizes="(min-width: 768px) 30vw, 62vw"
            priority
          />
        </figure>

        <a className="scroll-cue" href="#familiar" aria-label="Scroll to content">
          <span>Scroll</span>
        </a>
      </section>

      {/* ═══ recognition: the visitor's desk, then the turn ═══
          Slides over the pinned hero. Four scattered slips in the visitor's
          voice; a thread draws down behind them as you scroll and ends in the
          hero's gold dot; then Darshan answers. Show, then tell. */}
      <section className="recognise sheet-edge paper" id="familiar">
        <div className="recognise-notes">
          <p className="ask">Does this sound like you?</p>
          <div className="notes-wrap">
            <ul className="notes">
              {situations.map(({ line, tilt }) => (
                <li key={line} style={{ ["--tilt" as string]: tilt }}>
                  <Reveal className="note">
                    <p>{line}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
            {/* one soft wave, drawn over the slips alone (not the question above them), so its
                crests sit in the open zone beside each slip and its crossings fall in the gaps;
                where it dips behind a slip's edge it reappears below, the way a thread does */}
            <svg
              className="thread"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                pathLength="1"
                vectorEffect="non-scaling-stroke"
                d="M 89 -4 C 89 14 11 20 11 33 C 11 46 89 50 89 61 C 89 72 11 76 11 88 C 11 94 12 98 13 101"
              />
              <path className="thread-now" vectorEffect="non-scaling-stroke" d="M 13 101 l .01 0" />
            </svg>
          </div>
        </div>
        <Reveal className="recognise-turn">
          <h2>
            <RollText>
              You're not behind.
              <br />
              It just hasn't been put together yet.
            </RollText>
          </h2>
        </Reveal>
      </section>

      {/* ═══ the plan: the scattered slips become one sheet ═══
          A pinned stage. Four small slips — the four things from the four
          situations — sit scattered as it arrives, then slide and straighten
          into one stack as you scroll; the stack becomes the sheet, and its
          contents rise in. Scroll-driven and CSS-only; without support the
          finished sheet simply sits there. */}
      <section className="gather sheet-edge edge-left paper">
        <div className="stage">
          <h2 className="gather-heading">Everything you own, on one page.</h2>
          <div className="desk">
            {scattered.map(({ word, x, y, r, s }, n) => (
              <span
                key={word}
                className="slip"
                aria-hidden="true"
                style={{
                  ["--x" as string]: x,
                  ["--y" as string]: y,
                  ["--r" as string]: r,
                  ["--s" as string]: s,
                  ["--n" as string]: n,
                }}
              >
                {word}
              </span>
            ))}
            <PlanSheet lines={planLines} />
          </div>
        </div>
        <div className="gather-space" aria-hidden="true" />
      </section>

      {/* ═══ how it starts: the two voices talk ═══
          Ink floods up over the finished page (a curve, not a cut: ink is not
          paper). Inside, the exchange unfolds line by line as you scroll. */}
      {/* the conversation and the ending share one wrapper: the ending is pinned
          to the bottom of the viewport only while this wrapper is on screen,
          beneath the ink — so the ink lifting reveals it and nothing else. */}
      <div className="reveal">
        <section className="how sheet-edge edge-wave" data-dark>
          <Reveal>
            <h2>
              <RollText>It usually starts like this.</RollText>
            </h2>
          </Reveal>
          <ol className="dialogue">
            {dialogue.map(([who, line], n) => (
              <li key={n} className={who}>
                <Reveal>
                  <p>
                    <span className="sr-only">{who === "you" ? "You: " : "Darshan: "}</span>
                    {line}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        {/* ═══ the ending: the ink lifts, and you are in his office ═══
          Pinned beneath every section; the page peels away to reveal it.
          The intro's curtains, in reverse. */}
        <section className="hello" id="contact">
          <LastPage />
        </section>
      </div>
    </>
  );
}
