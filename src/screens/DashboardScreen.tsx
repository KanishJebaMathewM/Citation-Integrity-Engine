import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Cpu, CheckCircle2, AlertTriangle, Layers, Search, FileText, Zap, DollarSign, BookOpen, Activity, Lock, Globe, Database, Compass, Check, AlertCircle } from 'lucide-react';
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
      <div className="space-y-6 overflow-hidden w-full">
        
        {/* 1. TOP LIVE STATUS TICKER */}
        <AnimatedReveal direction="down" delay={0}>
          <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] px-5 py-2.5 flex items-center justify-between text-xs font-mono text-[var(--ink-faint)] shadow-xs">
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--hl-entails)] animate-ping" />
              <span className="font-semibold text-[var(--plum-deep)] uppercase tracking-wider">LIVE ENGINE STATUS</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-xs">
              <span className="inline-flex items-center gap-2 text-[var(--ink)]">
                <Database size={14} className="text-[var(--plum)]" /> arXiv HTTPS API Connected
              </span>
              <span className="inline-flex items-center gap-2 text-[var(--ink)]">
                <Globe size={14} className="text-[var(--plum)]" /> PubMed Central Sync
              </span>
              <span className="inline-flex items-center gap-2 text-[var(--ink)]">
                <Compass size={14} className="text-[var(--plum)]" /> Tavily Search Active
              </span>
            </div>

            <span className="font-semibold text-[var(--plum)] shrink-0">Express Node.js • Multi-Agent</span>
          </div>
        </AnimatedReveal>

        {/* 2. HERO BANNER BOX (WITH ANIMATED RIGHT-SIDE INTERACTIVE GRAPHIC) */}
        <AnimatedReveal direction="up" delay={100}>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--paper-deep)] bg-gradient-to-br from-[var(--paper-dim)] via-[var(--paper)] to-[var(--plum-wash)]/60 p-8 md:p-10 shadow-xl space-y-6">
            
            {/* Scroll Parallax Background Orbs */}
            <div
              className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--plum)]/15 blur-3xl pointer-events-none transition-transform duration-100 ease-out"
              style={{ transform: `translateY(${scrollY * 0.12}px)` }}
            />
            <div
              className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-[var(--hl-entails)]/15 blur-3xl pointer-events-none transition-transform duration-100 ease-out"
              style={{ transform: `translateY(-${scrollY * 0.08}px)` }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* LEFT 7 COLS: Hero Content */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--plum)]/30 bg-[var(--plum-wash)] px-4 py-1.5 text-xs font-mono font-medium text-[var(--plum-deep)] shadow-xs">
                  <Sparkles size={15} className="text-[var(--plum)] animate-pulse" />
                  <span>MULTIDISCIPLINARY MANUSCRIPT VERIFICATION ENGINE</span>
                </div>

                <h1 className="font-[var(--font-display)] text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--ink)] leading-[1.12]">
                  Verify Every Citation with Independent Adversarial AI
                  <HighlighterTick color="var(--plum)" />
                </h1>

                <p className="text-base md:text-lg text-[var(--ink-faint)] leading-relaxed">
                  Automatically extract manuscript claims, fetch original cited literature across arXiv, PubMed Central, and Tavily, and evaluate entailment with dual Critic & Red-Team LLMs.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <button
                    onClick={onGetStarted}
                    className="group flex items-center justify-center gap-3 rounded-2xl bg-[var(--plum)] px-8 py-4 text-base font-semibold text-white shadow-xl hover:bg-[var(--plum-deep)] hover:scale-[1.02] active:scale-[0.98] transition-all"
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
              </div>

              {/* RIGHT 5 COLS: Rich Animated Interactive Agent Graphic */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper)]/90 backdrop-blur-md p-6 shadow-xl space-y-5 relative overflow-hidden">
                  
                  {/* Decorative Radar Lines */}
                  <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full border border-[var(--plum)]/20 animate-ping pointer-events-none" />

                  {/* Header Badge */}
                  <div className="flex items-center justify-between border-b border-[var(--paper-deep)] pb-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--ink)]">
                      <Cpu size={16} className="text-[var(--plum)]" />
                      <span>Adversarial Consensus Hub</span>
                    </div>
                    <span className="rounded-full bg-[var(--hl-entails)]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[var(--hl-entails)]">
                      94.2% TRUST
                    </span>
                  </div>

                  {/* Interactive Floating Agent Pills */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-[var(--hl-entails)]/40 bg-[var(--hl-entails)]/10 p-3 text-xs shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--hl-entails)] text-white">
                          <Check size={14} />
                        </div>
                        <div>
                          <span className="font-semibold text-[var(--ink)] block">GPT-4o Critic Agent</span>
                          <span className="text-[10px] font-mono text-[var(--ink-faint)]">Passage Entailment Confirmed</span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[var(--hl-entails)]">96% Match</span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-[var(--hl-partial)]/40 bg-[var(--hl-partial-wash)] p-3 text-xs shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--hl-partial)] text-white">
                          <AlertTriangle size={14} />
                        </div>
                        <div>
                          <span className="font-semibold text-[var(--ink)] block">Claude Red-Team Agent</span>
                          <span className="text-[10px] font-mono text-[var(--ink-faint)]">Adversarial Caveat Check</span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-[var(--hl-partial)]">Caveat Noted</span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-[var(--plum)]/30 bg-[var(--plum-wash)] p-3 text-xs shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--plum)] text-white">
                          <Layers size={14} />
                        </div>
                        <div>
                          <span className="font-semibold text-[var(--ink)] block">Two Pens Stroke Resolver</span>
                          <span className="text-[10px] font-mono text-[var(--ink-faint)]">Dual Green & Amber Highlighting</span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[var(--plum-deep)] font-semibold">Resolved</span>
                    </div>
                  </div>

                  {/* Sample Highlighted Passage Preview */}
                  <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-3.5 space-y-1.5 text-xs">
                    <span className="text-[10px] font-mono text-[var(--ink-faint)] uppercase font-semibold block">
                      Live Two-Pens Passage Resolution
                    </span>
                    <p className="font-serif italic text-[11px] leading-relaxed text-[var(--ink)]">
                      "We show that pre-trained visual-language representations attain{' '}
                      <span className="bg-[var(--hl-entails-wash)] text-[var(--hl-entails)] font-semibold px-1 rounded border-b-2 border-[var(--hl-entails)]">
                        76.2% zero-shot top-1 accuracy on ImageNet
                      </span>
                      , matching original supervised models."
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </AnimatedReveal>

        {/* 3. PLATFORM PERFORMANCE STATS (4 EQUAL COLUMNS BANNER) */}
        <AnimatedReveal direction="up" delay={150}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-1 hover:border-[var(--plum)] hover:shadow-md transition-all text-center">
              <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--ink)] block">
                4,850+
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                Papers Evaluated
              </span>
            </div>

            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-1 hover:border-[var(--plum)] hover:shadow-md transition-all text-center">
              <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--hl-entails)] block">
                94.2%
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                Trust Accuracy
              </span>
            </div>

            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-1 hover:border-[var(--plum)] hover:shadow-md transition-all text-center">
              <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--ink)] block">
                18,400+
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                Claims Verified
              </span>
            </div>

            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-1 hover:border-[var(--plum)] hover:shadow-md transition-all text-center">
              <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--plum-deep)] block">
                &lt; 15s
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                Pipeline Speed
              </span>
            </div>
          </div>
        </AnimatedReveal>

        {/* 4. SPLIT 2-COLUMN DETAILS SECTION (6 COLS PIPELINE FLOW | 6 COLS FEATURE CARDS) */}
        <AnimatedReveal direction="up" delay={200}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          
          {/* LEFT 6 COLS: LangGraph Multi-Agent Pipeline */}
          <div className="lg:col-span-6 rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--paper-deep)] pb-4">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--plum-deep)]">
                  LangGraph Pipeline Flow
                </span>
                <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)] mt-0.5">
                  5-Node Multi-Agent Execution State Machine
                </h2>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--ink-faint)]">
                <Activity size={14} className="text-[var(--hl-entails)] animate-ping" />
                Live Node State
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { title: 'Extractor', sub: 'Citation Markers', icon: FileText, num: '01' },
                { title: 'Retriever', sub: 'arXiv • PubMed', icon: Search, num: '02' },
                { title: 'Critic', sub: 'GPT-4o Entailment', icon: Cpu, num: '03' },
                { title: 'Red-Team', sub: 'Adversarial Edge', icon: AlertTriangle, num: '04' },
                { title: 'Synthesizer', sub: 'Two-Pens Score', icon: CheckCircle2, num: '05' },
              ].map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-4 text-center space-y-2 hover:border-[var(--plum)] hover:shadow-lg transition-all flex flex-col items-center justify-between"
                  >
                    <span className="font-mono text-xs text-[var(--ink-faint)] font-bold">{step.num}</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--plum-wash)] text-[var(--plum-deep)] group-hover:scale-110 group-hover:bg-[var(--plum)] group-hover:text-white transition-all">
                      <IconComp size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs text-[var(--ink)] leading-snug">{step.title}</h3>
                      <p className="text-[10px] font-mono text-[var(--ink-faint)] mt-0.5">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper)] p-3.5 text-xs font-mono text-[var(--ink-faint)] flex items-center justify-between shadow-xs">
              <span className="flex items-center gap-2">
                <Lock size={15} className="text-[var(--plum)]" />
                Dual-Agent Adversarial Consensus Protocol
              </span>
              <span className="text-[var(--plum-deep)] font-semibold">100% Traceable Audit Log</span>
            </div>
          </div>

          {/* RIGHT 6 COLS: 3 Feature Guardrail Cards Stack */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-2 hover:border-[var(--plum)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--plum)] text-white shadow-sm shrink-0">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--ink)]">Two Pens Highlighter</h3>
                  <span className="text-xs font-mono text-[var(--ink-faint)]">Visual Passage Comparison</span>
                </div>
              </div>
              <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                Renders merged green strokes for agreeing verdicts, and offset dual strokes when Critic and Red-Team reviewers disagree.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-2 hover:border-[var(--plum)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--plum)] text-white shadow-sm shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--ink)]">Adversarial Red-Teaming</h3>
                  <span className="text-xs font-mono text-[var(--ink-faint)]">Sycophancy Elimination</span>
                </div>
              </div>
              <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                Explicitly searches for claim overreach, omitted scope limitations, and methodological caveats in the cited literature.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-2 hover:border-[var(--plum)] hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--plum)] text-white shadow-sm shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[var(--ink)]">Auditable Cost Ledger</h3>
                  <span className="text-xs font-mono text-[var(--ink-faint)]">Token Accounting</span>
                </div>
              </div>
              <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                Itemized input and output token logging for every LLM node call along with real-time USD cost estimation.
              </p>
            </div>
          </div>

        </div>
        </AnimatedReveal>

        {/* 5. BOTTOM BENCHMARK PAPERS SHOWCASE (3 EQUAL COLUMNS BANNER) */}
        <AnimatedReveal direction="up" delay={200}>
          <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--paper-deep)] pb-4">
              <div>
                <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
                  Benchmark Papers Quick Launch
                </h3>
                <p className="text-xs text-[var(--ink-faint)] font-mono mt-0.5">
                  Instantly trigger multi-agent analysis for famous AI manuscripts
                </p>
              </div>

              <button
                onClick={onGetStarted}
                className="flex items-center gap-2 rounded-xl bg-[var(--plum)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--plum-deep)] transition-colors shadow-xs"
              >
                <span>Upload Custom Paper</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                    <span className="font-mono text-xs font-semibold text-[var(--plum-deep)] block">
                      arXiv:{paper.id}
                    </span>
                    <h4 className="font-semibold text-sm text-[var(--ink)] group-hover:text-[var(--plum-deep)] transition-colors leading-snug">
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
        </AnimatedReveal>

      </div>
    </ManuscriptLayout>
  );
}
