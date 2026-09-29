'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Sparkles, AlertCircle, RefreshCw, FileText, Cpu, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { Quiz } from '@/types/quiz';
import { setActiveQuiz, saveRecentQuiz } from '@/lib/storage';

interface ProcessingPipelineProps {
  quizData?: Quiz | null;
  error?: string | null;
  onRetry?: () => void;
  onFallbackDemo?: () => void;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  quizData,
  error,
  onRetry,
  onFallbackDemo,
}) => {
  const router = useRouter();

  // Steps state: 0=Uploaded, 1=Extracted, 2=AI Analysis, 3=Questions Created, 4=Ready
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    // Step progression animation
    const timer1 = setTimeout(() => setCurrentStep(1), 600);
    const timer2 = setTimeout(() => setCurrentStep(2), 1400);
    const timer3 = setTimeout(() => setCurrentStep(3), 2300);
    const timer4 = setTimeout(() => setCurrentStep(4), 3100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  useEffect(() => {
    // Once steps are done and quiz is available, navigate to /quiz
    if (currentStep >= 4 && quizData) {
      setActiveQuiz(quizData);
      saveRecentQuiz(quizData);
      const navTimer = setTimeout(() => {
        router.push('/quiz');
      }, 700);
      return () => clearTimeout(navTimer);
    }
  }, [currentStep, quizData, router]);

  const steps = [
    { label: 'PDF Uploaded', description: 'File validated & buffered' },
    { label: 'Text Extracted', description: 'Layout noise removed' },
    { label: 'AI Analysis', description: 'Extracting key concepts & definitions' },
    { label: 'Creating Questions', description: 'Generating MCQs & Short Answers' },
    { label: 'Quiz Ready', description: 'Formatting interactive test interface' },
  ];

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-2xl text-center space-y-8 animate-fade-in">
      
      {/* Animated Glowing AI Sparkle Header */}
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-40 animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl">
          <Sparkles className="h-10 w-10 animate-sparkle" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Generating Your AI Quiz
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          StudySpark is reading your notes and constructing target assessment questions...
        </p>
      </div>

      {/* Visual Pipeline Steps */}
      <div className="space-y-4 text-left border-y border-slate-100 py-6">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-2xl p-3.5 transition-all duration-300 ${
                isCurrent
                  ? 'border border-indigo-200 bg-indigo-50/70 shadow-sm scale-[1.01]'
                  : isDone
                  ? 'bg-slate-50/60'
                  : 'opacity-40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs transition-colors ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <Check className="h-5 w-5 stroke-[3]" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div>
                  <h4 className={`text-sm font-bold ${isCurrent ? 'text-indigo-950' : 'text-slate-800'}`}>
                    {step.label}
                  </h4>
                  <p className="text-xs font-medium text-slate-500">{step.description}</p>
                </div>
              </div>

              {isDone && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Complete
                </span>
              )}
              {isCurrent && (
                <span className="text-xs font-bold text-indigo-600 animate-pulse">
                  Processing...
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Error state if generation failed */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-left space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-rose-600" />
            <span>Generation Failed</span>
          </div>
          <p className="text-xs text-rose-700 font-medium">{error}</p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            )}
            {onFallbackDemo && (
              <button
                onClick={onFallbackDemo}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
              >
                <span>Continue with Demo Mode</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
