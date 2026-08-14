import type { VerdictLabel, Resolution } from "./mock-data";

export type VerdictStyle = {
  stroke: string;
  wash: string;
  label: string;
};

const defaultStyle: VerdictStyle = {
  stroke: "var(--hl-unaddressed)",
  wash: "var(--hl-unaddressed-wash)",
  label: "Unverifiable",
};

export const verdictStyles: Record<string, VerdictStyle> = {
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

export function getVerdictStyle(label?: string): VerdictStyle {
  if (!label) return defaultStyle;
  const upper = String(label).toUpperCase();
  return verdictStyles[upper] || { ...defaultStyle, label: String(label) };
}

/** The edge/band color a claim card carries, derived from its resolution + verdicts. */
export function resolutionStroke(resolution?: string, critic?: string): string {
  if (resolution === "UNVERIFIABLE") return "var(--hl-unaddressed)";
  if (resolution === "FLAGGED") return "var(--hl-partial)";
  return getVerdictStyle(critic).stroke;
}

export function scoreBand(score?: number): { stroke: string; wash: string; word: string } {
  const safeScore = typeof score === "number" && !isNaN(score) ? score : 0;
  if (safeScore >= 85)
    return { stroke: "var(--hl-entails)", wash: "var(--hl-entails-wash)", word: "holds up well" };
  if (safeScore >= 65)
    return { stroke: "var(--hl-partial)", wash: "var(--hl-partial-wash)", word: "mixed support" };
  return {
    stroke: "var(--hl-contradicts)",
    wash: "var(--hl-contradicts-wash)",
    word: "needs attention",
  };
}

export function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso.includes("T") ? iso : iso + "T00:00:00Z");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return String(iso);
  }
}
