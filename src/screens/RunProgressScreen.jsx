import React, { useEffect, useState } from 'react';
import { getRunStatus, getRunTrace } from '../api/client';
import AgentTraceViewer from '../components/AgentTraceViewer';
import { Loader2, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function RunProgressScreen({ runId, onCompleted }) {
  const [statusData, setStatusData] = useState(null);
  const [traceData, setTraceData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const poll = async () => {
      try {
        const s = await getRunStatus(runId);
        setStatusData(s);

        const t = await getRunTrace(runId);
        setTraceData(t.events || []);

        if (s.status === 'completed') {
          clearInterval(intervalId);
          setTimeout(() => onCompleted(runId), 800);
        } else if (s.status === 'failed') {
          clearInterval(intervalId);
          setError(s.current_step || 'Run failed');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    poll();
    intervalId = setInterval(poll, 1200);

    return () => clearInterval(intervalId);
  }, [runId, onCompleted]);

  const currentStep = statusData?.current_step || 'extract_claims';
  const claimsProcessed = statusData?.claims_processed || 0;
  const claimsTotal = statusData?.claims_total || 1;
  const progressPercent = claimsTotal > 0 ? Math.min(100, Math.round((claimsProcessed / claimsTotal) * 100)) : 10;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          <span>RUN ID: {runId}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-100">
          Orchestrating LangGraph Multi-Agent Verification
        </h2>
        <p className="text-sm text-slate-400">
          Running Extractor → Evidence Retriever → Critic & Red-Team Judges → Resolution Router
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-medium text-slate-300">
          <span className="uppercase tracking-wider font-mono text-indigo-400">Current Node: {currentStep}</span>
          <span>{claimsProcessed} of {claimsTotal} Claims Verified</span>
        </div>
        
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(15, progressPercent)}%` }}
          />
        </div>

        {/* Node Step Indicators */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {['Extractor', 'Retriever', 'Critic', 'Red-Team', 'Synthesizer'].map((node, i) => (
            <div key={i} className="text-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500/40 mx-auto mb-1 animate-ping" />
              <span className="text-[10px] font-mono text-slate-400">{node}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Agent Trace Stream */}
      <AgentTraceViewer events={traceData} />
    </div>
  );
}
