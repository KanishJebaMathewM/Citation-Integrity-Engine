import React, { useState, useEffect } from 'react';
import { Key, X, Check, Shield, ExternalLink, Cpu } from 'lucide-react';
import { toast } from 'sonner';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiSettingsModal({ isOpen, onClose }: ApiSettingsModalProps) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');

  useEffect(() => {
    const savedOpenAI = localStorage.getItem('cie_openai_key') || '';
    const savedGemini = localStorage.getItem('cie_gemini_key') || '';
    const savedProvider = (localStorage.getItem('cie_provider') as 'openai' | 'gemini') || 'openai';

    setOpenaiKey(savedOpenAI);
    setGeminiKey(savedGemini);
    setProvider(savedProvider);
  }, []);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cie_openai_key', openaiKey);
    localStorage.setItem('cie_gemini_key', geminiKey);
    localStorage.setItem('cie_provider', provider);
    toast.success('API Key settings saved locally!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-rise">
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--paper-deep)] bg-[var(--paper)] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--paper-deep)] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--plum-wash)] text-[var(--plum-deep)]">
              <Key size={20} />
            </div>
            <div>
              <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
                LLM Provider API Keys
              </h2>
              <p className="text-xs font-mono text-[var(--ink-faint)]">
                Configure OpenAI GPT-4o or Google Gemini model keys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--ink-faint)] hover:bg-[var(--paper-dim)] hover:text-[var(--ink)]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Provider Choice */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)] mb-2">
              Preferred LLM Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium border transition-all ${
                  provider === 'openai'
                    ? 'border-[var(--plum)] bg-[var(--plum-wash)] text-[var(--plum-deep)] font-semibold shadow-sm'
                    : 'border-[var(--paper-deep)] bg-[var(--paper-dim)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
                }`}
              >
                <Cpu size={16} />
                <span>OpenAI (GPT-4o)</span>
              </button>
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium border transition-all ${
                  provider === 'gemini'
                    ? 'border-[var(--plum)] bg-[var(--plum-wash)] text-[var(--plum-deep)] font-semibold shadow-sm'
                    : 'border-[var(--paper-deep)] bg-[var(--paper-dim)] text-[var(--ink-faint)] hover:text-[var(--ink)]'
                }`}
              >
                <Shield size={16} />
                <span>Google Gemini</span>
              </button>
            </div>
          </div>

          {/* OpenAI Key Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
                OpenAI API Key (sk-...)
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--plum)] hover:underline"
              >
                Get Key <ExternalLink size={12} />
              </a>
            </div>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] px-4 py-2.5 font-mono text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--plum)]"
            />
          </div>

          {/* Gemini Key Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-faint)]">
                Google Gemini API Key (AIzaSy...)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--plum)] hover:underline"
              >
                Get Key <ExternalLink size={12} />
              </a>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] px-4 py-2.5 font-mono text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--plum)]"
            />
          </div>

          <div className="rounded-xl border border-[var(--paper-deep)] bg-[var(--paper-dim)] p-3 text-[11px] font-mono text-[var(--ink-faint)] leading-relaxed">
            💡 Keys can also be added directly to your environment as <code className="text-[var(--plum-deep)]">OPENAI_API_KEY</code> or <code className="text-[var(--plum-deep)]">GEMINI_API_KEY</code> in <code className="text-[var(--ink)]">.env</code>.
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--paper-deep)] px-4 py-2 text-xs font-medium text-[var(--ink-faint)] hover:bg-[var(--paper-dim)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[var(--plum)] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[var(--plum-deep)] transition-colors"
            >
              <Check size={14} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
