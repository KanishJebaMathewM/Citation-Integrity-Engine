import React from 'react';
import { ClaimResult } from '@/api/client';
import { TwoPensComparison } from '@/components/cie/TwoPensComparison';
import { VerdictBadge } from '@/components/cie/VerdictBadge';
import { recordReview, useRunStatus } from '@/lib/run-store';
import { X, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface ClaimDetailModalProps {
  result: ClaimResult | null;
  onClose: () => void;
}

export default function ClaimDetailModal({ result, onClose }: ClaimDetailModalProps) {
  const { reviews } = useRunStatus();
  if (!result) return null;

  const claimId = result?.claim?.id || "";
  const currentReview = reviews[claimId];

  const handleReview = (choice: 'critic' | 'redteam' | 'more-evidence') => {
    if (claimId) recordReview(claimId, choice);
  };

  const criticLabel = result?.critic_verdict?.label || "UNVERIFIABLE";
  const redteamLabel = result?.redteam_verdict?.label || "UNVERIFIABLE";
  const criticConfidence = typeof result?.critic_verdict?.confidence === 'number' ? result.critic_verdict.confidence : 0;
  const redteamConfidence = typeof result?.redteam_verdict?.confidence === 'number' ? result.redteam_verdict.confidence : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-rise">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-[var(--paper-deep)] bg-[var(--paper)] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--paper-deep)] pb-4">
          <div>
            <span className="font-mono text-xs text-[var(--ink-faint)]">
              Citation {result?.claim?.citation_marker || "[1]"} · {result?.claim?.location || "Section 1"}
            </span>
            <h2 className="mt-1 font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
              Claim Verification Breakdown
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--ink-faint)] hover:bg-[var(--paper-dim)] hover:text-[var(--ink)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Claim Text Box */}
        <div className="rounded-lg border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-faint)] block mb-1">
            Claim in Manuscript
          </span>
          <p className="text-base text-[var(--ink)] leading-relaxed font-serif">
            "{result?.claim?.claim_text || "Unspecified claim text"}"
          </p>
        </div>

        {/* Two Pens Comparison Component */}
        <TwoPensComparison result={result} trigger="mount" />

        {/* Agent Verifiable Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[var(--ink-faint)]">
                Critic Agent
              </span>
              <VerdictBadge label={criticLabel} size="sm" />
            </div>
            <p className="text-xs text-[var(--ink)] leading-relaxed">
              {result?.critic_verdict?.justification || "No justification provided."}
            </p>
            <div className="text-[10px] font-mono text-[var(--ink-faint)] pt-1">
              Confidence: {Math.round(criticConfidence * 100)}%
            </div>
          </div>

          <div className="rounded-lg border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-[var(--ink-faint)]">
                Red-Team Agent
              </span>
              <VerdictBadge label={redteamLabel} size="sm" />
            </div>
            <p className="text-xs text-[var(--ink)] leading-relaxed">
              {result?.redteam_verdict?.justification || "No justification provided."}
            </p>
            <div className="text-[10px] font-mono text-[var(--ink-faint)] pt-1">
              Confidence: {Math.round(redteamConfidence * 100)}%
            </div>
          </div>
        </div>

        {/* Human-in-the-loop Review Section */}
        <div className="border-t border-[var(--paper-deep)] pt-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
            Human-in-the-Loop Review Override
          </h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleReview('critic')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                currentReview === 'critic'
                  ? 'bg-[var(--plum-wash)] text-[var(--plum-deep)] border-[var(--plum)] font-semibold'
                  : 'bg-[var(--paper-dim)] border-[var(--paper-deep)] text-[var(--ink)] hover:bg-[var(--paper-deep)]'
              }`}
            >
              <Check size={14} />
              Endorse Critic ({criticLabel})
            </button>
            <button
              onClick={() => handleReview('redteam')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                currentReview === 'redteam'
                  ? 'bg-[var(--plum-wash)] text-[var(--plum-deep)] border-[var(--plum)] font-semibold'
                  : 'bg-[var(--paper-dim)] border-[var(--paper-deep)] text-[var(--ink)] hover:bg-[var(--paper-deep)]'
              }`}
            >
              <AlertCircle size={14} />
              Endorse Red-Team ({redteamLabel})
            </button>
            <button
              onClick={() => handleReview('more-evidence')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                currentReview === 'more-evidence'
                  ? 'bg-[var(--plum-wash)] text-[var(--plum-deep)] border-[var(--plum)] font-semibold'
                  : 'bg-[var(--paper-dim)] border-[var(--paper-deep)] text-[var(--ink)] hover:bg-[var(--paper-deep)]'
              }`}
            >
              <RefreshCw size={14} />
              Flag for Deep Retrieval
            </button>
          </div>
          {currentReview && (
            <div className="text-xs font-mono text-[var(--hl-entails)] flex items-center gap-1.5 pt-1">
              <Check size={14} />
              Human review saved: {currentReview}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
