import React from 'react';
import { Cpu, Terminal, Sparkles } from 'lucide-react';
import { TraceEvent } from '@/api/client';

interface AgentTraceViewerProps {
  events: TraceEvent[];
}

export default function AgentTraceViewer({ events }: AgentTraceViewerProps) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-5 shadow-2xl overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-[#21262d] pb-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Window Control Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56] inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f] inline-block" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#c9d1d9] pl-2 border-l border-[#30363d]">
            <Terminal size={14} className="text-[#58a6ff]" />
            <span>langgraph-trace-stream.log</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3fb950] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3fb950]"></span>
          </span>
          <span className="text-[11px] text-[#8b949e]">
            {events.length} events logged
          </span>
        </div>
      </div>

      {/* Terminal Scroll Container */}
      <div className="max-h-80 overflow-y-auto space-y-2.5 pr-2 text-xs text-[#c9d1d9] selection:bg-[#1f6feb] selection:text-white">
        {events.length === 0 ? (
          <div className="py-12 text-center text-[#8b949e] italic flex flex-col items-center gap-2">
            <Sparkles size={18} className="animate-pulse text-[#58a6ff]" />
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
                    ? 'border-[#f85149]/40 bg-[#f85149]/10 text-[#ff7b72]'
                    : isSynthesizer
                      ? 'border-[#ab7df6]/40 bg-[#ab7df6]/10 text-[#d2a8ff]'
                      : 'border-[#30363d] bg-[#161b22] text-[#c9d1d9] hover:border-[#58a6ff]/50'
                }`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className={`mt-0.5 rounded p-1 shrink-0 ${
                  isError
                    ? 'bg-[#f85149]/20 text-[#ff7b72]'
                    : isSynthesizer
                      ? 'bg-[#ab7df6]/20 text-[#d2a8ff]'
                      : 'bg-[#58a6ff]/20 text-[#58a6ff]'
                }`}>
                  <Cpu size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold uppercase tracking-wider text-[11px] ${
                      isError ? 'text-[#ff7b72]' : isSynthesizer ? 'text-[#d2a8ff]' : 'text-[#58a6ff]'
                    }`}>
                      ${event.node}
                    </span>
                    {event.timestamp && (
                      <span className="text-[10px] text-[#8b949e]">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#f0f6fc]">
                    {event.summary}
                  </p>
                  {event.tokens_used !== undefined && (
                    <span className="mt-1 inline-block text-[10px] text-[#8b949e]">
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
