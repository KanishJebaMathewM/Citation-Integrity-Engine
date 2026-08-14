import React, { useState } from 'react';
import { UploadCloud, FileText, Search, ShieldCheck, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { createRun } from '../api/client';

export default function UploadScreen({ onRunStarted }) {
  const [inputType, setInputType] = useState('pdf');
  const [arxivId, setArxivId] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
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
        formData.append('arxiv_id', '1706.03762'); // default sample paper
      }

      const data = await createRun(formData);
      onRunStarted(data.run_id);
    } catch (err) {
      alert(err.message || 'Failed to start run');
      setIsSubmitting(false);
    }
  };

  const handleSampleSelect = (sampleId) => {
    setInputType('arxiv_id');
    setArxivId(sampleId);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          Adversarial Multi-Agent Citation Integrity Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Does the source <span className="gradient-text">actually support</span> the claim?
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          CIE goes beyond reference checking. Using an explicit LangGraph state machine, independent 
          <span className="text-indigo-300 font-semibold"> Critic</span> and 
          <span className="text-amber-300 font-semibold"> Red-Team agents</span> cross-examine cited passages for semantic entailment and overstatement.
        </p>
      </div>

      {/* Upload Form Box */}
      <div className="glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl relative">
        <div className="flex justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => setInputType('pdf')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
              inputType === 'pdf'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Upload PDF Paper
          </button>
          <button
            type="button"
            onClick={() => setInputType('arxiv_id')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
              inputType === 'arxiv_id'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            arXiv Article ID
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputType === 'pdf' ? (
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-950/40">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer block">
                <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-200">
                  {file ? file.name : 'Click to upload or drag & drop PDF'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Research papers, preprints, manuscripts up to 25MB</p>
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                arXiv Article Identifier / URL
              </label>
              <input
                type="text"
                value={arxivId}
                onChange={(e) => setArxivId(e.target.value)}
                placeholder="e.g. 1706.03762 or 2005.14165"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 text-base"
          >
            {isSubmitting ? 'Initializing Agent Pipeline...' : 'Run Citation Integrity Verification'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Demo Curated Sample Papers */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Evaluation Papers (Pre-configured for Hackathon Demo)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleSampleSelect('1706.03762')}
              className="text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all text-xs"
            >
              <div className="font-semibold text-slate-200">Attention Is All You Need</div>
              <div className="text-slate-500 mt-1">arXiv:1706.03762</div>
            </button>
            <button
              onClick={() => handleSampleSelect('2005.14165')}
              className="text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all text-xs"
            >
              <div className="font-semibold text-slate-200">Language Models are Few-Shot</div>
              <div className="text-slate-500 mt-1">arXiv:2005.14165</div>
            </button>
            <button
              onClick={() => handleSampleSelect('1810.04805')}
              className="text-left p-3 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all text-xs"
            >
              <div className="font-semibold text-slate-200">BERT Pre-training for NLP</div>
              <div className="text-slate-500 mt-1">arXiv:1810.04805</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
