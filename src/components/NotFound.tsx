import { WipeLink } from "@/components/PageWipe";

/**
 * 404, in the site's own words: the plan doesn't have this page. Paper, the
 * letterhead, one sentence in each voice, and the way back. No "404" set in
 * giant type; the number is a system's word, not his.
 *
 * Rendered for unknown routes at runtime and, at build time, to 404.html
 * through the /404 route so static hosts serve it with a real 404 status.
 * That static copy carries a tiny script that moves the address to /404
 * before hydration, so the page hydrates exactly as it was rendered.
 */
export function NotFound({ moveAddress = false }: { moveAddress?: boolean }) {
  return (
    <section className="lost paper">
      {moveAddress ? (
        <script
          dangerouslySetInnerHTML={{
            __html: "if(location.pathname!=='/404'){history.replaceState(null,'','/404')}",
          }}
        />
      ) : null}
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
      </svg>
      <div className="lost-copy">
        <p className="lost-you">I was looking for something.</p>
        <h1>It isn't in the plan.</h1>
        <p className="lost-him">
          This page may have moved, or it never existed. The plan is still one page, and it starts
          at the beginning.
        </p>
        <WipeLink to="/" className="lost-back">
          Back to the first page
        </WipeLink>
      </div>
    </section>
  );
}
