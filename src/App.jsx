import React, { useState } from 'react';
import UploadScreen from './screens/UploadScreen';
import RunProgressScreen from './screens/RunProgressScreen';
import TrustReportScreen from './screens/TrustReportScreen';
import CostBreakdownScreen from './screens/CostBreakdownScreen';
import { getReport } from './api/client';
import { ShieldCheck, GitFork, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('upload'); // 'upload' | 'progress' | 'report' | 'cost'
  const [activeRunId, setActiveRunId] = useState(null);
  const [reportData, setReportData] = useState(null);

  const handleRunStarted = (runId) => {
    setActiveRunId(runId);
    setCurrentView('progress');
  };

  const handleRunCompleted = async (runId) => {
    try {
      const rep = await getReport(runId);
      setReportData(rep);
      setCurrentView('report');
    } catch (err) {
      console.error('Failed to load report:', err);
    }
  };

  const handleReset = () => {
    setActiveRunId(null);
    setReportData(null);
    setCurrentView('upload');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            onClick={handleReset} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                CITATION INTEGRITY ENGINE
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Research Agents Hackathon (IIT Madras / DoraHacks)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <GitFork className="w-3.5 h-3.5 text-indigo-400" />
              <span>LangGraph State Machine</span>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1">
        {currentView === 'upload' && (
          <UploadScreen onRunStarted={handleRunStarted} />
        )}
        {currentView === 'progress' && (
          <RunProgressScreen runId={activeRunId} onCompleted={handleRunCompleted} />
        )}
        {currentView === 'report' && (
          <TrustReportScreen 
            report={reportData} 
            onShowCost={() => setCurrentView('cost')} 
            onReset={handleReset} 
          />
        )}
        {currentView === 'cost' && (
          <CostBreakdownScreen 
            runId={activeRunId} 
            onBack={() => setCurrentView('report')} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 font-mono">
        Citation Integrity Engine (CIE) • Powered by LangGraph, arXiv/PMC APIs & Adversarial Agents
      </footer>
    </div>
  );
}
