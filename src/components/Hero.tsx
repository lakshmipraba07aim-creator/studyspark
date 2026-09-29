'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, FileText, ArrowRight, CheckCircle2, Play, Award, BrainCircuit, RefreshCw } from 'lucide-react';
import { setActiveQuiz } from '@/lib/storage';
import { DEMO_QUIZ } from '@/lib/demoData';

export const Hero: React.FC = () => {
  const router = useRouter();

  const handleTryDemo = () => {
    // Store demo quiz in active state and launch processing/quiz stream
    setActiveQuiz(DEMO_QUIZ);
    router.push('/processing?demo=true');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background Subtle Gradient Blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-100/60 via-purple-100/40 to-pink-50/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-sparkle" />
              <span>Next-Gen Student Productivity Tool</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
              Turn your notes into a quiz in <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">seconds.</span>
            </h1>

            <p className="text-lg text-slate-600 sm:text-xl max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Upload lecture notes or a PDF and let AI create a personalized quiz for you to test your knowledge, review mistakes, and master your exams.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/upload"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:scale-95"
              >
                <Sparkles className="h-5 w-5" />
                Create a Quiz
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </Link>

              <button
                onClick={handleTryDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
              >
                <Play className="h-4 w-4 fill-indigo-600 text-indigo-600" />
                Try Demo
              </button>
            </div>

            {/* Feature Bullets */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>PDF & TXT Parsing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>MCQs & Short Answer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Instant AI Scoring</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-indigo-100/60 backdrop-blur-xl">
              
              {/* Top Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Document</h3>
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]">ML_Lecture_04.pdf</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  <RefreshCw className="h-3 w-3 animate-spin text-indigo-500" />
                  Text Extracted
                </div>
              </div>

              {/* AI Processing Preview */}
              <div className="my-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white p-4 border border-indigo-100/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                    <BrainCircuit className="h-4 w-4 text-indigo-600 animate-pulse" />
                    AI Sparkle Engine
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">10 Questions</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 italic">
                  &ldquo;Identified key concepts: Overfitting, Dropout, Regularization & Backpropagation...&rdquo;
                </p>
              </div>

              {/* Quiz Question Mockup Card */}
              <div className="space-y-3">
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3.5 shadow-sm">
                  <div className="flex items-center justify-between text-[11px] font-medium text-indigo-600 mb-1">
                    <span>Question 4 of 10</span>
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold">MCQ</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Which technique randomly deactivates neurons during training?
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-medium text-slate-600">A. Batch Norm</div>
                    <div className="rounded-lg border-2 border-indigo-600 bg-indigo-600 px-2.5 py-1.5 font-semibold text-white shadow-xs">B. Dropout ✓</div>
                  </div>
                </div>

                {/* Score Pill Card */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs">
                      80%
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-950">Score: 8 / 10 Correct</p>
                      <p className="text-[10px] font-medium text-emerald-700">Mastery: Strong understanding</p>
                    </div>
                  </div>
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
