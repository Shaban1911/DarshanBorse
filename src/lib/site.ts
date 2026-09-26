/**
 * Single source of truth for business, contact, and regulatory details.
 * Everything the site states about Darshan flows from here.
 */

/** Confirmed 24 Sep 2026. Every CTA, WhatsApp deep link and tel: link derives from this. */
export const phoneDisplay = "+91 95294 35199";
export const phoneHref = "+919529435199";

export const email = "darshanborse02@gmail.com";
export const instagramUrl = "https://www.instagram.com/investwithdarshan";
export const mapsUrl = "https://maps.app.goo.gl/8u5jmJ69LBSSRtvu8";

/** Legal / regulatory — displayed in the footer on every page. */
export const legalName = "Darshan Borse";
export const practiceName = "Home of Investments";
export const arn = "ARN-283719";
/** How he describes himself on the letterhead. The registration below is the legal record. */
export const title = "Financial advisor";
export const registration = "AMFI Registered Mutual Fund Distributor";

/**
 * IRDAI licence — confirmed held (24 Sep 2026), number not yet supplied.
 * Everything that renders it is conditional: set the number and it appears
 * in the footer, the About credentials, and the proof bar automatically.
 */
export const irdaiLicensed = true;
export const irdaiNumber = "";
export const irdaiLabel = irdaiNumber ? `IRDAI Licensed · ${irdaiNumber}` : "IRDAI Licensed";

/**
 * "Home of Investments" is a registered DOMAIN only — not a company, LLP or
 * partnership. The legal person is Darshan Borse, and the ARN is personal.
 * So: never "we" / "our firm" / "the company", and the footer says this plainly.
 */
export const tradeNameNote = `${practiceName} is a trade name used by ${legalName}. It is not a registered company.`;

export const address = {
  street: "Plot No. 58, Near Jai Hind Swimming Tank",
  locality: "Jaihind Colony, Deopur",
  city: "Dhule",
  state: "Maharashtra",
  postalCode: "424002",
  country: "IN",
};
export const addressLine = `${address.street}, ${address.locality}, ${address.city}, ${address.state} ${address.postalCode}`;

/** Where the offices are. He works with Indian families anywhere — in India or abroad (NRIs, for their wealth in India). These are addresses, not a service area. */
export const cities = ["Dhule", "Pune"] as const;

/** Headline credential — confirmed 25 Sep 2026. */
export const clientFamilies = "150+ families";

/* ═══════════════════════════════════════════════════════════════════════
   ⚠️  PLACEHOLDER VALUES — INVENTED, NOT SUPPLIED BY DARSHAN  ⚠️
   Every figure below is a stand-in agreed on 25 Sep 2026 so the copy could
   be finished. NONE of it has been confirmed. Replace all three before the
   site goes live — they are factual claims published under ARN-283719.
   Nothing else in the codebase hard-codes these; edit here only.
   ═══════════════════════════════════════════════════════════════════════ */
export const PLACEHOLDER_firstCallLength = "about 30 minutes";
export const PLACEHOLDER_reviewCadence = "every six months";
export const PLACEHOLDER_languages = "Marathi, Hindi or English";
export const PLACEHOLDER_notFor = "guaranteed returns, stock tips, or someone to time the market";

export const yearsExperience = "6+ years";
export const qualification = "MBA in Finance";

/** Mandatory disclosures for an AMFI-registered distributor. */
export const marketRiskDisclaimer =
  "Mutual Fund investments are subject to market risks. Read all scheme related documents carefully.";
export const commissionDisclosure =
  "As an AMFI registered mutual fund distributor, I earn commission from the asset management company on investments made through me. You pay me no separate fee.";

export const whatsappUrl = `https://wa.me/${phoneHref.replace("+", "")}?text=${encodeURIComponent(
  "Hi Darshan, I'd like to talk about a plan.",
)}`;

/**
 * Absolute origin, used for the canonical tag, og:url, the sitemap and to make
 * og:image absolute (required by Facebook/WhatsApp). No trailing slash. The
 * Cloudflare Pages address for now; change it to the client's domain (bought on
 * GoDaddy) once its nameservers point at Cloudflare.
 */
export const siteUrl = "https://darshan-borse.pages.dev";
export const ogImage = `${siteUrl}/og-image.jpg`;

/**
 * Opening sequence words. Each one disarms a fear the visitor arrives with —
 * confusion, being sold to, complexity — and the last echoes the hero line
 * ("...they need a plan."). Promises to the reader, not adjectives about the
 * speaker. Three is the ceiling: each costs ~1s of a 4G visitor's time.
 */
/* Three beats that tell the whole story and land on the hero ("A plan for your…"). Plain words. */
export const introWords = ["your money.", "your goals.", "one plan."] as const;

/**
 * Hero: "A plan for" + one of these, rotating. The intro ends on "just a
 * plan." and the hero answers: a plan for YOUR what. The lead reads "A plan
 * for your", so each word must follow "your": personal, in the visitor's own
 * terms (the client asked for this, 25 Sep 2026). Uppercase, so 12
 * characters is the ceiling for a single line on a 360px phone. "Bad
 * months" is the honest one; "whole life" closes the loop.
 */
export const heroGoals = [
  "Retirement.",
  "Dream home.",
  "Marriage.",
  "Education.",
  "Bad months.",
  "Whole life.",
] as const;

/** The one line of context under the hero. The registration lives in the letterhead. */
export const heroSentence =
  "I'm Darshan. I help Indian families, here and abroad, turn scattered investments into one complete plan you can actually understand.";
