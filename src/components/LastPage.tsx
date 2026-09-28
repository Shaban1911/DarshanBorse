import { WipeLink } from "@/components/PageWipe";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { phoneHref, legalName, title, cities } from "@/lib/site";

/**
 * The ending. The ink lifts to reveal him at his desk — the "across a table"
 * from the dialogue, made literal. The section is pinned beneath the page
 * and revealed as it peels away (see .hello in the stylesheet).
 *
 * On a phone the photograph is the top half, so his face is the first thing
 * revealed, and the words sit in the lower half where a thumb rests. The
 * hero shouted the goal in giant type; the ending answers calmly: "A plan
 * for you." in one line. Below it the first message is already written, in
 * the visitor's own voice, with one blank for their name — the one thing
 * people freeze on is what to write, so it is written. The button sends
 * exactly that line. Nothing is stored; nothing is sent until they tap.
 */
export function LastPage() {
  const [name, setName] = useState("");
  const who = name.trim();
  const text = who
    ? `Hi Darshan, I'm ${who}. I'd like to talk about a plan.`
    : "Hi Darshan, I'd like to talk about a plan.";
  const href = `https://wa.me/${phoneHref.replace("+", "")}?text=${encodeURIComponent(text)}`;

  return (
    <>
      {/* phones: him at the desk inside the hero's disc — the same object the site opened with;
          desktop keeps the full room */}
      <div className="scene" aria-hidden="true">
        <div className="scene-disc">
          <ResponsiveImage name="darshan-desk-disc" alt="" width={462} height={462} sizes="70vw" />
        </div>
        <div className="scene-desk">
          <ResponsiveImage
            name="darshan-conversation"
            alt=""
            width={854}
            height={1280}
            sizes="70vw"
          />
        </div>
      </div>

      <div className="hello-copy">
        <h2 className="hello-title">
          <span className="hello-lead">A plan for</span>{" "}
          <span className="hello-you">
            you
            <span className="name-dot" aria-hidden="true">
              .
            </span>
          </span>
        </h2>

        {/* the first message, written; the blank grows with the name (hidden mirror in ::after) */}
        <label className="hello-message">
          <span className="sr-only">Your first message. Add your name if you like:</span>
          Hi Darshan, I'm{" "}
          <span className="name-field" data-value={who || "your name"}>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              autoComplete="given-name"
              autoCapitalize="words"
              enterKeyHint="done"
              maxLength={24}
              aria-label="Your name"
            />
          </span>
          . I'd like to talk about a plan.
        </label>

        <div className="hello-actions">
          <a className="btn hello-send" href={href} target="_blank" rel="noreferrer">
            <MessageCircle /> Send on WhatsApp
          </a>
          <p className="hello-note">Reach out any time.</p>
        </div>

        <p className="hello-caption">
          {legalName}, {title.toLowerCase()}. {cities.join(", ")}, and anywhere on WhatsApp.{" "}
          <WipeLink to="/about">Read my story</WipeLink>
        </p>
      </div>
    </>
  );
}
