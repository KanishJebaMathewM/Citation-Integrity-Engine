import { useEffect, useRef, useState } from "react";
import { verdictStyles } from "@/lib/verdict";
import type { ClaimResult } from "@/lib/mock-data";

/**
 * Two Pens — the product's signature highlighter draw-on.
 * Agents agree  -> one merged confident band.
 * Agents differ -> two offset strokes, visible before any text is read.
 */
export function TwoPensComparison({
  result,
  trigger = "mount",
  replayKey,
}: {
  result: ClaimResult;
  /** "mount" = timed on mount, "scroll" = drawn when scrolled into view */
  trigger?: "mount" | "scroll";
  replayKey?: string | number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [drawn, setDrawn] = useState(false);
  const { matched_passage, span, status } = result.evidence;
  const critic = verdictStyles[result.critic_verdict.label];
  const redteam = verdictStyles[result.redteam_verdict.label];
  const agree = result.critic_verdict.label === result.redteam_verdict.label;

  useEffect(() => {
    setDrawn(false);
    if (trigger === "mount") {
      const t = setTimeout(() => setDrawn(true), 120);
      return () => clearTimeout(t);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setDrawn(true)),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger, replayKey]);

  if (status === "missing" || !matched_passage) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--ink-faint)]/40 bg-[var(--paper-dim)] p-5">
        <p className="text-sm text-[var(--ink-faint)]">
          The cited source couldn&apos;t be retrieved, so there is no passage to compare. Both
          reviewers marked this claim unverifiable.
        </p>
      </div>
    );
  }

  const idx = matched_passage.indexOf(span);
  const before = idx >= 0 ? matched_passage.slice(0, idx) : matched_passage;
  const mid = idx >= 0 ? span : "";
  const after = idx >= 0 ? matched_passage.slice(idx + span.length) : "";

  const strokeStyle = (color: string, delay: number, height: number) => ({
    backgroundColor: color,
    height: `${height}px`,
    transformOrigin: "left center" as const,
    transform: drawn ? "scaleX(1)" : "scaleX(0)",
    transition: `transform 500ms var(--ease-reveal) ${delay}ms`,
  });

  return (
    <div className="rounded-lg bg-[var(--paper-dim)] p-5">
      <p className="text-ui-label uppercase text-[var(--ink-faint)]">Source passage</p>
      <p ref={ref} className="mt-2 text-mono-sm">
        {before}
        {mid && (
          <span className="relative inline">
            <span className="relative z-10">{mid}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[3px] left-0 right-0 block rounded-full"
              style={strokeStyle(critic.stroke, 0, agree ? 6 : 3)}
            />
            {!agree && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[9px] left-0 right-0 block rounded-full"
                style={strokeStyle(redteam.stroke, 140, 3)}
              />
            )}
          </span>
        )}
        {after}
      </p>
      <p className="mt-5 text-sm text-[var(--ink-faint)]">
        {agree
          ? "Both reviewers underlined the same reading."
          : "The two reviewers disagree on this one — worth a second look."}
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-ui-label">
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-[3px] w-6 rounded-full"
            style={{ backgroundColor: critic.stroke }}
          />
          Critic · {critic.label}
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-[3px] w-6 rounded-full"
            style={{ backgroundColor: redteam.stroke }}
          />
          Red-Team · {redteam.label}
        </li>
      </ul>
    </div>
  );
}
