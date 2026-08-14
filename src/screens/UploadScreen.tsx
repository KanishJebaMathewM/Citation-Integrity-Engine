import React, { useState } from 'react';
import { UploadCloud, FileText, Search, ShieldCheck, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
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
    <ManuscriptLayout
      rail={
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
              Verification Pipeline
            </h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2 text-[var(--ink)]">
                <CheckCircle2 size={16} className="mt-0.5 text-[var(--hl-entails)] shrink-0" />
                <span>PDF / arXiv Claim Extraction</span>
              </li>
              <li className="flex items-start gap-2 text-[var(--ink)]">
                <CheckCircle2 size={16} className="mt-0.5 text-[var(--hl-entails)] shrink-0" />
                <span>Source Passage Retrieval</span>
              </li>
              <li className="flex items-start gap-2 text-[var(--ink)]">
                <CheckCircle2 size={16} className="mt-0.5 text-[var(--hl-entails)] shrink-0" />
                <span>Adversarial Dual-Review (Critic & Red-Team)</span>
              </li>
              <li className="flex items-start gap-2 text-[var(--ink)]">
                <CheckCircle2 size={16} className="mt-0.5 text-[var(--hl-entails)] shrink-0" />
                <span>Highlighter Stroke Resolution</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-[var(--paper-deep)] pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
              Two Pens Methodology
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ink-faint)]">
              The Critic checks if evidence entails the claim. The Red-Team aggressively checks for overstatements or misattributions.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Header Title */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--plum)]/30 bg-[var(--plum-wash)] px-3 py-1 text-xs font-semibold text-[var(--plum-deep)]">
            <ShieldCheck size={14} />
            <span>Citation Integrity Engine</span>
          </div>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl md:text-5xl font-semibold tracking-tight text-[var(--ink)]">
            Does the source <span className="underline decoration-[var(--hl-entails)] decoration-4 underline-offset-4">actually support</span> the claim?
          </h1>
          <p className="mt-4 text-base text-[var(--ink-faint)] leading-relaxed">
            Upload a research paper or provide an arXiv ID to extract citations and verify claims with independent Critic and Red-Team verification agents.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-6 md:p-8 shadow-sm">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setInputType('pdf')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                inputType === 'pdf'
                  ? 'bg-[var(--plum)] text-white shadow-sm'
                  : 'border border-[var(--paper-deep)] bg-[var(--paper)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
              }`}
            >
              <FileText size={16} />
              Upload Manuscript PDF
            </button>
            <button
              type="button"
              onClick={() => setInputType('arxiv_id')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                inputType === 'arxiv_id'
                  ? 'bg-[var(--plum)] text-white shadow-sm'
                  : 'border border-[var(--paper-deep)] bg-[var(--paper)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
              }`}
            >
              <Search size={16} />
              arXiv Paper ID
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {inputType === 'pdf' ? (
              <div className="relative rounded-lg border-2 border-dashed border-[var(--paper-deep)] bg-[var(--paper)] p-8 text-center hover:border-[var(--plum)] transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer block">
                  <UploadCloud size={40} className="mx-auto text-[var(--plum)] mb-3" />
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {file ? file.name : 'Click to select or drag PDF file here'}
                  </p>
                  <p className="mt-1 text-xs text-[var(--ink-faint)]">
                    Research paper PDF up to 25MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
                  arXiv Identifier
                </label>
                <input
                  type="text"
                  value={arxivId}
                  onChange={(e) => setArxivId(e.target.value)}
                  placeholder="e.g. 1706.03762 or 2005.14165"
                  className="w-full rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] px-4 py-3 font-mono text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--plum)]"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--plum)] py-3.5 px-6 text-sm font-medium text-white shadow transition-transform hover:-translate-y-0.5 hover:bg-[var(--plum-deep)] disabled:opacity-50"
            >
              {isSubmitting ? 'Starting Agent Pipeline...' : 'Run Citation Integrity Verification'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Preset Sample Papers */}
          <div className="mt-8 border-t border-[var(--paper-deep)] pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)] mb-3">
              Sample Verification Papers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSampleSelect('1706.03762')}
                className="rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-3 text-left hover:border-[var(--plum)] transition-colors"
              >
                <div className="text-xs font-semibold text-[var(--ink)]">Attention Is All You Need</div>
                <div className="mt-1 font-mono text-[11px] text-[var(--ink-faint)]">arXiv:1706.03762</div>
              </button>
              <button
                type="button"
                onClick={() => handleSampleSelect('2005.14165')}
                className="rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-3 text-left hover:border-[var(--plum)] transition-colors"
              >
                <div className="text-xs font-semibold text-[var(--ink)]">Language Models Few-Shot</div>
                <div className="mt-1 font-mono text-[11px] text-[var(--ink-faint)]">arXiv:2005.14165</div>
              </button>
              <button
                type="button"
                onClick={() => handleSampleSelect('1810.04805')}
                className="rounded-lg border border-[var(--paper-deep)] bg-[var(--paper)] p-3 text-left hover:border-[var(--plum)] transition-colors"
              >
                <div className="text-xs font-semibold text-[var(--ink)]">BERT NLP Pre-training</div>
                <div className="mt-1 font-mono text-[11px] text-[var(--ink-faint)]">arXiv:1810.04805</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ManuscriptLayout>
  );
}
