import { pageMeta, structuredData } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { RollText } from "@/components/RollText";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import {
  whatsappUrl,
  legalName,
  title,
  registration,
  arn,
  clientFamilies,
  yearsExperience,
  qualification,
  cities,
  ogImage,
  addressLine,
  mapsUrl,
  irdaiLabel,
  instagramUrl,
} from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta("about", "profile"),
    scripts: [{ type: "application/ld+json", children: structuredData("about") }],
  }),
  component: AboutPage,
});

/**
 * The site is a letterhead; this page is the letter. Four short paragraphs
 * in his voice, every one inside confirmed facts, signed at the foot.
 * Plain words: English is a second language for most readers.
 */
const letter = [
  "I'm from Dhule. I studied finance because I wanted to know how money actually works. I stayed because I kept meeting people who had been sold something nobody explained to them.",
  "So I start slowly. I ask a lot of questions. I explain things more than once if that is what it takes, and I would rather lose a sale than put you into something you don't understand.",
  `Today I look after ${clientFamilies}, in ${cities.join(" and ")} and well beyond, including families abroad with money in India. Most weeks I explain this work in public on Instagram, so you can see how I think before you message.`,
  "The hard part is never the maths. It is helping you feel sure enough about a decision to stay with it for twenty years. That is the job.",
];

/** The record, as a document. Only what is on paper. */
const record = [
  ["Experience", yearsExperience],
  ["Qualification", qualification],
  ["Registration", `${registration}, ${arn}`],
  ["Insurance", irdaiLabel],
  ["Works with", "Indian families anywhere in the world, including NRIs"],
  ["Offices", cities.join(" and ")],
] as const;

function AboutPage() {
  return (
    <>
      {/* ═══ opening: the closest portrait on the disc, one line in each voice ═══ */}
      <section className="about-open paper">
        <div className="about-open-copy">
          <p className="ask-you">Who am I trusting with this?</p>
          <h1>
            <RollText className="hero-word">I'd rather explain than sell.</RollText>
          </h1>
          <p className="about-lead">
            {legalName}, {title.toLowerCase()}. {yearsExperience} of sitting across a table from
            people and going through their money with them, line by line.
          </p>
        </div>
        <div className="about-disc" aria-hidden="true" />
        <figure className="about-portrait">
          <ResponsiveImage
            name="darshan-portrait"
            alt={legalName}
            width={1094}
            height={1600}
            sizes="(min-width: 768px) 34vw, 70vw"
            priority
          />
        </figure>
      </section>

      {/* ═══ the letter: the sheet from the plan, now carrying his story ═══ */}
      <section className="about-letter sheet-edge paper">
        <Reveal className="about-letter-lead">
          <h2>
            <RollText>A few things about me.</RollText>
          </h2>
        </Reveal>
        <Reveal className="letter">
          <div className="plan-pile" aria-hidden="true" />
          <p className="plan-title">
            <em>Hey, I'm Darshan.</em>
          </p>
          <div className="letter-text">
            {letter.map((line) => (
              <p key={line}>
                {line.includes("Instagram") ? (
                  <>
                    {line.split("Instagram")[0]}
                    <a href={instagramUrl} target="_blank" rel="noreferrer">
                      Instagram
                    </a>
                    {line.split("Instagram")[1]}
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
          <p className="plan-sign">
            <em>{legalName}</em>
            <span>{arn}</span>
          </p>
        </Reveal>
      </section>

      {/* ═══ on the record: ink, the wave edge, the facts as a document ═══ */}
      <section className="about-record sheet-edge edge-wave" data-dark>
        <Reveal>
          <h2>
            <RollText>On the record.</RollText>
          </h2>
        </Reveal>
        <dl className="record">
          {record.map(([term, value]) => (
            <Reveal key={term} className="record-row">
              <dt>{term}</dt>
              <dd>{value}</dd>
            </Reveal>
          ))}
          <Reveal className="record-row">
            <dt>Address</dt>
            <dd>
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                {addressLine}
              </a>
            </dd>
          </Reveal>
        </dl>
      </section>

      {/* ═══ the office: across a table, in Deopur ═══ */}
      {/* a landscape print of the desk, cut from the office photo so he is in frame at every width */}
      <section className="about-office">
        <ResponsiveImage
          name="darshan-office-wide"
          alt={`${legalName} at his desk in Deopur, Dhule`}
          width={854}
          height={560}
          sizes="100vw"
        />
        <p className="about-office-caption">
          Deopur, Dhule. The table where most first conversations happen.
        </p>
      </section>

      {/* ═══ hello: quiet, on paper ═══ */}
      <section className="about-hello sheet-edge edge-left paper" id="contact">
        <Reveal>
          <h2>
            <RollText>Start with a simple hello.</RollText>
          </h2>
          <p>No forms, no obligation. I read every message myself and reply as soon as I can.</p>
          <a className="btn hello-send" href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle /> Send on WhatsApp
          </a>
        </Reveal>
      </section>
    </>
  );
}
