import React, { useEffect, useState } from 'react';
import DashboardScreen from '@/screens/DashboardScreen';
import UploadScreen from '@/screens/UploadScreen';
import RunProgressScreen from '@/screens/RunProgressScreen';
import TrustReportScreen from '@/screens/TrustReportScreen';
import CostBreakdownScreen from '@/screens/CostBreakdownScreen';
import { NavBar } from '@/components/cie/NavBar';
import { createRun, getReport, Report } from '@/api/client';
import { setActiveRun } from '@/lib/run-store';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'upload' | 'progress' | 'report' | 'cost'>('dashboard');
  const [activeRunId, setActiveRunIdState] = useState<string | null>(null);
  const [reportData, setReportData] = useState<Report | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('cie-theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cie-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cie-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleRunStarted = (runId: string) => {
    setActiveRunIdState(runId);
    setActiveRun(runId);
    setCurrentView('progress');
  };

  const handleQuickStartArxiv = async (arxivId: string) => {
    try {
      toast.info(`Starting verification for arXiv:${arxivId}...`);
      const formData = new FormData();
      formData.append('input_type', 'arxiv_id');
      formData.append('arxiv_id', arxivId);

      const res = await createRun(formData);
      handleRunStarted(res.run_id);
    } catch (err) {
      console.error('Quick start failed:', err);
      toast.error('Failed to start quick arXiv run.');
    }
  };

  const handleRunCompleted = async (runId: string) => {
    try {
      const rep = await getReport(runId);
      setReportData(rep);
      setCurrentView('report');
      toast.success(`Verification complete! Trust Score: ${rep.trust_score}%`);
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

  const handleNavigate = (view: 'dashboard' | 'upload' | 'progress' | 'report' | 'cost') => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] selection:bg-[var(--plum-wash)] selection:text-[var(--plum-deep)]">
      {/* Sonner Toast Notification System */}
      <Toaster position="top-right" richColors />

      {/* Top Header Navigation Bar */}
      <NavBar
        currentView={currentView}
        onNavigate={handleNavigate}
        activeRunId={activeRunId}
        trustScore={reportData?.trust_score}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Screen Views */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <DashboardScreen
            onGetStarted={() => setCurrentView('upload')}
            onQuickStartArxiv={handleQuickStartArxiv}
          />
        )}
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
        Citation Integrity Engine (CIE) • Powered by Express Node.js & Multi-Agent Adversarial Architecture
      </footer>
    </div>
  );
}
