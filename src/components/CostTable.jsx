import React from 'react';
import { DollarSign, Layers, Cpu } from 'lucide-react';

export default function CostTable({ costLog = [], totalCostUsd = 0 }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden border border-slate-800">
      <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">Token & LLM Cost Accounting</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Total Run Cost: </span>
          <span className="text-base font-bold text-emerald-400">${totalCostUsd.toFixed(5)} USD</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 font-semibold">Node Agent</th>
              <th className="px-4 py-3 font-semibold">Model Provider</th>
              <th className="px-4 py-3 font-semibold text-right">Input Tokens</th>
              <th className="px-4 py-3 font-semibold text-right">Output Tokens</th>
              <th className="px-4 py-3 font-semibold text-right">Est. Cost (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {costLog.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-slate-500 italic font-sans">
                  No cost entries recorded.
                </td>
              </tr>
            ) : (
              costLog.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-indigo-400 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    {row.node}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{row.model}</td>
                  <td className="px-4 py-3 text-right">{row.input_tokens.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{row.output_tokens.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-bold">
                    ${row.estimated_cost_usd.toFixed(6)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
