import { useEffect, useState } from "react";
import { scoreBand } from "@/lib/verdict";

export function InkBloom({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="animate-bloom pointer-events-none absolute inset-0 rounded-full"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
        filter: "blur(10px)",
      }}
    />
  );
}

export function TrustScoreGauge({ score, size = 200 }: { score: number; size?: number }) {
  const band = scoreBand(score);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      setShown(score);
      return;
    }
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      setShown(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--paper-deep)"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={band.stroke}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * (score / 100)) * progress}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {score >= 85 && (
          <div className="absolute inset-6">
            <InkBloom color={band.stroke} />
          </div>
        )}
        <span
          className="relative text-display-xl"
          style={{ fontSize: size > 170 ? "5.5rem" : "3rem" }}
        >
          {shown}
        </span>
      </div>
      <span className="sr-only">Trust score {score} out of 100 — {band.word}</span>
    </div>
  );
}

export function GaugeChip({ score }: { score: number }) {
  const band = scoreBand(score);
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-ui-label"
      style={{ backgroundColor: band.wash }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" className="-rotate-90" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="var(--paper-deep)" strokeWidth="3" />
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="none"
          stroke={band.stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 6}
          strokeDashoffset={2 * Math.PI * 6 * (1 - score / 100)}
        />
      </svg>
      {score}
    </span>
  );
}
