import type { CostRow } from "@/api/client";

export function CostLedgerTable({ rows, total }: { rows: CostRow[]; total: number }) {
  const max = Math.max(...rows.map((r) => r.estimated_cost_usd));

  return (
    <div>
      <ul className="mb-8 space-y-2">
        {rows.map((r) => (
          <li key={r.node} className="flex items-center gap-3">
            <span className="w-40 shrink-0 truncate font-mono text-[0.75rem] text-[var(--ink-faint)]">
              {r.node}
            </span>
            <span className="h-2 flex-1 rounded-full bg-[var(--paper-deep)]">
              <span
                className="block h-2 rounded-full bg-[var(--plum)]"
                style={{
                  width: `${(r.estimated_cost_usd / max) * 100}%`,
                  opacity: 0.45 + 0.55 * (r.estimated_cost_usd / max),
                }}
              />
            </span>
          </li>
        ))}
      </ul>

      <table className="w-full border-collapse font-mono text-[0.85rem]">
        <caption className="sr-only">Cost per pipeline node</caption>
        <thead>
          <tr className="border-b border-[var(--ink)]">
            <th className="py-2 text-left text-ui-label uppercase text-[var(--ink-faint)]">Node</th>
            <th className="py-2 text-left text-ui-label uppercase text-[var(--ink-faint)]">Model</th>
            <th className="py-2 text-right text-ui-label uppercase text-[var(--ink-faint)]">In</th>
            <th className="py-2 text-right text-ui-label uppercase text-[var(--ink-faint)]">Out</th>
            <th className="py-2 text-right text-ui-label uppercase text-[var(--ink-faint)]">USD</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.node} className="border-b border-[var(--paper-deep)]">
              <td className="py-2 pr-3">{r.node}</td>
              <td className="py-2 pr-3 text-[var(--ink-faint)]">{r.model}</td>
              <td className="py-2 text-right">{r.input_tokens.toLocaleString()}</td>
              <td className="py-2 text-right">{r.output_tokens.toLocaleString()}</td>
              <td className="py-2 text-right">{r.estimated_cost_usd.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-[var(--ink)]">
            <td className="py-3 text-ui-label uppercase" colSpan={4}>
              Total
            </td>
            <td className="py-3 text-right text-display-m">${total.toFixed(4)}</td>
          </tr>
        </tfoot>
      </table>

      <p className="mt-5 text-sm text-[var(--ink-faint)]">
        Extraction, retrieval and synthesis run on the cheap model because they reshape text rather
        than judge it. The critic, red-team and resolver run on the primary model — that is where a
        wrong call costs a researcher real time.
      </p>
    </div>
  );
}
