import type { ReactNode } from "react";

/** Manuscript column + margin rail. Rail collapses to a bottom drawer under 768px. */
export function ManuscriptLayout({
  children,
  rail,
  fullWidth = false,
}: {
  children: ReactNode;
  rail?: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex w-full flex-col gap-6 px-4 sm:px-6 md:px-8 pb-28 md:flex-row md:items-start md:gap-12 md:pb-16 ${
        fullWidth ? "max-w-full px-4 sm:px-8 md:px-12 pt-3 md:pt-4" : "max-w-[1160px] pt-8"
      }`}
    >
      <div className="min-w-0 flex-1 w-full">
        <div className={fullWidth ? "manuscript-full" : "manuscript"}>{children}</div>
      </div>
      {rail && <MarginRail>{rail}</MarginRail>}
    </div>
  );
}

export function MarginRail({ children }: { children: ReactNode }) {
  return (
    <aside className="w-full shrink-0 md:sticky md:top-24 md:w-[280px]">
      <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5">
        {children}
      </div>
    </aside>
  );
}

export function RailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--paper-deep)] py-4 first:border-t-0 first:pt-0">
      <h3 className="text-ui-label uppercase text-[var(--ink-faint)]">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function PageTurn({ children, k }: { children: ReactNode; k?: string | number }) {
  return (
    <div key={k} className="animate-page-turn">
      {children}
    </div>
  );
}

export function Stagger({ children, index }: { children: ReactNode; index: number }) {
  return (
    <div className="animate-rise" style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}>
      {children}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="paper-grain h-24 w-full rounded-lg" aria-hidden="true" />
  );
}

export function HighlighterTick({ color = "var(--hl-entails)" }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-[3px] w-4 shrink-0 rounded-full"
      style={{ backgroundColor: color, transform: "rotate(-38deg)" }}
    />
  );
}
