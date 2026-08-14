import type { VerdictLabel, Resolution } from "./mock-data";

export type VerdictStyle = {
  stroke: string;
  wash: string;
  label: string;
};

export const verdictStyles: Record<VerdictLabel, VerdictStyle> = {
  ENTAILS: { stroke: "var(--hl-entails)", wash: "var(--hl-entails-wash)", label: "Entails" },
  PARTIAL: { stroke: "var(--hl-partial)", wash: "var(--hl-partial-wash)", label: "Partial" },
  CONTRADICTS: {
    stroke: "var(--hl-contradicts)",
    wash: "var(--hl-contradicts-wash)",
    label: "Contradicts",
  },
  UNADDRESSED: {
    stroke: "var(--hl-unaddressed)",
    wash: "var(--hl-unaddressed-wash)",
    label: "Unaddressed",
  },
  UNVERIFIABLE: {
    stroke: "var(--hl-unaddressed)",
    wash: "var(--hl-unaddressed-wash)",
    label: "Unverifiable",
  },
};

/** The edge/band color a claim card carries, derived from its resolution + verdicts. */
export function resolutionStroke(resolution: Resolution, critic: VerdictLabel): string {
  if (resolution === "UNVERIFIABLE") return "var(--hl-unaddressed)";
  if (resolution === "FLAGGED") return "var(--hl-partial)";
  return verdictStyles[critic].stroke;
}

export function scoreBand(score: number): { stroke: string; wash: string; word: string } {
  if (score >= 85)
    return { stroke: "var(--hl-entails)", wash: "var(--hl-entails-wash)", word: "holds up well" };
  if (score >= 65)
    return { stroke: "var(--hl-partial)", wash: "var(--hl-partial-wash)", word: "mixed support" };
  return {
    stroke: "var(--hl-contradicts)",
    wash: "var(--hl-contradicts-wash)",
    word: "needs attention",
  };
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
