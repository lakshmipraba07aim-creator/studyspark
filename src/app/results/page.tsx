'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { QuizResult } from '@/types/quiz';
import { getActiveResult } from '@/lib/storage';
import { DEMO_SAMPLE_RESULT } from '@/lib/demoData';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const loaded = getActiveResult();
    setResult(loaded || DEMO_SAMPLE_RESULT);
  }, []);

  if (!result) return null;

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar currentTab="results" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <ResultsDashboard
          result={result}
          onRetake={() => router.push('/quiz')}
          onReview={() => router.push('/review')}
        />
      </main>
    </div>
  );
}
