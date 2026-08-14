import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Cpu, CheckCircle2, AlertTriangle, Layers, Search, FileText, Zap, DollarSign, BookOpen } from 'lucide-react';
import { ManuscriptLayout, HighlighterTick, PageTurn, Stagger } from '@/components/cie/Layout';

interface DashboardScreenProps {
  onGetStarted: () => void;
  onQuickStartArxiv: (arxivId: string) => void;
}

export default function DashboardScreen({ onGetStarted, onQuickStartArxiv }: DashboardScreenProps) {
  return (
    <ManuscriptLayout>
      <PageTurn k="dashboard-landing">
        <div className="space-y-16 py-4">
          
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-[var(--paper-deep)] bg-gradient-to-br from-[var(--paper-dim)] via-[var(--paper)] to-[var(--plum-wash)]/40 p-8 md:p-12 shadow-xl">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--plum)]/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#3fb950]/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--plum)]/30 bg-[var(--plum-wash)] px-3.5 py-1 text-xs font-mono font-medium text-[var(--plum-deep)]">
                <Sparkles size={14} className="text-[var(--plum)] animate-pulse" />
                <span>MULTIDISCIPLINARY MANUSCRIPT VERIFICATION ENGINE</span>
              </div>

              <h1 className="font-[var(--font-display)] text-4xl md:text-6xl font-semibold tracking-tight text-[var(--ink)] leading-[1.1]">
                Verify Every Citation with Independent Adversarial AI
                <HighlighterTick color="var(--plum)" />
              </h1>

              <p className="text-base md:text-lg text-[var(--ink-faint)] leading-relaxed">
                Automatically extract manuscript claims, fetch original cited literature across arXiv, PubMed Central, and Tavily, and evaluate entailment with dual Critic & Red-Team LLMs.
              </p>

              {/* Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={onGetStarted}
                  className="group flex items-center gap-3 rounded-2xl bg-[var(--plum)] px-7 py-4 text-sm font-semibold text-white shadow-lg hover:bg-[var(--plum-deep)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <ShieldCheck size={18} />
                  <span>Get Started — Verify Paper</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onQuickStartArxiv('2103.00020')}
                  className="flex items-center gap-2 rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] px-6 py-4 text-sm font-medium text-[var(--ink)] hover:border-[var(--plum)] hover:bg-[var(--paper-dim)] transition-all"
                >
                  <BookOpen size={16} className="text-[var(--plum)]" />
                  <span>Try Demo arXiv (2103.00020)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Platform Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 text-center space-y-1 hover:border-[var(--plum)]/50 transition-colors">
              <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--ink)] block">
                4,850+
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                Papers Evaluated
              </span>
            </div>

            <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 text-center space-y-1 hover:border-[var(--plum)]/50 transition-colors">
              <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--hl-entails)] block">
                94.2%
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                Trust Accuracy
              </span>
            </div>

            <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 text-center space-y-1 hover:border-[var(--plum)]/50 transition-colors">
              <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--ink)] block">
                18,400+
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                Claims Verified
              </span>
            </div>

            <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 text-center space-y-1 hover:border-[var(--plum)]/50 transition-colors">
              <span className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[var(--plum-deep)] block">
                &lt; 15s
              </span>
              <span className="text-xs font-mono text-[var(--ink-faint)] uppercase tracking-wider block">
                Average Pipeline Run
              </span>
            </div>
          </div>

          {/* Interactive 5-Node Agent Graph Flow */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--plum-deep)]">
                State Machine Architecture
              </span>
              <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-semibold text-[var(--ink)]">
                How Citation Verification Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { title: '1. Claim Extractor', desc: 'Parses citation markers [1], [2] & extracts verifiable claims.', icon: FileText },
                { title: '2. Evidence Retriever', desc: 'Queries arXiv, PubMed, and Tavily APIs in parallel.', icon: Search },
                { title: '3. Critic Judge', desc: 'Evaluates claim entailment using GPT-4o / Claude.', icon: Cpu },
                { title: '4. Red-Team Judge', desc: 'Formulates adversarial counter-arguments & edge cases.', icon: AlertTriangle },
                { title: '5. Synthesizer', desc: 'Computes Trust Score (0–100) & Two-Pens highlighter.', icon: CheckCircle2 },
              ].map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <Stagger key={idx} index={idx}>
                    <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-5 space-y-3 shadow-sm hover:-translate-y-1 transition-all h-full flex flex-col justify-between">
                      <div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--plum-wash)] text-[var(--plum-deep)] mb-3">
                          <IconComp size={18} />
                        </div>
                        <h3 className="font-semibold text-sm text-[var(--ink)]">{step.title}</h3>
                        <p className="mt-1 text-xs text-[var(--ink-faint)] leading-relaxed">{step.desc}</p>
                      </div>
                      <div className="text-[10px] font-mono text-[var(--plum)] font-semibold pt-2">
                        Step 0{idx + 1}
                      </div>
                    </div>
                  </Stagger>
                );
              })}
            </div>
          </div>

          {/* Key Platform Features Grid */}
          <div className="space-y-6">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)] border-b border-[var(--paper-deep)] pb-3">
              Engine Capabilities & Integrity Guardrails
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--plum)] text-white">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-[var(--ink)]">Two Pens Highlighter</h3>
                    <span className="text-xs font-mono text-[var(--ink-faint)]">Signature Draw-On Comparison</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                  Underlines agreeing reviewer verdicts in merged green strokes, and renders offset dual strokes when Critic and Red-Team reviewers disagree on source interpretation.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--plum)] text-white">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-[var(--ink)]">Adversarial Red-Teaming</h3>
                    <span className="text-xs font-mono text-[var(--ink-faint)]">Sycophancy Elimination</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                  Red-Team agent is explicitly prompted to search for overreach, omitted scope limitations, and methodological caveats in the cited literature.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--plum)] text-white">
                    <Search size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-[var(--ink)]">Multi-Source Paper Search</h3>
                    <span className="text-xs font-mono text-[var(--ink-faint)]">arXiv • PubMed Central • Tavily</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                  Chains arXiv API, NCBI PubMed Central open-access database, and Tavily academic search to retrieve full source passages.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--plum)] text-white">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-[var(--ink)]">Auditable Cost Ledger</h3>
                    <span className="text-xs font-mono text-[var(--ink-faint)]">Token Accounting</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                  Track exact input and output token consumption for every LLM node execution along with itemized USD cost estimation.
                </p>
              </div>
            </div>
          </div>

          {/* Quick-Start Benchmark Papers Showcase */}
          <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
                  Try Benchmark Papers with One Click
                </h3>
                <p className="text-xs text-[var(--ink-faint)] font-mono mt-0.5">
                  Launch verification pipelines for well-known AI publications
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
                  className="group rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-5 text-left hover:border-[var(--plum)] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
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
      </PageTurn>
    </ManuscriptLayout>
  );
}
