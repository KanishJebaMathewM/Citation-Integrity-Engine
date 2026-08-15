import React, { useState, useMemo } from 'react';
import type { CostRow } from "@/api/client";
import { BarChart3, ListTree, Layers, Cpu } from 'lucide-react';

interface CostLedgerTableProps {
  rows: CostRow[];
  total: number;
}

export function CostLedgerTable({ rows, total }: CostLedgerTableProps) {
  const [viewMode, setViewMode] = useState<'aggregated' | 'itemized'>('aggregated');

  // Consolidate duplicate node/model calls into an aggregated summary
  const aggregatedRows = useMemo(() => {
    const map = new Map<string, {
      node: string;
      model: string;
      calls: number;
      input_tokens: number;
      output_tokens: number;
      estimated_cost_usd: number;
    }>();

    rows.forEach((r) => {
      const key = `${r.node}:::${r.model}`;
      const existing = map.get(key);
      if (existing) {
        existing.calls += 1;
        existing.input_tokens += r.input_tokens;
        existing.output_tokens += r.output_tokens;
        existing.estimated_cost_usd += r.estimated_cost_usd;
      } else {
        map.set(key, {
          node: r.node,
          model: r.model,
          calls: 1,
          input_tokens: r.input_tokens,
          output_tokens: r.output_tokens,
          estimated_cost_usd: r.estimated_cost_usd,
        });
      }
    });

    return Array.from(map.values());
  }, [rows]);

  const chartData = viewMode === 'aggregated' ? aggregatedRows : rows;
  const maxCost = Math.max(...chartData.map((r) => r.estimated_cost_usd), 0.00001);

  return (
    <div className="space-y-6">
      {/* Controls & Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--paper-deep)] pb-4">
        <div className="flex items-center gap-2">
          <Cpu className="text-[var(--plum-deep)]" size={18} />
          <h2 className="font-[var(--font-display)] text-lg font-semibold text-[var(--ink)]">
            Execution Cost &amp; Token Breakdown
          </h2>
        </div>

        <div className="inline-flex rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-1">
          <button
            onClick={() => setViewMode('aggregated')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-mono font-medium transition-all ${
              viewMode === 'aggregated'
                ? 'bg-[var(--plum-deep)] text-white shadow-sm'
                : 'text-[var(--ink-faint)] hover:text-[var(--ink)]'
            }`}
          >
            <Layers size={13} />
            <span>Aggregated Summary ({aggregatedRows.length} Nodes)</span>
          </button>
          <button
            onClick={() => setViewMode('itemized')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-mono font-medium transition-all ${
              viewMode === 'itemized'
                ? 'bg-[var(--plum-deep)] text-white shadow-sm'
                : 'text-[var(--ink-faint)] hover:text-[var(--ink)]'
            }`}
          >
            <ListTree size={13} />
            <span>Itemized Step Log ({rows.length} Calls)</span>
          </button>
        </div>
      </div>

      {/* Visual Graphical Bar Chart */}
      <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper)] p-5 space-y-3 shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider mb-2">
          <span>{viewMode === 'aggregated' ? 'Consolidated Node Cost Distribution' : 'Sequential Step Execution Distribution'}</span>
          <span>Relative USD Cost %</span>
        </div>

        <ul className="space-y-2.5">
          {chartData.map((r, idx) => {
            const pct = Math.min(100, Math.max(8, (r.estimated_cost_usd / maxCost) * 100));
            const callsCount = 'calls' in r ? (r as any).calls : null;

            return (
              <li key={`${r.node}-${r.model}-${idx}`} className="flex items-center gap-3 font-mono text-xs">
                <div className="w-56 shrink-0 truncate">
                  <span className="font-semibold text-[var(--ink)]">{r.node}</span>
                  <span className="ml-1 text-[10px] text-[var(--ink-faint)] opacity-80">({r.model})</span>
                  {callsCount && callsCount > 1 && (
                    <span className="ml-1.5 rounded bg-[var(--plum-wash)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--plum-deep)]">
                      {callsCount}×
                    </span>
                  )}
                </div>
                <div className="h-2.5 flex-1 rounded-full bg-[var(--paper-deep)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--plum-deep)] transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      opacity: 0.5 + 0.5 * (r.estimated_cost_usd / maxCost),
                    }}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-bold text-[var(--ink)]">
                  ${r.estimated_cost_usd.toFixed(4)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs text-left">
          <caption className="sr-only">Cost breakdown per pipeline node</caption>
          <thead>
            <tr className="border-b-2 border-[var(--ink)] text-[var(--ink-faint)] uppercase text-[10px] tracking-wider">
              <th className="py-2.5 pr-3">Node Name</th>
              <th className="py-2.5 pr-3">Model / Provider</th>
              {viewMode === 'aggregated' && <th className="py-2.5 pr-3 text-center">Calls</th>}
              <th className="py-2.5 px-3 text-right">Input Tokens</th>
              <th className="py-2.5 px-3 text-right">Output Tokens</th>
              <th className="py-2.5 pl-3 text-right">Est. USD Cost</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((r, idx) => {
              const callsCount = 'calls' in r ? (r as any).calls : 1;

              return (
                <tr
                  key={`table-${r.node}-${r.model}-${idx}`}
                  className="border-b border-[var(--paper-deep)] hover:bg-[var(--paper-wash)] transition-colors"
                >
                  <td className="py-2.5 pr-3 font-semibold text-[var(--ink)]">{r.node}</td>
                  <td className="py-2.5 pr-3 text-[var(--ink-faint)]">{r.model}</td>
                  {viewMode === 'aggregated' && (
                    <td className="py-2.5 pr-3 text-center">
                      <span className="rounded-full bg-[var(--paper-deep)] px-2 py-0.5 text-[10px] font-bold text-[var(--ink)]">
                        {callsCount}
                      </span>
                    </td>
                  )}
                  <td className="py-2.5 px-3 text-right text-[var(--ink)]">
                    {r.input_tokens.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[var(--ink)]">
                    {r.output_tokens.toLocaleString()}
                  </td>
                  <td className="py-2.5 pl-3 text-right font-bold text-[var(--plum-deep)]">
                    ${r.estimated_cost_usd.toFixed(4)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--ink)] font-bold">
              <td className="py-3 text-xs uppercase text-[var(--ink)]" colSpan={viewMode === 'aggregated' ? 3 : 2}>
                Total Run Cost
              </td>
              <td className="py-3 px-3 text-right text-[var(--ink)]">
                {chartData.reduce((acc, item) => acc + item.input_tokens, 0).toLocaleString()}
              </td>
              <td className="py-3 px-3 text-right text-[var(--ink)]">
                {chartData.reduce((acc, item) => acc + item.output_tokens, 0).toLocaleString()}
              </td>
              <td className="py-3 pl-3 text-right text-base text-[var(--plum-deep)]">
                ${total.toFixed(4)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
        Note: Utility tasks (claim extraction, web retrieval, report synthesis) run on high-throughput models.
        Adversarial evaluation nodes (Critic &amp; Red-Team) execute on primary reasoning models to ensure reliable citation entailment.
      </p>
    </div>
  );
}
