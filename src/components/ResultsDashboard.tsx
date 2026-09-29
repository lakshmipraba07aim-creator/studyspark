'use client';

import React from 'react';
import Link from 'next/link';
import { QuizResult } from '@/types/quiz';
import { Award, CheckCircle2, XCircle, HelpCircle, Clock, Sparkles, RotateCcw, Plus, ArrowRight, BrainCircuit } from 'lucide-react';

interface ResultsDashboardProps {
  result: QuizResult;
  onRetake: () => void;
  onReview: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onRetake,
  onReview,
}) => {
  const {
    quizTitle,
    percentage,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    totalQuestions,
    timeTakenSeconds,
    topicPerformance,
    aiStudyInsight,
    isDemo,
  } = result;

  const minutes = Math.floor(timeTakenSeconds / 60);
  const seconds = timeTakenSeconds % 60;
  const timeString = `${minutes}m ${seconds}s`;

  // Radial SVG calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let motivationText = 'Great effort! Keep reviewing your weak spots to master this material.';
  if (percentage >= 90) {
    motivationText = 'Outstanding! You demonstrate exceptional mastery of these lecture concepts.';
  } else if (percentage >= 75) {
    motivationText = "Nice work! You've got a solid understanding of the material.";
  } else if (percentage >= 50) {
    motivationText = 'Good foundation! Review the missed questions below to solidify your knowledge.';
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      
      {/* Hero Result Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-xl text-center space-y-6">
        
        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-sparkle" />
          <span>Quiz Complete!</span>
          {isDemo && <span className="text-amber-700 font-black">• Demo Mode</span>}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {quizTitle}
        </h1>

        {/* Circular Progress Radial Score */}
        <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-slate-100"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-indigo-600 transition-all duration-1000 ease-out"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900">{percentage}%</span>
            <span className="text-xs font-bold text-slate-500">
              {correctAnswers} / {totalQuestions} Correct
            </span>
          </div>
        </div>

        <p className="text-sm sm:text-base font-semibold text-slate-700 max-w-lg mx-auto">
          {motivationText}
        </p>

        {/* Stats Grid Pills */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 border-t border-slate-100">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Correct</span>
            </div>
            <p className="mt-1 text-xl font-extrabold text-emerald-950">{correctAnswers}</p>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3.5">
            <div className="flex items-center justify-center gap-1.5 text-rose-700 text-xs font-bold">
              <XCircle className="h-4 w-4" />
              <span>Incorrect</span>
            </div>
            <p className="mt-1 text-xl font-extrabold text-rose-950">{incorrectAnswers}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-center justify-center gap-1.5 text-slate-600 text-xs font-bold">
              <HelpCircle className="h-4 w-4" />
              <span>Unanswered</span>
            </div>
            <p className="mt-1 text-xl font-extrabold text-slate-900">{unanswered}</p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5">
            <div className="flex items-center justify-center gap-1.5 text-indigo-700 text-xs font-bold">
              <Clock className="h-4 w-4" />
              <span>Time Taken</span>
            </div>
            <p className="mt-1 text-xl font-extrabold text-indigo-950">{timeString}</p>
          </div>
        </div>

      </div>

      {/* AI Study Insight Card */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
          <BrainCircuit className="h-4 w-4 text-spark-purple animate-pulse" />
          AI Study Insight
        </div>
        <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
          {aiStudyInsight}
        </p>
      </div>

      {/* Topic Performance Breakdown */}
      {topicPerformance && topicPerformance.length > 0 && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md space-y-6">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Topic Breakdown
          </h3>
          <div className="space-y-4">
            {topicPerformance.map((tp, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{tp.topic}</span>
                  <span className="text-indigo-600">{tp.percentage}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                    style={{ width: `${tp.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onReview}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
        >
          <span>Review Answers</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          onClick={onRetake}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-base font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
        >
          <RotateCcw className="h-4 w-4 text-indigo-600" />
          <span>Try Again</span>
        </button>

        <Link
          href="/upload"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-base font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
        >
          <Plus className="h-4 w-4 text-indigo-600" />
          <span>Create New Quiz</span>
        </Link>
      </div>

    </div>
  );
};
