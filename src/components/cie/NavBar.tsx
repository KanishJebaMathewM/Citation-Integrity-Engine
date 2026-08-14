import { useState } from "react";
import { Menu, X, ShieldCheck, FileText, BarChart2, DollarSign, Key } from "lucide-react";
import { HighlighterTick } from "./Layout";
import { ApiSettingsModal } from "./ApiSettingsModal";

interface NavBarProps {
  currentView: "upload" | "progress" | "report" | "cost";
  onNavigate: (view: "upload" | "progress" | "report" | "cost") => void;
  activeRunId: string | null;
  trustScore?: number | null;
}

export function NavBar({ currentView, onNavigate, activeRunId, trustScore }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--paper-deep)] bg-[var(--paper)]/90 backdrop-blur-md">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 w-full max-w-[1160px] items-center justify-between px-5"
        >
          <button 
            onClick={() => onNavigate("upload")}
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
              onClick={() => onNavigate("upload")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === "cost"
                    ? "bg-[var(--plum-wash)] text-[var(--plum-deep)] font-semibold"
                    : "text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--paper-dim)]"
                }`}
              >
                <DollarSign size={15} />
                <span>Cost Ledger</span>
              </button>
            )}

            {/* API Settings Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--paper-deep)] bg-[var(--paper-dim)] px-3 py-1.5 text-xs font-mono font-medium text-[var(--ink)] hover:border-[var(--plum)] transition-all"
            >
              <Key size={14} className="text-[var(--plum)]" />
              <span>API Keys</span>
            </button>
          </div>

          <button
            type="button"
            className="md:hidden text-[var(--ink)] p-2"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {open && (
          <div className="border-t border-[var(--paper-deep)] bg-[var(--paper)] px-5 py-3 md:hidden space-y-2">
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
            <button
              onClick={() => { setSettingsOpen(true); setOpen(false); }}
              className="w-full text-left py-2 font-medium text-[var(--plum-deep)] flex items-center gap-2"
            >
              <Key size={16} />
              API Key Settings
            </button>
          </div>
        )}
      </header>

      {/* API Key Settings Modal */}
      <ApiSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
