'use client';

import React, { useState } from 'react';
import { QuizResult } from '@/types/quiz';
import { CheckCircle2, XCircle, ArrowLeft, HelpCircle, Tag, Sparkles } from 'lucide-react';

interface ReviewAnswersProps {
  result: QuizResult;
  onBackToResults: () => void;
}

export const ReviewAnswers: React.FC<ReviewAnswersProps> = ({
  result,
  onBackToResults,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  const filteredResults = result.results.filter(r => {
    if (filter === 'correct') return r.isCorrect;
    if (filter === 'incorrect') return !r.isCorrect;
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div>
          <button
            onClick={onBackToResults}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Score Dashboard
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Review Answers
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {result.quizTitle} • {result.correctAnswers}/{result.totalQuestions} Correct ({result.percentage}%)
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({result.results.length})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'correct' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Correct ({result.correctAnswers})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === 'incorrect' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Incorrect ({result.incorrectAnswers})
          </button>
        </div>
      </div>

      {/* Question Review Cards List */}
      <div className="space-y-6">
        {filteredResults.map((item, idx) => {
          const isCorrect = item.isCorrect;

          return (
            <div
              key={item.questionId}
              className={`rounded-3xl border-2 p-6 sm:p-8 bg-white shadow-md transition-all ${
                isCorrect ? 'border-emerald-200' : 'border-rose-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white ${
                      isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {item.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.topic && (
                    <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-600">
                      {item.topic}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        Incorrect
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
                {item.questionText}
              </h3>

              {/* Answers Comparison */}
              <div className="space-y-3">
                {/* User Answer */}
                <div
                  className={`rounded-2xl border p-4 ${
                    isCorrect
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950'
                      : 'border-rose-200 bg-rose-50/50 text-rose-950'
                  }`}
                >
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Your Answer:
                  </p>
                  <p className="text-sm font-bold">
                    {String(item.userAnswer || '(No answer provided)')}
                  </p>
                </div>

                {/* Correct / Sample Answer (If incorrect) */}
                {!isCorrect && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
                      Correct Answer:
                    </p>
                    <p className="text-sm font-bold">
                      {String(item.correctAnswer)}
                    </p>
                  </div>
                )}
              </div>

              {/* Explanation Box */}
              <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs font-medium text-slate-700 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  Explanation & Concept Insight:
                </div>
                <p>{item.explanation}</p>
                {item.feedback && (
                  <p className="mt-2 text-indigo-800 font-semibold italic border-t border-indigo-200/50 pt-2">
                    Feedback: {item.feedback}
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center pt-4 pb-8">
        <button
          onClick={onBackToResults}
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </button>
      </div>

    </div>
  );
};
