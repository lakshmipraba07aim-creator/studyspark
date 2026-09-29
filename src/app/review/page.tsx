'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ReviewAnswers } from '@/components/ReviewAnswers';
import { QuizResult } from '@/types/quiz';
import { getActiveResult } from '@/lib/storage';
import { DEMO_SAMPLE_RESULT } from '@/lib/demoData';

export default function ReviewPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const loaded = getActiveResult();
    setResult(loaded || DEMO_SAMPLE_RESULT);
  }, []);

  if (!result) return null;

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar currentTab="review" />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <ReviewAnswers
          result={result}
          onBackToResults={() => router.push('/results')}
        />
      </main>
    </div>
  );
}
