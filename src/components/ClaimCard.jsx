import React from 'react';
import VerdictBadge from './VerdictBadge';
import { ExternalLink, Sparkles, ChevronRight, Bookmark } from 'lucide-react';

export default function ClaimCard({ claimResult, onSelect }) {
  const { claim, evidence, critic_verdict, redteam_verdict, resolution } = claimResult;

  return (
    <div 
      onClick={() => onSelect(claimResult)}
      className="glass-card glass-card-hover rounded-xl p-5 cursor-pointer border border-slate-800/80 transition-all group"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {claim.citation_marker || '[1]'}
          </span>
          <span className="text-xs text-slate-400 font-mono">{claim.location}</span>
        </div>
        <VerdictBadge label={resolution} type="resolution" />
      </div>

      <h4 className="text-sm font-medium text-slate-100 mb-3 group-hover:text-indigo-300 transition-colors leading-relaxed">
        "{claim.claim_text}"
      </h4>

      {evidence && evidence.matched_passage && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 font-mono mb-4 line-clamp-2">
          <span className="text-slate-500 font-semibold block mb-1">CITED SOURCE PASSAGE ({evidence.source_title || 'arXiv/PMC'}):</span>
          "{evidence.matched_passage}"
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-500 font-medium">Critic:</span>
            <VerdictBadge label={critic_verdict?.label} />
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-slate-500 font-medium">Red-Team:</span>
            <VerdictBadge label={redteam_verdict?.label} />
          </div>
        </div>

        <div className="flex items-center gap-1 text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
          <span>Compare Agents</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
