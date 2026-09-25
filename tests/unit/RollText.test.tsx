import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RollText } from "@/components/RollText";

describe("RollText", () => {
  it("wraps each word in its own mask with an increasing stagger index", () => {
    const { container } = render(
      <h2>
        <RollText>You're not behind.</RollText>
      </h2>,
    );
    const words = container.querySelectorAll(".roll-word");
    expect(words).toHaveLength(3);
    expect([...words].map((w) => (w as HTMLElement).style.getPropertyValue("--w"))).toEqual([
      "0",
      "1",
      "2",
    ]);
  });

  it("keeps a real space between words so the accessible name reads correctly", () => {
    const { container } = render(
      <p>
        <RollText>Finance is numbers.</RollText>
      </p>,
    );
    expect(container.textContent).toBe("Finance is numbers. ");
  });

  it("preserves line breaks and inline elements as single words", () => {
    const { container } = render(
      <h2>
        <RollText>
          One plan.
          <br />
          <em>Your name.</em>
        </RollText>
      </h2>,
    );
    expect(container.querySelector("br")).not.toBeNull();
    expect(container.querySelector(".roll-word em")?.textContent).toBe("Your name.");
  });
});
