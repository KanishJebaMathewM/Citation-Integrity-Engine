import React from 'react';
import VerdictBadge from '../components/VerdictBadge';
import { X, ShieldAlert, CheckCircle, ExternalLink, Quote, Scale } from 'lucide-react';

export default function ClaimDetailModal({ claimResult, onClose }) {
  if (!claimResult) return null;
  const { claim, evidence, critic_verdict, redteam_verdict, resolution } = claimResult;

  const isDisagreement = critic_verdict?.label !== redteam_verdict?.label;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-4xl w-full rounded-2xl border border-slate-700 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">
              Adversarial Cross-Examination Comparison
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Claim Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Claim Under Audit ({claim.citation_marker})
              </span>
              <VerdictBadge label={resolution} type="resolution" />
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 font-medium text-sm leading-relaxed">
              "{claim.claim_text}"
            </div>
          </div>

          {/* Source Evidence Passage Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-indigo-400" />
                Retrieved Source Passage ({evidence?.source_title || 'arXiv / PMC'})
              </span>
              {evidence?.source_url && (
                <a 
                  href={evidence.source_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  View Original Paper <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-slate-200 text-xs font-mono leading-relaxed">
              "{evidence?.matched_passage || 'Source passage not retrieved.'}"
            </div>
          </div>

          {/* Adversarial Disagreement Banner if Flagged */}
          {isDisagreement && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">Adversarial Disagreement Detected (Flagged State)</span>
                Critic and Red-Team agents arrived at contradicting labels. The system did not average away this dispute, but surfaced both justifications for explicit human review.
              </div>
            </div>
          )}

          {/* Side-by-Side Agent Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Critic Agent Box */}
            <div className="glass-card rounded-xl p-5 border border-indigo-500/30 bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Agent 3: Entailment Critic</span>
                  <span className="text-[10px] text-slate-400">Rigorously evaluates support</span>
                </div>
                <VerdictBadge label={critic_verdict?.label} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Justification Quote & Analysis:</span>
                <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  "{critic_verdict?.justification}"
                </p>
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between font-mono pt-1">
                <span>Self-Reported Confidence:</span>
                <span className="text-indigo-300 font-bold">{Math.round((critic_verdict?.confidence || 0.9) * 100)}%</span>
              </div>
            </div>

            {/* Adversarial Red-Team Box */}
            <div className="glass-card rounded-xl p-5 border border-amber-500/30 bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Agent 4: Adversarial Red-Team</span>
                  <span className="text-[10px] text-slate-400">Independent counter-examiner</span>
                </div>
                <VerdictBadge label={redteam_verdict?.label} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Counter-Justification Analysis:</span>
                <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  "{redteam_verdict?.justification}"
                </p>
              </div>
              <div className="text-[11px] text-slate-400 flex justify-between font-mono pt-1">
                <span>Self-Reported Confidence:</span>
                <span className="text-amber-300 font-bold">{Math.round((redteam_verdict?.confidence || 0.88) * 100)}%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Comparative Audit
          </button>
        </div>

      </div>
    </div>
  );
}
