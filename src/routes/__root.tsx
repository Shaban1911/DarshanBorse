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
import { NotFound } from "../components/NotFound";

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
          // Runs BEFORE first paint: the opening plays on / and /about only;
          // ?intro=0 skips it (QA), ?intro=1 forces it even under reduced motion.
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
      // Identity: the full stop on the warm disc (see brand/). SVG where supported,
      // the .ico for older engines, the PNG for iOS home screens.
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 64x64" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
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
