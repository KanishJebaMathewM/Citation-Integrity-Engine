import React, { useState } from 'react';
import { Report, ClaimResult } from '@/api/client';
import { ManuscriptLayout, MarginRail, RailSection, PageTurn, Stagger } from '@/components/cie/Layout';
import { TrustScoreGauge } from '@/components/cie/TrustScoreGauge';
import { ClaimCard } from '@/components/cie/ClaimCard';
import ClaimDetailModal from './ClaimDetailModal';
import { DollarSign, RotateCcw, Download, Filter } from 'lucide-react';

interface TrustReportScreenProps {
  report: Report | null;
  onShowCost: () => void;
  onReset: () => void;
}

export default function TrustReportScreen({ report, onShowCost, onReset }: TrustReportScreenProps) {
  const [selectedClaim, setSelectedClaim] = useState<ClaimResult | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'FLAGGED' | 'RESOLVED' | 'UNVERIFIABLE'>('ALL');

  if (!report) {
    return (
      <ManuscriptLayout>
        <div className="py-20 text-center text-[var(--ink-faint)] font-mono">
          Loading trust report...
        </div>
      </ManuscriptLayout>
    );
  }

  const claimResults = report.claim_results || [];

  const filteredClaims = claimResults.filter((c) => {
    if (filter === 'FLAGGED') return c?.resolution === 'FLAGGED';
    if (filter === 'RESOLVED') return c?.resolution === 'RESOLVED';
    if (filter === 'UNVERIFIABLE') return c?.resolution === 'UNVERIFIABLE';
    return true;
  });

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cie-trust-report-${report.run_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const trustScore = typeof report.trust_score === 'number' ? report.trust_score : 0;

  return (
    <ManuscriptLayout
      rail={
        <div className="space-y-6">
          {/* Trust Score Radial Gauge */}
          <TrustScoreGauge score={trustScore} />

          {/* Quick Metrics */}
          <RailSection title="Verification Breakdown">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--ink-faint)]">Total Claims:</span>
                <span className="font-mono font-semibold text-[var(--ink)]">{report.total_claims || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-faint)]">Resolved (Entailed):</span>
                <span className="font-mono font-semibold text-[var(--hl-entails)]">{report.resolved_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-faint)]">Flagged (Contradicts/Partial):</span>
                <span className="font-mono font-semibold text-[var(--hl-contradicts)]">{report.flagged_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-faint)]">Unverifiable:</span>
                <span className="font-mono font-semibold text-[var(--hl-unaddressed)]">{report.unverifiable_count || 0}</span>
              </div>
            </div>
          </RailSection>

          {/* Action Buttons */}
          <RailSection title="Actions & Tools">
            <div className="space-y-2">
              <button
                onClick={onShowCost}
                className="flex w-full items-center justify-between rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-2.5 text-xs font-medium text-[var(--ink)] hover:border-[var(--plum)] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <DollarSign size={14} className="text-[var(--plum)]" />
                  View Cost Ledger
                </span>
                <span className="font-mono text-[11px] text-[var(--ink-faint)]">
                  ${typeof report.total_cost_usd === 'number' ? report.total_cost_usd.toFixed(4) : '0.0000'}
                </span>
              </button>

              <button
                onClick={downloadJSON}
                className="flex w-full items-center gap-2 rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-2.5 text-xs font-medium text-[var(--ink)] hover:border-[var(--plum)] transition-colors"
              >
                <Download size={14} className="text-[var(--plum)]" />
                Export Audit JSON
              </button>

              <button
                onClick={onReset}
                className="flex w-full items-center gap-2 rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-2.5 text-xs font-medium text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors"
              >
                <RotateCcw size={14} />
                Verify Another Paper
              </button>
            </div>
          </RailSection>
        </div>
      }
    >
      <PageTurn k={report.run_id}>
        <div className="space-y-8">
          {/* Paper Title Header */}
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--ink-faint)]">
              <span>RUN ID: {report.run_id}</span>
              <span>·</span>
              <span>PAPER ID: {report.paper_id}</span>
            </div>
            <h1 className="mt-2 font-[var(--font-display)] text-3xl md:text-4xl font-semibold tracking-tight text-[var(--ink)] leading-snug">
              {report.paper_title || "Manuscript Citation Verification"}
            </h1>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--paper-deep)] pb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[var(--ink-faint)]">
              <Filter size={14} />
              <span>Filter Claims:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'FLAGGED', 'RESOLVED', 'UNVERIFIABLE'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
                    filter === f
                      ? 'bg-[var(--plum)] text-white font-bold'
                      : 'border border-[var(--paper-deep)] bg-[var(--paper-dim)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Claim Cards List */}
          <div className="space-y-4">
            {filteredClaims.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--paper-deep)] bg-[var(--paper-dim)] p-8 text-center text-sm text-[var(--ink-faint)]">
                No claims match the selected filter.
              </div>
            ) : (
              filteredClaims.map((claimResult, idx) => (
                <Stagger key={claimResult?.claim?.id || idx} index={idx}>
                  <ClaimCard
                    result={claimResult}
                    onOpen={() => setSelectedClaim(claimResult)}
                  />
                </Stagger>
              ))
            )}
          </div>
        </div>
      </PageTurn>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <ClaimDetailModal
          result={selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </ManuscriptLayout>
  );
}
