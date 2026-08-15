import React, { useState } from 'react';
import { UploadCloud, FileText, Search, ShieldCheck, ArrowRight, CheckCircle2, DollarSign, Layers, Sparkles } from 'lucide-react';
import { createRun } from '@/api/client';
import { HighlighterTick, ManuscriptLayout } from '@/components/cie/Layout';

interface UploadScreenProps {
  onRunStarted: (runId: string) => void;
}

export default function UploadScreen({ onRunStarted }: UploadScreenProps) {
  const [inputType, setInputType] = useState<'pdf' | 'arxiv_id'>('pdf');
  const [arxivId, setArxivId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('input_type', inputType);
      if (inputType === 'arxiv_id') {
        formData.append('arxiv_id', arxivId || '1706.03762');
      } else if (file) {
        formData.append('file', file);
      } else {
        formData.append('arxiv_id', '1706.03762');
      }

      const data = await createRun(formData);
      onRunStarted(data.run_id);
    } catch (err: any) {
      alert(err.message || 'Failed to start run');
      setIsSubmitting(false);
    }
  };

  const handleSampleSelect = (sampleId: string) => {
    setInputType('arxiv_id');
    setArxivId(sampleId);
  };

  return (
    <ManuscriptLayout fullWidth={true}>
      <div className="space-y-6 w-full overflow-hidden">
        
        {/* MAIN SPLIT WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          
          {/* LEFT 7 COLS: Hero & Input Card */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-7 md:p-10 shadow-md space-y-6">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--paper-deep)] bg-[var(--paper)] px-3.5 py-1 text-xs font-mono font-medium text-[var(--plum)] shadow-xs">
                <Sparkles size={14} className="text-[var(--plum)]" />
                <span>MANUSCRIPT CITATION VERIFICATION</span>
              </div>

              <h1 className="font-[var(--font-display)] text-3xl md:text-5xl font-semibold tracking-tight text-[var(--ink)] leading-snug">
                Does the cited source <span className="underline decoration-[var(--hl-entails)] decoration-4 underline-offset-4">actually support</span> the claim?
                <HighlighterTick color="var(--plum)" />
              </h1>

              <p className="text-sm md:text-base text-[var(--ink-faint)] leading-relaxed">
                Upload a manuscript PDF or enter an arXiv ID. The engine parses citations and triggers independent Critic & Red-Team verification agents.
              </p>
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleSubmit} className="space-y-5 border-t border-[var(--paper-deep)] pt-6">
              
              {/* Mode Tabs */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setInputType('pdf')}
                  className={`flex items-center gap-2 rounded-xl px-4.5 py-2.5 text-xs font-semibold transition-all ${
                    inputType === 'pdf'
                      ? 'bg-[var(--plum)] text-[var(--paper)] shadow-md'
                      : 'border border-[var(--paper-deep)] bg-[var(--paper)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
                  }`}
                >
                  <FileText size={15} />
                  Upload Manuscript PDF
                </button>

                <button
                  type="button"
                  onClick={() => setInputType('arxiv_id')}
                  className={`flex items-center gap-2 rounded-xl px-4.5 py-2.5 text-xs font-semibold transition-all ${
                    inputType === 'arxiv_id'
                      ? 'bg-[var(--plum)] text-[var(--paper)] shadow-md'
                      : 'border border-[var(--paper-deep)] bg-[var(--paper)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Search size={15} />
                  arXiv Paper ID
                </button>
              </div>

              {/* Upload Dropzone or Input */}
              {inputType === 'pdf' ? (
                <div
                  className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer group ${
                    isDragging
                      ? 'border-[var(--plum)] bg-[var(--plum-wash)] scale-[1.01]'
                      : 'border-[var(--paper-deep)] bg-[var(--paper)] hover:border-[var(--plum)]'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const dropped = e.dataTransfer.files?.[0];
                    if (dropped && dropped.type === 'application/pdf') setFile(dropped);
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer block space-y-2">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl mx-auto transition-transform ${
                      isDragging ? 'bg-[var(--plum)] text-white scale-110' : 'bg-[var(--plum-wash)] text-[var(--plum)] group-hover:scale-105'
                    }`}>
                      <UploadCloud size={22} />
                    </div>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {file ? file.name : isDragging ? 'Drop your PDF here...' : 'Click to select or drag manuscript PDF here'}
                    </p>
                    <p className="text-xs font-mono text-[var(--ink-faint)]">
                      PDF files up to 25MB supported • Auto-citation parsing
                    </p>
                  </label>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
                    arXiv Paper Identifier
                  </label>
                  <input
                    type="text"
                    value={arxivId}
                    onChange={(e) => setArxivId(e.target.value)}
                    placeholder="e.g. 1706.03762 or 2103.00020"
                    className="w-full rounded-xl border border-[var(--paper-deep)] bg-[var(--paper)] px-4 py-3.5 font-mono text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--plum)]"
                  />
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--plum)] py-4 px-6 text-sm font-semibold text-[var(--paper)] shadow-lg transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              >
                <ShieldCheck size={18} />
                <span>{isSubmitting ? 'Starting Agent Pipeline...' : 'Run Citation Integrity Verification'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Presets Footer */}
            <div className="border-t border-[var(--paper-deep)] pt-5 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--ink-faint)] block">
                Quick-Launch Benchmark Papers
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: '1706.03762', name: 'Attention Is All You Need' },
                  { id: '2005.14165', name: 'Language Models Few-Shot' },
                  { id: '1810.04805', name: 'BERT NLP Pre-training' }
                ].map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSampleSelect(sample.id)}
                    className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper)] p-3 text-left hover:border-[var(--plum)] hover:shadow-xs transition-all space-y-1"
                  >
                    <div className="text-xs font-semibold text-[var(--ink)] truncate">{sample.name}</div>
                    <div className="font-mono text-[11px] text-[var(--plum)]">arXiv:{sample.id}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: Pipeline Specifications & Methodology */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Verification Pipeline Card */}
            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[var(--paper-deep)] pb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--plum)]">
                  VERIFICATION PIPELINE
                </span>
                <span className="text-[11px] font-mono text-[var(--hl-entails)] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Active
                </span>
              </div>

              <ul className="space-y-3.5 text-xs">
                <li className="flex items-start gap-3 text-[var(--ink)]">
                  <CheckCircle2 size={16} className="mt-0.5 text-[var(--hl-entails)] shrink-0" />
                  <div>
                    <span className="font-semibold block">PDF / arXiv Citation Extraction</span>
                    <span className="text-[11px] text-[var(--ink-faint)] font-mono">Parses claims & citation markers [1], [2]</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-[var(--ink)]">
                  <CheckCircle2 size={16} className="mt-0.5 text-[var(--hl-entails)] shrink-0" />
                  <div>
                    <span className="font-semibold block">Source Passage Retrieval</span>
                    <span className="text-[11px] text-[var(--ink-faint)] font-mono">Queries arXiv, PubMed & Tavily search</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-[var(--ink)]">
                  <CheckCircle2 size={16} className="mt-0.5 text-[var(--hl-entails)] shrink-0" />
                  <div>
                    <span className="font-semibold block">Adversarial Dual-Review (Critic & Red-Team)</span>
                    <span className="text-[11px] text-[var(--ink-faint)] font-mono">Evaluates entailment vs claim overreach</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-[var(--ink)]">
                  <CheckCircle2 size={16} className="mt-0.5 text-[var(--hl-entails)] shrink-0" />
                  <div>
                    <span className="font-semibold block">Highlighter Stroke Resolution</span>
                    <span className="text-[11px] text-[var(--ink-faint)] font-mono">Computes Two Pens stroke highlights & score</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Methodology Card */}
            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                <Layers size={16} className="text-[var(--plum)]" />
                <span>Two Pens Methodology</span>
              </div>
              <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                The Critic checks if cited evidence entails the claim. The Red-Team aggressively searches for overstatements or misattributions.
              </p>
            </div>

            {/* Cost Preview Card */}
            <div className="rounded-3xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--ink)]">
                <DollarSign size={16} className="text-[var(--plum)]" />
                <span>Real-Time Cost Accounting</span>
              </div>
              <p className="text-xs text-[var(--ink-faint)] leading-relaxed">
                Tracks exact token usage across GPT-4o / Claude LLM calls with itemized USD cost estimation per run.
              </p>
            </div>

          </div>

        </div>

      </div>
    </ManuscriptLayout>
  );
}
