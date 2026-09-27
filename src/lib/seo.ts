/**
 * What search engines and link previews are told: one title and description
 * per page, written for the searches people make, and the structured data
 * (schema.org JSON-LD) built from the same facts as the pages. Every value
 * comes from site.ts, so a changed fact changes everywhere at once.
 *
 * Titles stay under 60 characters and descriptions under 165 so results
 * show them whole (tests/unit/seo-meta.test.ts checks).
 */
import {
  address,
  arn,
  cities,
  clientFamilies,
  email,
  instagramUrl,
  irdaiLabel,
  legalName,
  mapsUrl,
  ogImage,
  phoneHref,
  practiceName,
  qualification,
  registration,
  siteUrl,
  title,
  tradeNameNote,
  yearsExperience,
} from "@/lib/site";

const where = cities.join(" and ");
const whereShort = cities.join(" & ");

export const pages = {
  home: {
    path: "/",
    title: `${legalName} — Financial Advisor in ${whereShort}`,
    description: `Financial advisor in ${where}, AMFI mutual fund distributor (${arn}). One clear plan for SIPs, retirement, insurance and tax, for Indian families and NRIs.`,
    shareTitle: `${legalName} — Financial advisor, ${whereShort}`,
    shareDescription: "Most people don't need more products. They need a plan.",
  },
  about: {
    path: "/about",
    title: `About ${legalName} — Financial Advisor, ${whereShort}`,
    description: `${legalName}: ${qualification}, ${yearsExperience}, AMFI mutual fund distributor (${arn}), IRDAI licensed. ${clientFamilies} in ${where}, across India and abroad.`,
    shareTitle: `About ${legalName}`,
    shareDescription: `${yearsExperience} of personal financial guidance for Indian families, at home and abroad.`,
  },
} as const;

export type PageKey = keyof typeof pages;

/** The head entries every indexable page shares, from its own title and description. */
export function pageMeta(key: PageKey, type: "website" | "profile" = "website") {
  const page = pages[key];
  return [
    { title: page.title },
    { name: "description", content: page.description },
    { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
    { property: "og:type", content: type },
    { property: "og:title", content: page.shareTitle },
    { property: "og:description", content: page.shareDescription },
    { property: "og:image", content: ogImage },
    { name: "twitter:title", content: page.shareTitle },
    { name: "twitter:description", content: page.shareDescription },
  ];
}

const ids = {
  practice: `${siteUrl}/#practice`,
  person: `${siteUrl}/#darshan`,
  website: `${siteUrl}/#website`,
};

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: `${address.street}, ${address.locality}`,
  addressLocality: address.city,
  addressRegion: address.state,
  postalCode: address.postalCode,
  addressCountry: address.country,
};

const knowsAbout = [
  "Mutual funds",
  "SIP (systematic investment plans)",
  "Retirement planning",
  "Goal-based financial planning",
  "Life and health insurance",
  "Tax planning",
  "NRI investment in India",
];

/** The practice: a financial service with a place, a phone and a founder. */
const practice = {
  "@type": ["FinancialService", "LocalBusiness"],
  "@id": ids.practice,
  name: practiceName,
  alternateName: legalName,
  description: `${title} and ${registration} (${arn}), ${irdaiLabel}. Goal-based financial planning for Indian families anywhere in the world, including NRIs with wealth in India. Offices in ${where}.`,
  disambiguatingDescription: tradeNameNote,
  url: siteUrl,
  logo: `${siteUrl}/icon-512.png`,
  image: ogImage,
  telephone: phoneHref,
  email,
  address: postalAddress,
  hasMap: mapsUrl,
  areaServed: [
    { "@type": "City", name: "Dhule" },
    { "@type": "City", name: "Pune" },
    { "@type": "State", name: "Maharashtra" },
    { "@type": "Country", name: "India" },
  ],
  knowsAbout,
  founder: { "@id": ids.person },
  employee: { "@id": ids.person },
  sameAs: [instagramUrl, mapsUrl],
};

/** Darshan himself, with the credentials the pages state. */
const person = {
  "@type": "Person",
  "@id": ids.person,
  name: legalName,
  jobTitle: title,
  description: `${title}, ${registration} (${arn}), ${irdaiLabel}. ${qualification}. ${yearsExperience} helping Indian families, at home and abroad, turn scattered investments into one plan.`,
  url: `${siteUrl}/about`,
  image: ogImage,
  worksFor: { "@id": ids.practice },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: qualification,
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "registration",
      name: `${registration}, ${arn}`,
      recognizedBy: { "@type": "Organization", name: "Association of Mutual Funds in India" },
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "licence",
      name: "IRDAI licensed insurance advisor",
      recognizedBy: {
        "@type": "Organization",
        name: "Insurance Regulatory and Development Authority of India",
      },
    },
  ],
  knowsAbout,
  knowsLanguage: ["mr", "hi", "en"],
  address: {
    "@type": "PostalAddress",
    addressLocality: address.city,
    addressRegion: address.state,
    addressCountry: address.country,
  },
  sameAs: [instagramUrl],
};

const website = {
  "@type": "WebSite",
  "@id": ids.website,
  name: practiceName,
  alternateName: legalName,
  url: siteUrl,
  inLanguage: "en-IN",
  publisher: { "@id": ids.practice },
};

function webPage(key: PageKey, extra: Record<string, unknown> = {}) {
  const page = pages[key];
  return {
    "@type": "WebPage",
    "@id": `${siteUrl}${page.path}#webpage`,
    url: `${siteUrl}${page.path}`,
    name: page.title,
    description: page.description,
    inLanguage: "en-IN",
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.practice },
    primaryImageOfPage: { "@type": "ImageObject", url: ogImage, width: 1200, height: 630 },
    ...extra,
  };
}

/** The whole graph for one page, as the JSON-LD script's text. */
export function structuredData(key: PageKey): string {
  const graph: unknown[] = [practice, person, website];
  if (key === "home") {
    graph.push(webPage("home"));
  } else {
    graph.push(
      webPage("about", { "@type": ["WebPage", "ProfilePage"], mainEntity: { "@id": ids.person } }),
    );
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
      ],
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}
