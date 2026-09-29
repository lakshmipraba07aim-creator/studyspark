'use client';

import React, { useEffect, useState } from 'react';
import { Clock, BookOpen, Sparkles } from 'lucide-react';

interface QuizHeaderProps {
  title: string;
  currentIndex: number;
  totalQuestions: number;
  isDemo?: boolean;
  onTimerTick?: (seconds: number) => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  title,
  currentIndex,
  totalQuestions,
  isDemo = false,
  onTimerTick,
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1;
        if (onTimerTick) onTimerTick(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onTimerTick]);

  const formatTimer = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
      {/* Top Metadata Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {title}
              </h1>
              {isDemo && (
                <span className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-extrabold uppercase text-amber-800">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-400">
              Interactive AI Knowledge Check
            </p>
          </div>
        </div>

        {/* Question Count & Timer */}
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
            <Clock className="h-4 w-4 text-indigo-600" />
            <span className="font-mono text-sm">{formatTimer(seconds)}</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-indigo-600">
              Question {currentIndex + 1}
            </span>
            <span className="text-xs text-slate-400"> of {totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-spark-purple transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};
