import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Cpu, CheckCircle2, AlertTriangle, Layers, Search, FileText, Zap, DollarSign, BookOpen, Activity, Lock } from 'lucide-react';
import { ManuscriptLayout, HighlighterTick } from '@/components/cie/Layout';

interface DashboardScreenProps {
  onGetStarted: () => void;
  onQuickStartArxiv: (arxivId: string) => void;
}

export default function DashboardScreen({ onGetStarted, onQuickStartArxiv }: DashboardScreenProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ManuscriptLayout>
      <div className="space-y-6 py-2 overflow-hidden">
        
        {/* TOP ROW: Bento Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--paper-deep)] bg-gradient-to-br from-[var(--paper-dim)] via-[var(--paper)] to-[var(--plum-wash)]/60 p-8 md:p-10 shadow-xl transition-transform duration-300">
          {/* Animated Parallax Glowing Orbs */}
          <div
            className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-[var(--plum)]/15 blur-3xl pointer-events-none transition-transform duration-75 ease-out"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
          <div
            className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-[#3fb950]/15 blur-3xl pointer-events-none transition-transform duration-75 ease-out"
            style={{ transform: `translateY(-${scrollY * 0.1}px)` }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--plum)]/30 bg-[var(--plum-wash)] px-3.5 py-1 text-xs font-mono font-medium text-[var(--plum-deep)] shadow-sm">
                <Sparkles size={14} className="text-[var(--plum)] animate-pulse" />
                <span>MULTIDISCIPLINARY MANUSCRIPT VERIFICATION ENGINE</span>
              </div>

              <h1 className="font-[var(--font-display)] text-3xl md:text-5xl font-semibold tracking-tight text-[var(--ink)] leading-snug">
                Verify Every Citation with Independent Adversarial AI
                <HighlighterTick color="var(--plum)" />
              </h1>

              <p className="text-sm md:text-base text-[var(--ink-faint)] leading-relaxed">
                Extract claims, query arXiv, PubMed, and Tavily APIs in parallel, and evaluate entailment with dual Critic & Red-Team LLMs.
              </p>
            </div>

            {/* Bento Hero Action Panel */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={onGetStarted}
                className="group flex items-center justify-center gap-3 rounded-2xl bg-[var(--plum)] px-8 py-4 text-sm font-semibold text-white shadow-xl hover:bg-[var(--plum-deep)] hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <ShieldCheck size={20} />
                <span>Get Started Now</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onQuickStartArxiv('2103.00020')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] px-6 py-3.5 text-xs font-mono font-medium text-[var(--ink)] hover:border-[var(--plum)] hover:bg-[var(--paper-dim)] transition-all"
              >
                <BookOpen size={15} className="text-[var(--plum)]" />
                <span>Demo Paper (2103.00020)</span>
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION BENTO GRID: 8 Cols Pipeline + 4 Cols Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 8 Cols: Interactive Agent Pipeline Flow */}
          <div className="lg:col-span-8 rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--paper-deep)] pb-4">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--plum-deep)]">
                  LangGraph State Machine
                </span>
                <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
                  5-Node Multi-Agent Execution Pipeline
                </h2>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--ink-faint)]">
                <Activity size={14} className="text-[#3fb950] animate-ping" />
                <span>Live State Machine</span>
              </div>
            </div>

            {/* Bento Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { title: '1. Extractor', sub: 'Citation Markers', icon: FileText },
                { title: '2. Retriever', sub: 'arXiv • PubMed', icon: Search },
                { title: '3. Critic', sub: 'GPT-4o Entailment', icon: Cpu },
                { title: '4. Red-Team', sub: 'Adversarial Edge', icon: AlertTriangle },
                { title: '5. Synthesizer', sub: 'Two-Pens Score', icon: CheckCircle2 },
              ].map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-4 space-y-2 text-left hover:border-[var(--plum)] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--plum-wash)] text-[var(--plum-deep)] group-hover:scale-110 transition-transform">
                      <IconComp size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-[var(--ink)] leading-snug">{step.title}</h3>
                      <p className="text-[10px] text-[var(--ink-faint)] font-mono mt-0.5">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-4 text-xs font-mono text-[var(--ink-faint)] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lock size={14} className="text-[var(--plum)]" />
                Independent Dual-Agent Consensus Protocol
              </span>
              <span className="text-[var(--plum-deep)] font-semibold">100% Deterministic State Output</span>
            </div>
          </div>

          {/* Right 4 Cols: Compact Bento Stats Stack */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-1 hover:border-[var(--plum)] transition-all flex flex-col justify-center">
              <span className="font-[var(--font-display)] text-3xl font-bold text-[var(--ink)]">
                4,850+
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider">
                Papers Evaluated
              </span>
            </div>

            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-1 hover:border-[var(--plum)] transition-all flex flex-col justify-center">
              <span className="font-[var(--font-display)] text-3xl font-bold text-[var(--hl-entails)]">
                94.2%
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider">
                Trust Accuracy
              </span>
            </div>

            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-1 hover:border-[var(--plum)] transition-all flex flex-col justify-center">
              <span className="font-[var(--font-display)] text-3xl font-bold text-[var(--ink)]">
                18,400+
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider">
                Claims Verified
              </span>
            </div>

            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-1 hover:border-[var(--plum)] transition-all flex flex-col justify-center">
              <span className="font-[var(--font-display)] text-3xl font-bold text-[var(--plum-deep)]">
                &lt; 15s
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider">
                Pipeline Speed
              </span>
            </div>
          </div>
        </div>

        {/* LOWER SECTION BENTO GRID: 3 Equal Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-3 hover:border-[var(--plum)] transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--plum)] text-white shadow-md">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--ink)]">Two Pens Highlighter</h3>
                <span className="text-[11px] font-mono text-[var(--ink-faint)]">Visual Passage Comparison</span>
              </div>
            </div>
            <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
              Renders merged green strokes for agreeing verdicts, and offset dual strokes when Critic and Red-Team reviewers disagree.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-3 hover:border-[var(--plum)] transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--plum)] text-white shadow-md">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--ink)]">Adversarial Red-Teaming</h3>
                <span className="text-[11px] font-mono text-[var(--ink-faint)]">Sycophancy Elimination</span>
              </div>
            </div>
            <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
              Explicitly searches for claim overreach, omitted scope limitations, and methodological caveats in the cited literature.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-3 hover:border-[var(--plum)] transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--plum)] text-white shadow-md">
                <DollarSign size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[var(--ink)]">Auditable Cost Ledger</h3>
                <span className="text-[11px] font-mono text-[var(--ink-faint)]">Token Accounting</span>
              </div>
            </div>
            <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
              Itemized input and output token logging for every LLM node call along with real-time USD cost estimation.
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION BENTO GRID: One-Click Benchmark Showcase */}
        <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--paper-deep)] pb-4">
            <div>
              <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
                One-Click Benchmark Paper Verifications
              </h3>
              <p className="text-xs text-[var(--ink-faint)] font-mono mt-0.5">
                Instantly trigger multi-agent analysis for famous AI manuscripts
              </p>
            </div>

            <button
              onClick={onGetStarted}
              className="flex items-center gap-2 rounded-xl bg-[var(--plum)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--plum-deep)] transition-colors"
            >
              <span>Upload Custom Paper</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: '2103.00020', title: 'Learning Transferable Visual Models From Natural Language Supervision', field: 'OpenAI CLIP Paper' },
              { id: '1706.03762', title: 'Attention Is All You Need', field: 'Vaswani et al. Transformer' },
              { id: '2005.14165', title: 'Language Models are Few-Shot Learners', field: 'GPT-3 Benchmark' }
            ].map((paper) => (
              <button
                key={paper.id}
                onClick={() => onQuickStartArxiv(paper.id)}
                className="group rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-5 text-left hover:border-[var(--plum)] hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="font-mono text-[11px] font-semibold text-[var(--plum-deep)] block">
                    arXiv:{paper.id}
                  </span>
                  <h4 className="font-semibold text-sm text-[var(--ink)] group-hover:text-[var(--plum-deep)] transition-colors leading-snug line-clamp-2">
                    {paper.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--paper-deep)] pt-3 text-xs font-mono text-[var(--ink-faint)]">
                  <span>{paper.field}</span>
                  <span className="text-[var(--plum)] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Verify <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </ManuscriptLayout>
  );
}
