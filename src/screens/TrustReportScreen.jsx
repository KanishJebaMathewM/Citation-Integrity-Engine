import React, { useState } from 'react';
import TrustScoreGauge from '../components/TrustScoreGauge';
import ClaimCard from '../components/ClaimCard';
import ClaimDetailModal from './ClaimDetailModal';
import { ShieldCheck, AlertOctagon, CheckCircle2, FileQuestion, Filter, DollarSign, ArrowLeft } from 'lucide-react';

export default function TrustReportScreen({ report, onShowCost, onReset }) {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!report) return null;

  const { 
    paper_title, 
    trust_score, 
    total_claims, 
    resolved_count, 
    flagged_count, 
    unverifiable_count, 
    summary, 
    claim_results,
    total_cost_usd
  } = report;

  const filteredClaims = (claim_results || []).filter(c => {
    const matchesFilter = filterStatus === 'ALL' || c.resolution === filterStatus;
    const matchesSearch = c.claim.claim_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.claim.citation_marker.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Audit Another Paper
        </button>
        <button
          onClick={onShowCost}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
        >
          <DollarSign className="w-4 h-4" />
          <span>Run Cost: ${total_cost_usd?.toFixed(5)} USD</span>
        </button>
      </div>

      {/* Top Banner & Trust Score Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gauge Box */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center">
          <TrustScoreGauge score={trust_score} />
        </div>

        {/* Paper Summary Box */}
        <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              AUTOMATED CITATION INTEGRITY REPORT
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-3">{paper_title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {summary}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block font-medium">Total Claims</span>
              <span className="text-lg font-bold text-slate-100">{total_claims}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs text-emerald-400 block font-medium">Resolved</span>
              <span className="text-lg font-bold text-emerald-300">{resolved_count}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-xs text-amber-400 block font-medium">Flagged</span>
              <span className="text-lg font-bold text-amber-300">{flagged_count}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20 text-center">
              <span className="text-xs text-slate-400 block font-medium">Unverifiable</span>
              <span className="text-lg font-bold text-slate-300">{unverifiable_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Filter:</span>
          {['ALL', 'RESOLVED', 'FLAGGED', 'UNVERIFIABLE'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search claims or citation markers..."
          className="w-full md:w-64 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase font-mono">
          Audited Citation Claims ({filteredClaims.length})
        </h3>

        {filteredClaims.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center text-slate-400 text-xs italic">
            No claims match the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredClaims.map((item, idx) => (
              <ClaimCard 
                key={idx} 
                claimResult={item} 
                onSelect={(c) => setSelectedClaim(c)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Comparative Modal */}
      {selectedClaim && (
        <ClaimDetailModal 
          claimResult={selectedClaim} 
          onClose={() => setSelectedClaim(null)} 
        />
      )}
    </div>
  );
}
