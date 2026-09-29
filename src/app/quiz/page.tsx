'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { QuizHeader } from '@/components/QuizHeader';
import { QuestionCard } from '@/components/QuestionCard';
import { QuestionNavigator } from '@/components/QuestionNavigator';
import { Quiz, QuizResult, QuestionResult, TopicPerformance, MCQQuestion, ShortAnswerQuestion } from '@/types/quiz';
import { getActiveQuiz, setActiveResult } from '@/lib/storage';
import { generateStudyInsight } from '@/lib/llmService';
import { Loader2 } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const loaded = getActiveQuiz();
    if (!loaded) {
      router.push('/upload');
      return;
    }
    setQuiz(loaded);
  }, [router]);

  const handleAnswerSelect = (answer: string | number) => {
    if (!quiz) return;
    const q = quiz.questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [q.id]: answer,
    }));
  };

  const handleNext = () => {
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz || isSubmitting) return;
    setIsSubmitting(true);

    try {
      let correctAnswersCount = 0;
      let incorrectAnswersCount = 0;
      let unansweredCount = 0;

      const questionResults: QuestionResult[] = [];
      const topicStats: Record<string, { correct: number; total: number }> = {};

      for (const q of quiz.questions) {
        const topicName = q.topic || 'General';
        if (!topicStats[topicName]) {
          topicStats[topicName] = { correct: 0, total: 0 };
        }
        topicStats[topicName].total += 1;

        const userVal = answers[q.id];

        if (userVal === undefined || userVal === '') {
          unansweredCount++;
          questionResults.push({
            questionId: q.id,
            type: q.type,
            questionText: q.question,
            userAnswer: '(Unanswered)',
            correctAnswer: q.type === 'mcq' ? (q as MCQQuestion).options[(q as MCQQuestion).correctAnswer] : (q as ShortAnswerQuestion).sampleAnswer,
            isCorrect: false,
            explanation: q.explanation,
            topic: q.topic,
          });
          continue;
        }

        if (q.type === 'mcq') {
          const mcq = q as MCQQuestion;
          const isCorrect = userVal === mcq.correctAnswer;
          if (isCorrect) {
            correctAnswersCount++;
            topicStats[topicName].correct += 1;
          } else {
            incorrectAnswersCount++;
          }

          questionResults.push({
            questionId: q.id,
            type: 'mcq',
            questionText: q.question,
            userAnswer: mcq.options[Number(userVal)] || String(userVal),
            correctAnswer: mcq.options[mcq.correctAnswer],
            isCorrect,
            explanation: q.explanation,
            topic: q.topic,
          });
        } else {
          // Short answer evaluation call
          const sa = q as ShortAnswerQuestion;
          let isCorrect = false;
          let feedback = '';

          try {
            const evalRes = await fetch('/api/evaluate-answer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                question: sa.question,
                sampleAnswer: sa.sampleAnswer,
                studentAnswer: String(userVal),
                keywords: sa.keywords,
              }),
            });
            const evalData = await evalRes.json();
            isCorrect = Boolean(evalData.correct);
            feedback = evalData.feedback || '';
          } catch {
            // Keyword fallback
            const lower = String(userVal).toLowerCase();
            isCorrect = lower.length > 25 || (sa.keywords || []).some(k => lower.includes(k.toLowerCase()));
            feedback = isCorrect ? 'Good concept coverage!' : 'Missing core keywords.';
          }

          if (isCorrect) {
            correctAnswersCount++;
            topicStats[topicName].correct += 1;
          } else {
            incorrectAnswersCount++;
          }

          questionResults.push({
            questionId: q.id,
            type: 'short_answer',
            questionText: q.question,
            userAnswer: String(userVal),
            correctAnswer: sa.sampleAnswer,
            isCorrect,
            explanation: q.explanation,
            topic: q.topic,
            feedback,
          });
        }
      }

      const percentage = Math.round((correctAnswersCount / quiz.questions.length) * 100);

      const topicPerformance: TopicPerformance[] = Object.entries(topicStats).map(([topic, stat]) => ({
        topic,
        correct: stat.correct,
        total: stat.total,
        percentage: Math.round((stat.correct / stat.total) * 100),
      }));

      const aiInsight = generateStudyInsight(percentage, topicPerformance, questionResults);

      const resultObj: QuizResult = {
        quizId: quiz.id,
        quizTitle: quiz.title,
        completedAt: new Date().toISOString(),
        timeTakenSeconds: timeTaken,
        totalQuestions: quiz.questions.length,
        correctAnswers: correctAnswersCount,
        incorrectAnswers: incorrectAnswersCount,
        unanswered: unansweredCount,
        percentage,
        topicPerformance,
        aiStudyInsight: aiInsight,
        results: questionResults,
        isDemo: quiz.isDemo,
      };

      setActiveResult(resultObj);
      router.push('/results');
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [quiz, answers, timeTaken, isSubmitting, router]);

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar currentTab="quiz" />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Top Bar Header */}
          <QuizHeader
            title={quiz.title}
            currentIndex={currentIndex}
            totalQuestions={quiz.questions.length}
            isDemo={quiz.isDemo}
            onTimerTick={setTimeTaken}
          />

          {/* Main Grid: Question Card & Question Navigator */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            
            <div className="lg:col-span-8">
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={quiz.questions.length}
                currentAnswer={answers[currentQuestion.id]}
                onAnswerSelect={handleAnswerSelect}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmitQuiz}
              />
            </div>

            <div className="lg:col-span-4">
              <QuestionNavigator
                questions={quiz.questions}
                currentIndex={currentIndex}
                answers={answers}
                onSelectIndex={setCurrentIndex}
                onSubmit={handleSubmitQuiz}
              />
            </div>

          </div>

        </div>
      </main>

      {/* Submitting Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md text-white animate-fade-in space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
          <h3 className="text-xl font-bold">Evaluating Your Answers...</h3>
          <p className="text-sm font-medium text-slate-300">Calculating score & generating AI study insights...</p>
        </div>
      )}
    </div>
  );
}
