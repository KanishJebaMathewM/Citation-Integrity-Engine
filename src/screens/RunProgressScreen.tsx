import React, { useEffect, useState } from 'react';
import { getRunStatus, getRunTrace, RunStatusResponse, TraceEvent } from '@/api/client';
import AgentTraceViewer from '@/components/AgentTraceViewer';
import { Loader2, Cpu, AlertTriangle } from 'lucide-react';
import { ManuscriptLayout } from '@/components/cie/Layout';

interface RunProgressScreenProps {
  runId: string;
  onCompleted: (runId: string) => void;
}

export default function RunProgressScreen({ runId, onCompleted }: RunProgressScreenProps) {
  const [statusData, setStatusData] = useState<RunStatusResponse | null>(null);
  const [traceData, setTraceData] = useState<TraceEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: any;

    const poll = async () => {
      try {
        const s = await getRunStatus(runId);
        setStatusData(s);

        const t = await getRunTrace(runId);
        setTraceData(t.events || []);

        if (s.status === 'completed') {
          clearInterval(intervalId);
          setTimeout(() => onCompleted(runId), 600);
        } else if (s.status === 'failed') {
          clearInterval(intervalId);
          setError(s.current_step || 'Verification run failed');
        }
      } catch (err: any) {
        console.error('Polling error:', err);
      }
    };

    poll();
    intervalId = setInterval(poll, 1200);

    return () => clearInterval(intervalId);
  }, [runId, onCompleted]);

  const currentStep = statusData?.current_step || 'initializing';
  const claimsProcessed = statusData?.claims_processed || 0;
  const claimsTotal = statusData?.claims_total || 1;
  const progressPercent = claimsTotal > 0 ? Math.min(100, Math.round((claimsProcessed / claimsTotal) * 100)) : 10;

  return (
    <ManuscriptLayout
      rail={
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
            Run Details
          </h3>
          <div className="rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-4 space-y-2 font-mono text-xs">
            <div>
              <span className="text-[var(--ink-faint)] block">Run ID:</span>
              <span className="text-[var(--ink)] font-bold">{runId}</span>
            </div>
            <div>
              <span className="text-[var(--ink-faint)] block">Status:</span>
              <span className="text-[var(--plum-deep)] font-semibold uppercase">{statusData?.status || 'Queued'}</span>
            </div>
            <div>
              <span className="text-[var(--ink-faint)] block">Progress:</span>
              <span className="text-[var(--ink)]">{claimsProcessed} / {claimsTotal} claims</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--plum)]/30 bg-[var(--plum-wash)] px-3 py-1 text-xs font-mono text-[var(--plum-deep)]">
            <Cpu size={14} className="animate-spin text-[var(--plum)]" />
            <span>RUN ID: {runId}</span>
          </div>
          <h1 className="mt-4 font-[var(--font-display)] text-3xl md:text-4xl font-semibold tracking-tight text-[var(--ink)]">
            Executing Multi-Agent Citation Verification
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-faint)]">
            State Machine: Claim Extractor → Evidence Retriever → Independent Critic & Red-Team Judges → Two-Pens Resolution
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-[var(--hl-contradicts)]/30 bg-[var(--hl-contradicts-wash)] p-6 text-[var(--ink)]">
            <div className="flex items-center gap-2 font-bold mb-2 text-[var(--hl-contradicts)]">
              <AlertTriangle size={20} />
              <span>Verification Run Error</span>
            </div>
            <p className="text-sm font-mono text-[var(--ink)]">{error}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="uppercase tracking-wider text-[var(--plum-deep)] font-mono">
                Current Node: {currentStep}
              </span>
              <span className="text-[var(--ink-faint)]">
                {claimsProcessed} of {claimsTotal} Claims Verified ({progressPercent}%)
              </span>
            </div>

            <div className="w-full h-3 bg-[var(--paper-deep)] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[var(--plum)] rounded-full transition-all duration-500"
                style={{ width: `${Math.max(8, progressPercent)}%` }}
              />
            </div>

            <div className="grid grid-cols-5 gap-2 pt-2 text-center text-[11px] font-mono text-[var(--ink-faint)]">
              {['Extractor', 'Retriever', 'Critic', 'Red-Team', 'Synthesizer'].map((node, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="h-2 w-2 rounded-full bg-[var(--plum)] animate-ping mb-1" />
                  <span>{node}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AgentTraceViewer events={traceData} />
      </div>
    </ManuscriptLayout>
  );
}
