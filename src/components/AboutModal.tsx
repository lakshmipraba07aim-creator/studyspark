'use client';

import React from 'react';
import { X, Sparkles, FileText, Cpu, CheckCircle, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">About StudySpark</h2>
            <p className="text-sm font-medium text-indigo-600">AI-Powered Study Buddy & Quiz Generator</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-slate-600 leading-relaxed">
          <p>
            StudySpark transforms static lecture notes, slides, and PDF documents into high-retention interactive quizzes in seconds.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <FileText className="h-4 w-4 text-indigo-600" />
                Server-Side Extraction
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Parses PDF text streams on the backend, cleans layout noise, and intelligently truncates text for optimal context processing.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Cpu className="h-4 w-4 text-indigo-600" />
                Structured LLM Engine
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Employs structured JSON prompts to generate MCQs with explanations, sample short answers, and targeted topic tagging.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex items-center gap-2 font-semibold text-amber-900">
              <ShieldCheck className="h-4 w-4 text-amber-700" />
              Demo Mode & Reliability
            </div>
            <p className="mt-1 text-xs text-amber-800">
              When an LLM API key (<code className="rounded bg-amber-100 px-1 py-0.5 font-mono">LLM_API_KEY</code>) is not set, StudySpark runs in deterministic Demo Mode using realistic sample lecture notes to guarantee a smooth hackathon demonstration.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
