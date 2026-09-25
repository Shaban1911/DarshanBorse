import { Children, Fragment, isValidElement, type ReactNode } from "react";

/**
 * Splits heading content into per-word masks so it can roll in with the
 * intro's motion. Words are revealed by CSS when an ancestor `.reveal-block`
 * gains `.is-visible` (see Reveal.tsx), staggered by `--w`.
 *
 * Accepts plain strings, <br />, and inline elements such as <em> — an
 * element is treated as a single word so its styling survives intact.
 */
export function RollText({
  children,
  className = "roll-word",
}: {
  children: ReactNode;
  className?: string;
}) {
  let w = 0;
  const out: ReactNode[] = [];

  // A real space follows every word: the masks are inline-blocks, and without
  // it the accessible name (and any copy-paste) would run the words together.
  const pushWord = (node: ReactNode, key: string) => {
    out.push(
      <span className={className} key={key} style={{ ["--w" as string]: w++ }}>
        <span>{node}</span>
      </span>,
      " ",
    );
  };

  Children.forEach(children, (child, c) => {
    if (typeof child === "string" || typeof child === "number") {
      String(child)
        .split(/\s+/)
        .filter(Boolean)
        .forEach((word, n) => pushWord(word, `${c}-${n}`));
    } else if (isValidElement(child)) {
      if (child.type === "br") out.push(<br key={`br-${c}`} />);
      else pushWord(child, `el-${c}`);
    }
  });

  return <Fragment>{out}</Fragment>;
}
