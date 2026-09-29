'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { FileUploader } from '@/components/FileUploader';
import { QuizConfigForm } from '@/components/QuizConfigForm';
import { QuizConfig } from '@/types/quiz';
import { Sparkles, ArrowLeft, ShieldCheck, Play } from 'lucide-react';
import Link from 'next/link';
import { setActiveQuiz } from '@/lib/storage';
import { DEMO_QUIZ } from '@/lib/demoData';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<QuizConfig>({
    numberOfQuestions: 10,
    difficulty: 'Medium',
    questionTypes: ['mcq', 'short_answer'],
    focusTopic: '',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      if (selectedFile) {
        // Post multipart form data to /api/generate-quiz
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('config', JSON.stringify(config));

        const res = await fetch('/api/generate-quiz', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.quiz) {
          setActiveQuiz(data.quiz);
          router.push('/processing');
          return;
        }
      }

      // If no file selected or fallback, launch demo mode stream
      setActiveQuiz(DEMO_QUIZ);
      router.push('/processing?demo=true');
    } catch (err) {
      console.error('Upload Error:', err);
      // Fallback seamlessly to demo quiz
      setActiveQuiz(DEMO_QUIZ);
      router.push('/processing?demo=true');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDemoQuickLaunch = () => {
    setActiveQuiz(DEMO_QUIZ);
    router.push('/processing?demo=true');
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar currentTab="upload" />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Create a new quiz
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-600">
                Upload your lecture notes and we&apos;ll turn them into an interactive quiz.
              </p>
            </div>

            {/* Quick Demo Launch Pill */}
            <button
              onClick={handleDemoQuickLaunch}
              className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/80 px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-xs hover:bg-indigo-100 transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-indigo-600 text-indigo-600" />
              <span>Use Sample Lecture File</span>
            </button>
          </div>

          {/* Upload Drop Zone Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Select Document
              </h3>
              <span className="text-xs font-medium text-slate-400">PDF or TXT File</span>
            </div>

            <FileUploader
              selectedFile={selectedFile}
              onFileSelect={(file) => setSelectedFile(file)}
            />
          </div>

          {/* Quiz Configuration Form Card */}
          <QuizConfigForm
            config={config}
            onChange={setConfig}
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
          />

          {/* Notice Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 font-medium flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
            <span>
              Your documents are processed securely in-memory. If no API key is set, StudySpark automatically uses deterministic local Demo Mode.
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
