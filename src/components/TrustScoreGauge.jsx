import React from 'react';

export default function TrustScoreGauge({ score = 0 }) {
  const radius = 80;
  const strokeWidth = 14;
  const normalizedScore = Math.max(0, Math.min(100, score));
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let colorClass = 'stroke-emerald-500';
  let textClass = 'text-emerald-400';
  let statusText = 'High Verification Rate';

  if (normalizedScore < 50) {
    colorClass = 'stroke-rose-500';
    textClass = 'text-rose-400';
    statusText = 'Significant Discrepancies';
  } else if (normalizedScore < 80) {
    colorClass = 'stroke-amber-500';
    textClass = 'text-amber-400';
    statusText = 'Moderate Integrity Issues';
  }

  return (
    <div className="flex flex-col items-center justify-center relative p-4">
      <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Animated Progress Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-12 flex flex-col items-center text-center">
        <span className={`text-4xl font-extrabold tracking-tight ${textClass}`}>
          {normalizedScore}
          <span className="text-xl font-normal text-slate-400">/100</span>
        </span>
        <span className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
          Trust Score
        </span>
      </div>
      <p className={`text-xs font-medium mt-2 ${textClass}`}>{statusText}</p>
    </div>
  );
}
