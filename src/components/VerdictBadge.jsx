import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, AlertOctagon, FileQuestion } from 'lucide-react';

export default function VerdictBadge({ label, type = 'verdict' }) {
  const normalized = (label || '').toUpperCase();
  
  if (type === 'resolution') {
    if (normalized === 'RESOLVED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          RESOLVED
        </span>
      );
    }
    if (normalized === 'FLAGGED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertOctagon className="w-3.5 h-3.5" />
          FLAGGED FOR REVIEW
        </span>
      );
    }
    if (normalized === 'UNVERIFIABLE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
          <FileQuestion className="w-3.5 h-3.5" />
          UNVERIFIABLE
        </span>
      );
    }
  }

  // Individual Agent Verdict Badges
  if (normalized === 'ENTAILS') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3" />
        ENTAILS
      </span>
    );
  }
  if (normalized === 'PARTIAL') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertTriangle className="w-3 h-3" />
        PARTIAL
      </span>
    );
  }
  if (normalized === 'CONTRADICTS') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <XCircle className="w-3 h-3" />
        CONTRADICTS
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
      <HelpCircle className="w-3 h-3" />
      {normalized || 'UNADDRESSED'}
    </span>
  );
}
