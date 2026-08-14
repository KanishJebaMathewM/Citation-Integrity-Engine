import React from 'react';
import { Cpu, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import { TraceEvent } from '@/api/client';

interface AgentTraceViewerProps {
  events: TraceEvent[];
}

export default function AgentTraceViewer({ events }: AgentTraceViewerProps) {
  return (
    <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--paper-deep)] pb-4 mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
          <Terminal size={16} className="text-[var(--plum)]" />
          <span>Live LangGraph Agent Execution Trace</span>
        </div>
        <span className="font-mono text-xs text-[var(--ink-faint)]">
          {events.length} Events
        </span>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-3 pr-2 font-mono text-xs">
        {events.length === 0 ? (
          <div className="py-8 text-center text-[var(--ink-faint)] italic">
            Waiting for agent step trace stream...
          </div>
        ) : (
          events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-3 text-[var(--ink)] transition-all animate-rise"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="mt-0.5 rounded p-1 bg-[var(--plum-wash)] text-[var(--plum-deep)] shrink-0">
                <Cpu size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[var(--plum-deep)] uppercase tracking-wider text-[11px]">
                    [{event.node}]
                  </span>
                  {event.timestamp && (
                    <span className="text-[10px] text-[var(--ink-faint)]">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--ink)] leading-relaxed">
                  {event.summary}
                </p>
                {event.tokens_used !== undefined && (
                  <span className="mt-1 inline-block text-[10px] text-[var(--ink-faint)]">
                    Tokens: {event.tokens_used}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
