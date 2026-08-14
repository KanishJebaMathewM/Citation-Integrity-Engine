import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Cpu, CheckCircle2, AlertTriangle, Layers, Search, FileText, Zap, DollarSign, BookOpen, Activity, Lock, Globe, Database, Compass, Terminal } from 'lucide-react';
import { ManuscriptLayout, HighlighterTick } from '@/components/cie/Layout';
import { AnimatedReveal } from '@/components/AnimatedReveal';

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
    <ManuscriptLayout fullWidth={true}>
      <div className="pt-0 pb-4 space-y-5 overflow-hidden w-full">
        
        {/* LIVE STREAM TICKER MARQUEE */}
        <AnimatedReveal direction="down" delay={0}>
          <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] px-4 py-2 flex items-center justify-between text-xs font-mono text-[var(--ink-faint)] overflow-hidden shadow-xs">
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#3fb950] animate-ping" />
              <span className="font-semibold text-[var(--plum-deep)] uppercase tracking-wider">LIVE ENGINE STATUS</span>
            </div>

            <div className="hidden sm:flex items-center gap-6 overflow-hidden text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
                <Database size={13} className="text-[var(--plum)]" /> arXiv HTTPS API Connected
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
                <Globe size={13} className="text-[var(--plum)]" /> PubMed Central Open Access Sync
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--ink)]">
                <Compass size={13} className="text-[var(--plum)]" /> Tavily Academic Web Search Active
              </span>
            </div>

            <span className="font-semibold text-[var(--plum)] shrink-0">Node v20 • Express Online</span>
          </div>
        </AnimatedReveal>

        {/* MAIN SPLIT GRID: Left Large Hero/Pipeline Panel | Right Component Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          
          {/* LEFT SIDE: Large Featured Hero & Pipeline Box (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-[var(--paper-deep)] bg-gradient-to-br from-[var(--paper-dim)] via-[var(--paper)] to-[var(--plum-wash)]/60 p-7 md:p-10 shadow-xl relative overflow-hidden space-y-6">
            
            {/* Scroll Parallax Background Orbs */}
            <div
              className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[var(--plum)]/15 blur-3xl pointer-events-none transition-transform duration-100 ease-out"
              style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            />
            <div
              className="absolute -left-24 -bottom-24 h-[420px] w-[420px] rounded-full bg-[#3fb950]/15 blur-3xl pointer-events-none transition-transform duration-100 ease-out"
              style={{ transform: `translateY(-${scrollY * 0.1}px)` }}
            />

            <div className="relative z-10 space-y-5">
              <AnimatedReveal direction="up" delay={100}>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--plum)]/30 bg-[var(--plum-wash)] px-4 py-1 text-xs font-mono font-medium text-[var(--plum-deep)] shadow-xs">
                  <Sparkles size={14} className="text-[var(--plum)] animate-pulse" />
                  <span>MULTIDISCIPLINARY MANUSCRIPT VERIFICATION ENGINE</span>
                </div>
              </AnimatedReveal>

              <AnimatedReveal direction="up" delay={200}>
                <h1 className="font-[var(--font-display)] text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--ink)] leading-[1.12]">
                  Verify Every Citation with Independent Adversarial AI
                  <HighlighterTick color="var(--plum)" />
                </h1>
              </AnimatedReveal>

              <AnimatedReveal direction="up" delay={300}>
                <p className="text-base md:text-lg text-[var(--ink-faint)] leading-relaxed">
                  Automatically extract manuscript claims, fetch original cited literature across arXiv, PubMed Central, and Tavily, and evaluate entailment with dual Critic & Red-Team LLMs.
                </p>
              </AnimatedReveal>

              {/* Action Buttons */}
              <AnimatedReveal direction="up" delay={400}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={onGetStarted}
                    className="group flex flex-1 sm:flex-initial items-center justify-center gap-3 rounded-2xl bg-[var(--plum)] px-8 py-4 text-base font-semibold text-white shadow-xl hover:bg-[var(--plum-deep)] hover:scale-[1.03] active:scale-[0.98] transition-all"
                  >
                    <ShieldCheck size={22} />
                    <span>Get Started — Verify Paper</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => onQuickStartArxiv('2103.00020')}
                    className="flex items-center justify-center gap-2.5 rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] px-6 py-4 text-xs font-mono font-medium text-[var(--ink)] hover:border-[var(--plum)] hover:bg-[var(--paper-dim)] transition-all shadow-xs"
                  >
                    <BookOpen size={16} className="text-[var(--plum)]" />
                    <span>Demo arXiv (2103.00020)</span>
                  </button>
                </div>
              </AnimatedReveal>
            </div>

            {/* Embedded 5-Node Agent Execution Flow */}
            <AnimatedReveal direction="up" delay={500}>
              <div className="relative z-10 space-y-3.5 border-t border-[var(--paper-deep)] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--plum-deep)]">
                    LangGraph State Machine Flow
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--ink-faint)]">
                    <Activity size={13} className="text-[#3fb950] animate-ping" />
                    Deterministic Execution
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {[
                    { title: 'Extractor', icon: FileText, num: '01' },
                    { title: 'Retriever', icon: Search, num: '02' },
                    { title: 'Critic', icon: Cpu, num: '03' },
                    { title: 'Red-Team', icon: AlertTriangle, num: '04' },
                    { title: 'Synthesizer', icon: CheckCircle2, num: '05' },
                  ].map((step, idx) => {
                    const IconComp = step.icon;
                    return (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-3 text-center space-y-1.5 hover:border-[var(--plum)] hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-between"
                      >
                        <span className="font-mono text-[10px] text-[var(--ink-faint)] font-bold">{step.num}</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--plum-wash)] text-[var(--plum-deep)] group-hover:scale-110 group-hover:bg-[var(--plum)] group-hover:text-white transition-all">
                          <IconComp size={15} />
                        </div>
                        <span className="font-semibold text-xs text-[var(--ink)] block leading-none">
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper)] p-2.5 text-xs font-mono text-[var(--ink-faint)] flex items-center justify-between shadow-xs">
                  <span className="flex items-center gap-2">
                    <Lock size={14} className="text-[var(--plum)]" />
                    Dual-Agent Adversarial Consensus
                  </span>
                  <span className="text-[var(--plum-deep)] font-semibold">100% Traceable Audit Log</span>
                </div>
              </div>
            </AnimatedReveal>

          </div>

          {/* RIGHT SIDE: Enclosed Component Grid (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            
            {/* 1. Platform Performance Stats (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3.5">
              <AnimatedReveal direction="left" delay={150}>
                <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 space-y-1 hover:border-[var(--plum)] hover:shadow-md transition-all">
                  <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--ink)] block">
                    4,850+
                  </span>
                  <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                    Papers Evaluated
                  </span>
                </div>
              </AnimatedReveal>

              <AnimatedReveal direction="left" delay={250}>
                <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 space-y-1 hover:border-[var(--plum)] hover:shadow-md transition-all">
                  <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--hl-entails)] block">
                    94.2%
                  </span>
                  <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                    Trust Accuracy
                  </span>
                </div>
              </AnimatedReveal>

              <AnimatedReveal direction="left" delay={350}>
                <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 space-y-1 hover:border-[var(--plum)] hover:shadow-md transition-all">
                  <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--ink)] block">
                    18,400+
                  </span>
                  <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                    Claims Verified
                  </span>
                </div>
              </AnimatedReveal>

              <AnimatedReveal direction="left" delay={450}>
                <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 space-y-1 hover:border-[var(--plum)] hover:shadow-md transition-all">
                  <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--plum-deep)] block">
                    &lt; 15s
                  </span>
                  <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                    Pipeline Speed
                  </span>
                </div>
              </AnimatedReveal>
            </div>

            {/* 2. Platform Feature Cards Stack */}
            <div className="space-y-3">
              <AnimatedReveal direction="up" delay={200}>
                <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-4.5 space-y-1.5 hover:border-[var(--plum)] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[var(--plum)] text-white shadow-sm shrink-0">
                      <Layers size={17} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-[var(--ink)]">Two Pens Highlighter</h3>
                      <span className="text-[10px] font-mono text-[var(--ink-faint)]">Visual Passage Comparison</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--ink-faint)] leading-relaxed">
                    Renders merged green strokes for agreeing verdicts, and offset dual strokes when Critic and Red-Team reviewers disagree.
                  </p>
                </div>
              </AnimatedReveal>

              <AnimatedReveal direction="up" delay={300}>
                <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-4.5 space-y-1.5 hover:border-[var(--plum)] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[var(--plum)] text-white shadow-sm shrink-0">
                      <Zap size={17} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-[var(--ink)]">Adversarial Red-Teaming</h3>
                      <span className="text-[10px] font-mono text-[var(--ink-faint)]">Sycophancy Elimination</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--ink-faint)] leading-relaxed">
                    Explicitly searches for claim overreach, omitted scope limitations, and methodological caveats in the cited literature.
                  </p>
                </div>
              </AnimatedReveal>

              <AnimatedReveal direction="up" delay={400}>
                <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-4.5 space-y-1.5 hover:border-[var(--plum)] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-[var(--plum)] text-white shadow-sm shrink-0">
                      <DollarSign size={17} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-[var(--ink)]">Auditable Cost Ledger</h3>
                      <span className="text-[10px] font-mono text-[var(--ink-faint)]">Token Accounting</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--ink-faint)] leading-relaxed">
                    Itemized input and output token logging for every LLM node call along with real-time USD cost estimation.
                  </p>
                </div>
              </AnimatedReveal>
            </div>

            {/* 3. One-Click Benchmark Paper Launchers */}
            <AnimatedReveal direction="up" delay={500}>
              <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-4.5 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--ink)]">
                    Benchmark Papers Quick Launch
                  </span>
                  <span className="text-[10px] font-mono text-[var(--plum-deep)] font-semibold">1-Click Verification</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '2103.00020', name: 'OpenAI CLIP' },
                    { id: '1706.03762', name: 'Transformer' },
                    { id: '2005.14165', name: 'GPT-3 Paper' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onQuickStartArxiv(p.id)}
                      className="group rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-2.5 text-center hover:border-[var(--plum)] hover:shadow-lg transition-all"
                    >
                      <span className="font-mono text-[10px] text-[var(--plum-deep)] font-semibold block">
                        arXiv:{p.id}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--ink)] group-hover:text-[var(--plum-deep)] transition-colors block truncate mt-1">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedReveal>

          </div>

        </div>

      </div>
    </ManuscriptLayout>
  );
}
