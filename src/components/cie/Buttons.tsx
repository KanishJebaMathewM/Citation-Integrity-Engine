import type { ButtonHTMLAttributes } from "react";

type Variant = "plum" | "outline" | "quiet";

export function Button({
  variant = "plum",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-ui-label transition-colors duration-[120ms] ease-out disabled:cursor-not-allowed disabled:opacity-45";
  const styles: Record<Variant, string> = {
    plum: "bg-[var(--plum)] text-[var(--paper)] hover:bg-[var(--plum-deep)]",
    outline:
      "border border-[var(--ink-faint)]/40 bg-transparent text-[var(--ink)] hover:bg-[var(--plum-wash)] hover:border-[var(--plum)]",
    quiet: "text-[var(--plum)] hover:bg-[var(--plum-wash)]",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
