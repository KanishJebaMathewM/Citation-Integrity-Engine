import React, { useEffect, useState } from 'react';
import CostTable from '../components/CostTable';
import { getCostBreakdown } from '../api/client';
import { ArrowLeft, Cpu, ShieldCheck } from 'lucide-react';

export default function CostBreakdownScreen({ runId, onBack }) {
  const [costData, setCostData] = useState(null);

  useEffect(() => {
    getCostBreakdown(runId)
      .then(setCostData)
      .catch(console.error);
  }, [runId]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Trust Report
      </button>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Transparent Token & Model Cost Accounting
        </h2>
        <p className="text-xs text-slate-400">
          CIE optimizes cost-efficiency by reserving primary reasoning models (Critic & Red-Team) strictly for judgment tasks, while utility agents use lighter models.
        </p>
      </div>

      {costData && (
        <CostTable 
          costLog={costData.cost_log} 
          totalCostUsd={costData.total_cost_usd} 
        />
      )}
    </div>
  );
}
