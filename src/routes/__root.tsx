import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteChrome } from "../components/SiteChrome";
import { Intro } from "../components/Intro";
import { PageWipe } from "../components/PageWipe";
import { introWords } from "../lib/site";
import { ogImage, legalName, registration, arn, cities, siteUrl } from "../lib/site";
import { WipeLink } from "../components/PageWipe";

/**
 * 404, in the site's own words: the plan doesn't have this page. Paper, the
 * letterhead, one sentence in each voice, and the way back. No "404" set in
 * giant type — the number is a system's word, not his.
 */
function NotFoundComponent() {
  return (
    <section className="lost paper">
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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <section className="lost paper">
      <div className="lost-copy">
        <p className="lost-you">Something went wrong.</p>
        <h1>This page didn't load.</h1>
        <p className="lost-him">Not your fault. Try again, or go back to the first page.</p>
        <div className="lost-actions">
          <button
            type="button"
            className="btn"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <a href="/" className="lost-back">
            Back to the first page
          </a>
        </div>
      </div>
    </section>
  );
}

export const Route = createRootRouteWithContext<Record<string, never>>()({
  head: ({ match }) => ({
    meta: [
      // Absolute page address for sharing, once the domain is set.
      ...(siteUrl
        ? [
            {
              property: "og:url",
              content: `${siteUrl}${match.pathname === "/" ? "/" : match.pathname.replace(/\/$/, "")}`,
            },
          ]
        : []),
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Home of Investments" },
      {
        name: "description",
        content: `Personal financial guidance by ${legalName}, ${registration} (${arn}), ${cities.join(" & ")}.`,
      },
      { name: "author", content: legalName },
      { name: "theme-color", content: "#121a1b" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Home of Investments" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${legalName} — ${registration}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    scripts: [
      {
        children:
          // Decided BEFORE first paint so the overlay never flashes and the hero
          // entrance is offset correctly. The opening plays on every load;
          // ?intro=0 skips it (QA), ?intro=1 forces it even under reduced motion.
          // The opening belongs to the two real pages only; a wrong address gets no curtain.
          "try{var d=document.documentElement.dataset;var p=location.pathname.replace(/\\/+$/,'')||'/';if(/[?&]intro=0(&|$)/.test(location.search)||!/^\\/(about)?$/.test(p)){d.introSeen='1'}else if(/[?&]intro(=|&|$)/.test(location.search)){d.introForce='1'}else if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.introSeen='1'}}catch(e){}",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // The faces the first paint needs; DM Sans follows with the body.
      {
        rel: "preload",
        href: "/fonts/Manrope.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/Newsreader-italic.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/DMSans.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      ...(siteUrl
        ? [
            {
              rel: "canonical",
              href: `${siteUrl}${match.pathname === "/" ? "/" : match.pathname.replace(/\/$/, "")}`,
            },
          ]
        : []),
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline <head> script stamps data-intro-* flags on
    // <html> before React hydrates (see Intro.tsx). React 19 would otherwise report
    // those pre-hydration attributes as a mismatch on every load.
    <html
      lang="en"
      style={{ ["--intro-words" as string]: introWords.length }}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Intro />
      <PageWipe>
        <SiteChrome>
          <Outlet />
        </SiteChrome>
      </PageWipe>
    </>
  );
}
