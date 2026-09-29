'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProcessingPipeline } from '@/components/ProcessingPipeline';
import { Quiz } from '@/types/quiz';
import { getActiveQuiz, setActiveQuiz } from '@/lib/storage';
import { DEMO_QUIZ } from '@/lib/demoData';
import { Loader2 } from 'lucide-react';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quizData, setQuizData] = useState<Quiz | null>(null);

  useEffect(() => {
    const isDemo = searchParams.get('demo') === 'true';
    const active = getActiveQuiz();

    if (isDemo || !active) {
      setActiveQuiz(DEMO_QUIZ);
      setQuizData(DEMO_QUIZ);
    } else {
      setQuizData(active);
    }
  }, [searchParams]);

  return (
    <ProcessingPipeline
      quizData={quizData}
      onFallbackDemo={() => {
        setActiveQuiz(DEMO_QUIZ);
        setQuizData(DEMO_QUIZ);
      }}
    />
  );
}

export default function ProcessingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar currentTab="upload" />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold text-slate-600">Initializing processing engine...</p>
          </div>
        }>
          <ProcessingContent />
        </Suspense>
      </main>
    </div>
  );
}
