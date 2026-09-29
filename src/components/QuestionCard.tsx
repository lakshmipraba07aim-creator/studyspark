'use client';

import React, { useEffect } from 'react';
import { Question, MCQQuestion, ShortAnswerQuestion } from '@/types/quiz';
import { Check, HelpCircle, ArrowLeft, ArrowRight, Send, Tag, Keyboard } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer: string | number | undefined;
  onAnswerSelect: (answer: string | number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onAnswerSelect,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  const isFinal = questionNumber === totalQuestions;

  // Keyboard shortcut listener for MCQ options (A/B/C/D or 1/2/3/4)
  useEffect(() => {
    if (question.type !== 'mcq') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const key = e.key.toUpperCase();
      if (['A', '1'].includes(key)) onAnswerSelect(0);
      else if (['B', '2'].includes(key)) onAnswerSelect(1);
      else if (['C', '3'].includes(key)) onAnswerSelect(2);
      else if (['D', '4'].includes(key)) onAnswerSelect(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, onAnswerSelect]);

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md space-y-6 animate-fade-in">
      
      {/* Question Header & Topic Pill */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-xs">
            {questionNumber}
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {question.type === 'mcq' ? 'Multiple Choice Question' : 'Short Answer Question'}
          </span>
        </div>

        {question.topic && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            <Tag className="h-3 w-3 text-indigo-500" />
            {question.topic}
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
        {question.question}
      </h2>

      {/* MCQ Answer Cards */}
      {question.type === 'mcq' ? (
        <div className="grid grid-cols-1 gap-3.5 pt-2">
          {(question as MCQQuestion).options.map((optionText, idx) => {
            const isSelected = currentAnswer === idx;
            const letter = optionLabels[idx] || `${idx + 1}`;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onAnswerSelect(idx)}
                className={`group relative flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-md shadow-indigo-100'
                    : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Option Badge */}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600'
                    }`}
                  >
                    {letter}
                  </span>

                  {/* Option Label */}
                  <span className={`text-sm font-semibold sm:text-base ${isSelected ? 'text-indigo-950 font-bold' : 'text-slate-800'}`}>
                    {optionText}
                  </span>
                </div>

                {/* Selection Radio Circle */}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
                </div>
              </button>
            );
          })}

          <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-400 font-medium justify-end">
            <Keyboard className="h-3.5 w-3.5 text-slate-400" />
            <span>Tip: Press A, B, C, D on keyboard to select answer</span>
          </div>
        </div>
      ) : (
        /* Short Answer Input */
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Your Answer
          </label>
          <textarea
            rows={5}
            value={typeof currentAnswer === 'string' ? currentAnswer : ''}
            onChange={(e) => onAnswerSelect(e.target.value)}
            placeholder="Type your explanation here. Focus on core principles and keywords..."
            className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
          />
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
            <span>Minimum 1-2 detailed sentences recommended</span>
            <span>
              {typeof currentAnswer === 'string' ? currentAnswer.trim().split(/\s+/).filter(Boolean).length : 0} words
            </span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrevious}
          disabled={questionNumber === 1}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        {!isFinal ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-spark-purple px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:opacity-95 active:scale-95"
          >
            <Send className="h-4 w-4" />
            Submit Quiz
          </button>
        )}
      </div>

    </div>
  );
};
