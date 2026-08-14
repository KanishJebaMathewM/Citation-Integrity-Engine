import React from 'react';
import { Terminal, Cpu, CheckCircle } from 'lucide-react';

export default function AgentTraceViewer({ events = [] }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>LANGGRAPH AGENT EXECUTION TRACE STREAM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-mono text-slate-400 uppercase">Live Stream</span>
        </div>
      </div>
      <div className="p-4 font-mono text-xs text-slate-300 space-y-2 max-h-60 overflow-y-auto bg-slate-950/60">
        {events.length === 0 ? (
          <div className="text-slate-500 italic py-4 text-center">
            Initializing LangGraph pipeline state machine...
          </div>
        ) : (
          events.map((evt, idx) => (
            <div key={idx} className="flex items-start gap-2 border-l-2 border-indigo-500/40 pl-3 py-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-indigo-300 uppercase">[{evt.node}]</span>
                  <span className="text-[10px] text-slate-500">{evt.timestamp || 'just now'}</span>
                </div>
                <p className="text-slate-200 mt-0.5">{evt.summary}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
