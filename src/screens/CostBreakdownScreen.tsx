import React, { useEffect, useState } from 'react';
import { getCostBreakdown, CostRow } from '@/api/client';
import { ManuscriptLayout } from '@/components/cie/Layout';
import { CostLedgerTable } from '@/components/cie/CostLedgerTable';
import { ArrowLeft, DollarSign, Cpu } from 'lucide-react';

interface CostBreakdownScreenProps {
  runId: string | null;
  onBack: () => void;
}

export default function CostBreakdownScreen({ runId, onBack }: CostBreakdownScreenProps) {
  const [rows, setRows] = useState<CostRow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!runId) return;

    getCostBreakdown(runId)
      .then((data) => {
        setRows(data.cost_log || []);
        setTotal(data.total_cost_usd || 0);
      })
      .catch((err) => console.error('Failed to load cost breakdown:', err))
      .finally(() => setLoading(false));
  }, [runId]);

  return (
    <ManuscriptLayout
      rail={
        <div className="space-y-4 font-mono text-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
            Cost Summary
          </h3>
          <div className="rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-4 space-y-2">
            <div>
              <span className="text-[var(--ink-faint)] block">Run ID:</span>
              <span className="text-[var(--ink)] font-bold">{runId || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[var(--ink-faint)] block">Nodes Logged:</span>
              <span className="text-[var(--ink)] font-bold">{rows.length}</span>
            </div>
            <div>
              <span className="text-[var(--ink-faint)] block">Total USD Cost:</span>
              <span className="text-[var(--plum-deep)] font-extrabold text-base">${total.toFixed(4)}</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--plum-deep)] hover:underline mb-3"
          >
            <ArrowLeft size={14} />
            Back to Trust Report
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--plum)]/30 bg-[var(--plum-wash)] px-3 py-1 text-xs font-mono text-[var(--plum-deep)]">
            <DollarSign size={14} />
            <span>LLM Execution Cost Ledger</span>
          </div>
          <h1 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
            Pipeline Token & Cost Breakdown
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-faint)]">
            Transparent per-agent token usage and model pricing for run {runId}
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm font-mono text-[var(--ink-faint)]">
            Loading token ledger...
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--paper-deep)] bg-[var(--paper-dim)] p-8 text-center text-sm text-[var(--ink-faint)]">
            No cost log recorded for this run.
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 shadow-sm">
            <CostLedgerTable rows={rows} total={total} />
          </div>
        )}
      </div>
    </ManuscriptLayout>
  );
}
