'use client';

import React from 'react';
import { UploadCloud, Sparkles, GraduationCap, ArrowRight } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: UploadCloud,
      step: '01',
      title: 'Upload',
      subtitle: 'Upload your lecture notes or PDF.',
      description: 'Support for PDF lecture slides, TXT documents, or pasted course notes up to 10MB.',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Sparkles,
      step: '02',
      title: 'AI Generate',
      subtitle: 'AI identifies important concepts & creates questions.',
      description: 'Structured LLM prompts extract key definitions, formulas, and concepts into MCQs & short answers.',
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: GraduationCap,
      step: '03',
      title: 'Learn',
      subtitle: 'Take the quiz, review mistakes & track your score.',
      description: 'Get instant objective scoring, AI study insights, and detailed answer explanations to ace exams.',
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <section className="py-12 bg-slate-50/50 border-y border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">How It Works</h2>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Master any subject in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/50"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bgColor} font-bold shadow-xs`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 transition-colors group-hover:text-indigo-200">
                    {item.step}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {item.subtitle}
                </p>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
