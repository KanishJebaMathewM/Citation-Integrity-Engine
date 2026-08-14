import type { ClaimResult } from "@/lib/mock-data";
import { resolutionStroke } from "@/lib/verdict";
import { VerdictBadge, StatusTag } from "./VerdictBadge";
import { useRunStatus } from "@/lib/run-store";

export function ClaimCard({
  result,
  onOpen,
}: {
  result: ClaimResult;
  onOpen: () => void;
}) {
  const { reviews } = useRunStatus();
  const reviewed = Boolean(reviews[result.claim.id]);
  const stroke = resolutionStroke(result.resolution, result.critic_verdict.label);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="card-hover group flex w-full gap-4 overflow-hidden rounded-lg border border-[var(--paper-deep)] bg-[var(--paper-dim)] text-left hover:-translate-y-0.5 hover:shadow-[0_6px_18px_-12px_rgba(35,35,35,0.45)]"
    >
      <span aria-hidden="true" className="w-1 shrink-0" style={{ backgroundColor: stroke }} />
      <span className="min-w-0 flex-1 py-4 pr-4">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.8125rem] text-[var(--ink-faint)]">
            {result.claim.citation_marker}
          </span>
          <span className="text-ui-label text-[var(--ink-faint)]">{result.claim.location}</span>
          {result.resolution === "FLAGGED" && !reviewed && <StatusTag tone="flagged">flagged</StatusTag>}
          {reviewed && <StatusTag tone="reviewed">human-reviewed</StatusTag>}
        </span>
        <span className="mt-2 line-clamp-2 block text-[1rem] leading-relaxed">
          {result.claim.claim_text}
        </span>
        <span className="mt-3 flex flex-wrap items-center gap-2">
          <VerdictBadge label={result.critic_verdict.label} size="sm" />
          <VerdictBadge label={result.redteam_verdict.label} size="sm" />
        </span>
      </span>
    </button>
  );
}
