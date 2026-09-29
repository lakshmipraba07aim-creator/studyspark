'use client';

import React from 'react';
import { Question } from '@/types/quiz';
import { Check, HelpCircle } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | number>;
  onSelectIndex: (idx: number) => void;
  onSubmit: () => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectIndex,
  onSubmit,
}) => {
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Question Navigator
        </h3>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          {answeredCount}/{questions.length} Answered
        </span>
      </div>

      {/* Grid of Numbered Pills */}
      <div className="grid grid-cols-5 gap-2.5">
        {questions.map((q, idx) => {
          const isCurrent = currentIndex === idx;
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';

          return (
            <button
              key={q.id}
              onClick={() => onSelectIndex(idx)}
              className={`relative flex h-11 w-full items-center justify-center rounded-xl text-xs font-bold transition-all ${
                isCurrent
                  ? 'border-2 border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : isAnswered
                  ? 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  : 'border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span>{idx + 1}</span>
              {isAnswered && !isCurrent && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-white text-[9px]">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[11px] font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-100 border border-indigo-300" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span>Unanswered</span>
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full rounded-xl border border-indigo-600 py-3 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
      >
        Finish & Submit
      </button>
    </div>
  );
};
