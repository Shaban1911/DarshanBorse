# Search

What the site does for search, what it cannot do on its own, and the order to
do the rest in. Ranking for "financial advisor Dhule" is decided mostly off
the site: the Google Business Profile, reviews and consistent listings. The
site's job is to be the cleanest possible answer once someone lands on it,
and to tell search engines exactly who and where Darshan is.

## On the site (done)

- One address: `https://homeofinvestments.com`, canonical on every page,
  www redirected, the Pages address kept as a fallback, HTTPS forced.
- Static HTML for every page: nothing depends on JavaScript to be read.
- Titles and descriptions per page, written for the searches people make
  ("financial advisor Dhule", "mutual fund distributor Pune", "SIP",
  "retirement planning", "NRI investment India"), kept short enough to show
  whole in results. `src/lib/seo.ts` holds them, built from `site.ts`.
- Structured data (JSON-LD) built from the same facts in `src/lib/seo.ts`:
  the practice as a `FinancialService` with address, phone, email, area
  served, the Maps place and Instagram as `sameAs`; Darshan as
  a `Person` with his credentials; the `WebSite`; each `WebPage`; a breadcrumb
  on About.
- `robots` directive allowing large image previews and full snippets; the
  404 page is `noindex`.
- `robots.txt` and `sitemap.xml` written at build time; each page's `lastmod`
  is the date of the last commit that touched it, and the sitemap carries the
  share image. The head links the sitemap, declares `en-IN` with an
  `x-default`, and offers a 192px PNG icon for the result favicon.
- The Pages addresses (`*.pages.dev`) send `X-Robots-Tag: noindex`, so only
  the domain is indexed; hashed assets are cached for a year.
- Share image 1200×630 with `og:` and `twitter:` tags on every page.
- Fonts self-hosted and preloaded, images in AVIF/WebP with sizes, security
  headers, long cache for assets. Lighthouse SEO 100, accessibility 100.
- The site is one language (English) for one market (India); no hreflang.

## Off the site (the part that ranks)

Do these in order. Each needs Darshan's own accounts.

1. **Google Business Profile.** A Maps place for "Home of Investments" in
   Deopur, Dhule already exists (the Maps link in `site.ts` points at it).
   Claim it at business.google.com, category "Financial planner" (secondary:
   "Investment service", "Insurance agency" if the IRDAI licence is shown),
   website `https://homeofinvestments.com`, phone +91 95294 35199, hours,
   photos (the portrait, the office), a description using the same words as
   the site. This single step decides the local pack for "financial advisor
   Dhule". Add a second profile for Pune only if there is a real office
   address there.
2. **Reviews.** Ask the 150+ families, a few at a time, for Google reviews
   that mention what they came for ("retirement plan", "SIP", "NRI"). Reply
   to every one.
3. **Google Search Console.** Add the domain property, verify with the DNS
   TXT record Google gives you (Cloudflare, DNS, add record), then submit
   `https://homeofinvestments.com/sitemap.xml`. Watch Pages and Core Web
   Vitals monthly. Bing Webmaster Tools can import the same property.
4. **Consistent name, address, phone everywhere.** Instagram bio, LinkedIn,
   WhatsApp Business profile, JustDial, Sulekha, IndiaMART, the AMFI ARN
   listing: the same "Home of Investments", the same address line, the same
   number, all linking to the domain. Mismatches cost local rankings.
5. **Links from real places.** The LinkedIn profile, a Dhule business
   association, the college alumni page, any press or podcast appearance:
   each link to the domain counts. No bought links, no directories that
   exist only to sell links.
6. **Content, later.** The site deliberately says little. When there is
   appetite, one page answering the questions clients actually ask (how a
   first meeting goes, what a SIP is, how NRIs invest in India) will rank for
   long searches the home page never will. Add it as a route, keep the voice,
   link it from the letterhead.

## Known trade-off

The opening sequence delays the hero by about eight seconds on a first visit.
Search engines measure Largest Contentful Paint from the field, and the hero
portrait arriving late counts against the home page. Two ways to soften it,
both design decisions rather than technical ones: play the opening only on a
visitor's first visit, or shorten it. Until then the About page carries the
better vitals, and the home page's strong text signals do the ranking work.

## Checking

- `https://search.google.com/test/rich-results` with the home and About
  addresses: the FinancialService, Person and breadcrumb should validate.
- `https://validator.schema.org` for the raw JSON-LD.
- `https://pagespeed.web.dev` for field vitals once traffic exists.
- Share the link in WhatsApp to yourself: the preview should show the share
  image with the title.
