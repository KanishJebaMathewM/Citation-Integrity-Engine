import { useState } from "react";
import { Menu, X, ShieldCheck, FileText, BarChart2, DollarSign, LayoutDashboard, Sun, Moon } from "lucide-react";
import { HighlighterTick } from "./Layout";

interface NavBarProps {
  currentView: "dashboard" | "upload" | "progress" | "report" | "cost";
  onNavigate: (view: "dashboard" | "upload" | "progress" | "report" | "cost") => void;
  activeRunId: string | null;
  trustScore?: number | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function NavBar({ currentView, onNavigate, activeRunId, trustScore, darkMode, onToggleDarkMode }: NavBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--paper-deep)] bg-[var(--paper)]/90 backdrop-blur-md">
      <nav
        aria-label="Main"
        className={`mx-auto flex h-16 w-full items-center justify-between px-6 md:px-12 ${
          currentView === "dashboard" ? "max-w-full" : "max-w-[1680px]"
        }`}
      >
        <button 
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-3 text-left group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--plum)] text-white shadow-md transition-transform group-hover:scale-105">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 font-[var(--font-display)] text-lg font-semibold tracking-tight text-[var(--ink)]">
              CITATION INTEGRITY ENGINE
              <HighlighterTick color="var(--plum)" />
            </div>
            <div className="text-[11px] font-mono text-[var(--ink-faint)]">
              Multi-Agent Verification Platform
            </div>
          </div>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => onNavigate("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === "dashboard"
                ? "bg-[var(--plum-wash)] text-[var(--plum-deep)] font-semibold"
                : "text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--paper-dim)]"
            }`}
          >
            <LayoutDashboard size={15} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate("upload")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === "upload"
                ? "bg-[var(--plum-wash)] text-[var(--plum-deep)] font-semibold"
                : "text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--paper-dim)]"
            }`}
          >
            <FileText size={15} />
            <span>Verify Paper</span>
          </button>

          {activeRunId && (
            <button
              onClick={() => onNavigate("progress")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === "progress"
                  ? "bg-[var(--plum-wash)] text-[var(--plum-deep)] font-semibold"
                  : "text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--paper-dim)]"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--plum)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--plum)]"></span>
              </span>
              <span>Live Run Trace</span>
            </button>
          )}

          {currentView === "report" && (
            <button
              onClick={() => onNavigate("report")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === "report"
                  ? "bg-[var(--plum-wash)] text-[var(--plum-deep)] font-semibold"
                  : "text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--paper-dim)]"
              }`}
            >
              <BarChart2 size={15} />
              <span>Trust Report</span>
              {trustScore !== undefined && trustScore !== null && (
                <span className="ml-1 rounded bg-[var(--paper-deep)] px-1.5 py-0.5 font-mono text-xs font-semibold text-[var(--ink)]">
                  {trustScore}%
                </span>
              )}
            </button>
          )}

          {activeRunId && (
            <button
              onClick={() => onNavigate("cost")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === "cost"
                  ? "bg-[var(--plum-wash)] text-[var(--plum-deep)] font-semibold"
                  : "text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--paper-dim)]"
              }`}
            >
              <DollarSign size={15} />
              <span>Cost Ledger</span>
            </button>
          )}

          {/* LIGHT / DARK MODE TOGGLE BUTTON */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="ml-3 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] text-[var(--ink)] hover:border-[var(--plum)] hover:bg-[var(--paper)] transition-all shadow-xs"
          >
            {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-[var(--plum)]" />}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] text-[var(--ink)]"
          >
            {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-[var(--plum)]" />}
          </button>

          <button
            type="button"
            className="text-[var(--ink)] p-2"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[var(--paper-deep)] bg-[var(--paper)] px-5 py-3 md:hidden space-y-2">
          <button
            onClick={() => { onNavigate("dashboard"); setOpen(false); }}
            className="w-full text-left py-2 font-medium text-[var(--ink)]"
          >
            Dashboard
          </button>
          <button
            onClick={() => { onNavigate("upload"); setOpen(false); }}
            className="w-full text-left py-2 font-medium text-[var(--ink)]"
          >
            Verify Paper
          </button>
          {activeRunId && (
            <button
              onClick={() => { onNavigate("progress"); setOpen(false); }}
              className="w-full text-left py-2 font-medium text-[var(--ink)]"
            >
              Live Run Trace
            </button>
          )}
          {currentView === "report" && (
            <button
              onClick={() => { onNavigate("report"); setOpen(false); }}
              className="w-full text-left py-2 font-medium text-[var(--ink)]"
            >
              Trust Report
            </button>
          )}
          {activeRunId && (
            <button
              onClick={() => { onNavigate("cost"); setOpen(false); }}
              className="w-full text-left py-2 font-medium text-[var(--ink)]"
            >
              Cost Ledger
            </button>
          )}
        </div>
      )}
    </header>
  );
}
