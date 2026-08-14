import React, { useState } from 'react';
import UploadScreen from '@/screens/UploadScreen';
import RunProgressScreen from '@/screens/RunProgressScreen';
import TrustReportScreen from '@/screens/TrustReportScreen';
import CostBreakdownScreen from '@/screens/CostBreakdownScreen';
import { NavBar } from '@/components/cie/NavBar';
import { getReport, Report } from '@/api/client';
import { setActiveRun } from '@/lib/run-store';

export default function App() {
  const [currentView, setCurrentView] = useState<'upload' | 'progress' | 'report' | 'cost'>('upload');
  const [activeRunId, setActiveRunIdState] = useState<string | null>(null);
  const [reportData, setReportData] = useState<Report | null>(null);

  const handleRunStarted = (runId: string) => {
    setActiveRunIdState(runId);
    setActiveRun(runId);
    setCurrentView('progress');
  };

  const handleRunCompleted = async (runId: string) => {
    try {
      const rep = await getReport(runId);
      setReportData(rep);
      setCurrentView('report');
    } catch (err) {
      console.error('Failed to load trust report:', err);
    }
  };

  const handleReset = () => {
    setActiveRunIdState(null);
    setActiveRun(null);
    setReportData(null);
    setCurrentView('upload');
  };

  const handleNavigate = (view: 'upload' | 'progress' | 'report' | 'cost') => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--plum-wash)] selection:text-[var(--plum-deep)]">
      {/* Top Header Navigation Bar */}
      <NavBar
        currentView={currentView}
        onNavigate={handleNavigate}
        activeRunId={activeRunId}
        trustScore={reportData?.trust_score}
      />

      {/* Main Screen Views */}
      <main className="flex-1">
        {currentView === 'upload' && (
          <UploadScreen onRunStarted={handleRunStarted} />
        )}
        {currentView === 'progress' && activeRunId && (
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
      <footer className="border-t border-[var(--paper-deep)] py-6 text-center text-xs text-[var(--ink-faint)] font-mono">
        Citation Integrity Engine (CIE) • Powered by LangGraph State Machine & Independent Adversarial Agents
      </footer>
    </div>
  );
}
