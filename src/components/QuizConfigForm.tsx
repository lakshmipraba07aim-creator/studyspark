'use client';

import React from 'react';
import { QuizConfig, QuestionType, Difficulty } from '@/types/quiz';
import { Sparkles, Sliders, Target, HelpCircle } from 'lucide-react';

interface QuizConfigFormProps {
  config: QuizConfig;
  onChange: (updated: QuizConfig) => void;
  onSubmit: () => void;
  isGenerating?: boolean;
}

export const QuizConfigForm: React.FC<QuizConfigFormProps> = ({
  config,
  onChange,
  onSubmit,
  isGenerating = false,
}) => {
  const questionCountOptions = [5, 10, 15, 20];
  const difficultyOptions: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  const handleTypeToggle = (type: QuestionType) => {
    let updatedTypes = [...config.questionTypes];
    if (updatedTypes.includes(type)) {
      // Must keep at least one type
      if (updatedTypes.length > 1) {
        updatedTypes = updatedTypes.filter(t => t !== type);
      }
    } else {
      updatedTypes.push(type);
    }
    onChange({ ...config, questionTypes: updatedTypes });
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <Sliders className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-900">Quiz Preferences</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Number of Questions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-2">
            {questionCountOptions.map(count => (
              <button
                key={count}
                type="button"
                onClick={() => onChange({ ...config, numberOfQuestions: count })}
                className={`rounded-xl py-2.5 text-sm font-bold transition-all ${
                  config.numberOfQuestions === count
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {difficultyOptions.map(diff => (
              <button
                key={diff}
                type="button"
                onClick={() => onChange({ ...config, difficulty: diff })}
                className={`rounded-xl py-2.5 text-sm font-bold transition-all ${
                  config.difficulty === diff
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question Types */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Question Types
        </label>
        <div className="flex flex-wrap gap-4">
          <label
            className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer text-sm font-semibold transition-all ${
              config.questionTypes.includes('mcq')
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <input
              type="checkbox"
              checked={config.questionTypes.includes('mcq')}
              onChange={() => handleTypeToggle('mcq')}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Multiple Choice (MCQ)</span>
          </label>

          <label
            className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer text-sm font-semibold transition-all ${
              config.questionTypes.includes('short_answer')
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <input
              type="checkbox"
              checked={config.questionTypes.includes('short_answer')}
              onChange={() => handleTypeToggle('short_answer')}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Short Answer</span>
          </label>
        </div>
      </div>

      {/* Optional Focus Topic */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Focus Topic (Optional)
          </label>
          <span className="text-[11px] font-medium text-slate-400">e.g., Neural Networks & Backpropagation</span>
        </div>
        <div className="relative">
          <Target className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={config.focusTopic || ''}
            onChange={(e) => onChange({ ...config, focusTopic: e.target.value })}
            placeholder="Specify key concepts to prioritize..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      {/* Submit CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:scale-[0.99] disabled:opacity-60"
        >
          <Sparkles className="h-5 w-5 animate-sparkle" />
          <span>{isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}</span>
        </button>
      </div>
    </div>
  );
};
