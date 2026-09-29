'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeatureCards } from '@/components/FeatureCards';
import { RecentQuizzes } from '@/components/RecentQuizzes';
import { Sparkles, Heart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar currentTab="dashboard" />
      
      <main className="flex-1">
        <Hero />
        <FeatureCards />
        <RecentQuizzes />
      </main>

      <footer className="border-t border-slate-200/60 bg-white/80 backdrop-blur-md py-8 text-center text-xs text-slate-500 font-medium">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 animate-sparkle" />
            <span className="font-bold text-slate-900">StudySpark AI</span>
            <span>• AI-Powered Lecture Quiz Buddy</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Built for high-retention student learning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
