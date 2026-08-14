import { getVerdictStyle } from "@/lib/verdict";
import type { VerdictLabel } from "@/api/client";

export function VerdictBadge({
  label,
  size = "md",
}: {
  label: VerdictLabel | string;
  size?: "sm" | "md";
}) {
  const s = getVerdictStyle(label);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full text-ui-label uppercase ${
        size === "sm" ? "px-2 py-0.5 text-[0.6875rem]" : "px-2.5 py-1"
      }`}
      style={{ backgroundColor: s.wash, color: "var(--ink)" }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: s.stroke }}
      />
      {s.label}
    </span>
  );
}

export function StatusTag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "flagged" | "reviewed";
}) {
  const bg =
    tone === "flagged"
      ? "var(--hl-partial-wash)"
      : tone === "reviewed"
        ? "var(--plum-wash)"
        : "var(--paper-deep)";
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.6875rem] uppercase text-ui-label"
      style={{ backgroundColor: bg, color: "var(--ink)" }}
    >
      {children}
    </span>
  );
}
