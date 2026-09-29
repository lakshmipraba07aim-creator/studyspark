'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Layers, Info, CheckCircle2 } from 'lucide-react';
import { AboutModal } from './AboutModal';

interface NavbarProps {
  currentTab?: 'dashboard' | 'quizzes' | 'upload' | 'quiz' | 'results' | 'review';
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab = 'dashboard' }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5 transition-transform active:scale-95">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-spark-purple text-white shadow-md shadow-indigo-200 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5 animate-sparkle" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Study<span className="text-indigo-600">Spark</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                AI Study Buddy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/#recent-quizzes"
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                currentTab === 'quizzes'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Layers className="h-4 w-4" />
              My Quizzes
            </Link>

            <button
              onClick={() => setIsAboutOpen(true)}
              className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <Info className="h-4 w-4" />
              About
            </button>
          </nav>

          {/* Actions & Status */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              Demo Mode Ready
            </div>

            <Link
              href="/upload"
              className="hidden items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 sm:flex"
            >
              <Sparkles className="h-4 w-4" />
              Create Quiz
            </Link>
          </div>
        </div>
      </header>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};
