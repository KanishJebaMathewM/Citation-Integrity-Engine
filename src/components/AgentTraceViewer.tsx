import React from 'react';
import { Cpu, Terminal, Sparkles } from 'lucide-react';
import { TraceEvent } from '@/api/client';

interface AgentTraceViewerProps {
  events: TraceEvent[];
}

export default function AgentTraceViewer({ events }: AgentTraceViewerProps) {
  return (
    <div className="rounded-xl border border-[var(--paper-deep)] glass-terminal p-5 shadow-2xl overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-[var(--paper-deep)] pb-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Window Control Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[var(--hl-contradicts)] inline-block opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[var(--hl-partial)] inline-block opacity-80" />
            <span className="h-3 w-3 rounded-full bg-[var(--hl-entails)] inline-block opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)] pl-2 border-l border-[var(--paper-deep)]">
            <Terminal size={14} className="text-[var(--plum)]" />
            <span>langgraph-trace-stream.log</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--hl-entails)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--hl-entails)]"></span>
          </span>
          <span className="text-[11px] text-[var(--ink-faint)]">
            {events.length} events logged
          </span>
        </div>
      </div>

      {/* Terminal Scroll Container */}
      <div className="max-h-80 overflow-y-auto space-y-2.5 pr-2 text-xs text-[var(--ink)] selection:bg-[var(--plum-wash)] selection:text-[var(--plum-deep)]">
        {events.length === 0 ? (
          <div className="py-12 text-center text-[var(--ink-faint)] italic flex flex-col items-center gap-2">
            <Sparkles size={18} className="animate-pulse text-[var(--plum)]" />
            <span>Initializing LangGraph execution pipeline... Waiting for agent trace stream.</span>
          </div>
        ) : (
          events.map((event, idx) => {
            const isError = event.node === 'error';
            const isSynthesizer = event.node === 'synthesizer';

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-all animate-rise ${
                  isError
                    ? 'border-[var(--hl-contradicts)]/40 bg-[var(--hl-contradicts-wash)] text-[var(--ink)]'
                    : isSynthesizer
                      ? 'border-[var(--plum)]/40 bg-[var(--plum-wash)] text-[var(--ink)]'
                      : 'border-[var(--paper-deep)] bg-[var(--paper-dim)] text-[var(--ink)] hover:border-[var(--plum)]/50'
                }`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className={`mt-0.5 rounded p-1 shrink-0 ${
                  isError
                    ? 'bg-[var(--hl-contradicts-wash)] text-[var(--hl-contradicts)]'
                    : isSynthesizer
                      ? 'bg-[var(--plum-wash)] text-[var(--plum)]'
                      : 'bg-[var(--plum-wash)] text-[var(--plum)]'
                }`}>
                  <Cpu size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold uppercase tracking-wider text-[11px] ${
                      isError ? 'text-[var(--hl-contradicts)]' : isSynthesizer ? 'text-[var(--plum)]' : 'text-[var(--plum)]'
                    }`}>
                      ${event.node}
                    </span>
                    {event.timestamp && (
                      <span className="text-[10px] text-[var(--ink-faint)]">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--ink)]">
                    {event.summary}
                  </p>
                  {event.tokens_used !== undefined && (
                    <span className="mt-1 inline-block text-[10px] text-[var(--ink-faint)]">
                      Tokens: {event.tokens_used}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
