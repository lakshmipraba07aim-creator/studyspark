'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, Calendar, HelpCircle, ArrowRight, Award, RotateCcw } from 'lucide-react';
import { RecentQuizSummary } from '@/types/quiz';
import { getRecentQuizzes, setActiveQuiz } from '@/lib/storage';
import { DEMO_QUIZ } from '@/lib/demoData';

export const RecentQuizzes: React.FC = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<RecentQuizSummary[]>([]);

  useEffect(() => {
    setQuizzes(getRecentQuizzes());
  }, []);

  const handleLaunchQuiz = (quizId: string) => {
    // If demo quiz or custom saved quiz, load quiz and launch processing/quiz
    setActiveQuiz(DEMO_QUIZ);
    router.push('/processing?demo=true');
  };

  return (
    <section id="recent-quizzes" className="py-12 my-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              Your Dashboard
            </div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl mt-1">
              Recent Quizzes
            </h2>
          </div>

          <button
            onClick={() => {
              setActiveQuiz(DEMO_QUIZ);
              router.push('/processing?demo=true');
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <span>Load Sample Quiz Collection</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quizzes.map((item) => {
            const hasScore = typeof item.scorePercentage === 'number';
            const score = item.scorePercentage ?? 0;
            const isHigh = score >= 80;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/60"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {item.difficulty}
                    </span>
                    {item.isDemo && (
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        Demo Mode
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Details */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                      <span>{item.questionCount} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Action Button Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    {hasScore ? (
                      <div className="flex items-center gap-1.5">
                        <Award className={`h-4 w-4 ${isHigh ? 'text-emerald-500' : 'text-amber-500'}`} />
                        <span className={`text-sm font-extrabold ${isHigh ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {score}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">Not taken yet</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleLaunchQuiz(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-indigo-600 group-hover:shadow-md active:scale-95"
                  >
                    <span>{hasScore ? 'Review' : 'Start'}</span>
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
