import type { ReactNode } from "react";
import { arn, legalName } from "@/lib/site";

/**
 * The one-page plan, as a document: a title with a blank for the visitor's
 * name, six entries in Darshan's voice — each a run-in heading and one honest
 * sentence — and his name and registration at the foot. Two faint sheets sit
 * behind it, slightly turned: the pile the slips made, which this page came
 * out of. Each entry rises in as the stage scrolls, and its heading is
 * underlined in gold as if by a pen — see the `--gather` timeline in CSS.
 */
export function PlanSheet({ lines }: { lines: ReadonlyArray<ReactNode> }) {
  return (
    <div className="plan-sheet">
      <div className="plan-pile" aria-hidden="true" />
      <p className="plan-title">
        <em>A plan for</em>
        <span className="plan-blank" aria-hidden="true" />
      </p>
      <div className="plan-text">
        {lines.map((line, n) => (
          <p className="plan-line" key={n} style={{ ["--n" as string]: n }}>
            {line}
          </p>
        ))}
      </div>
      <p className="plan-sign">
        <em>{legalName}</em>
        <span>{arn}</span>
      </p>
    </div>
  );
}
