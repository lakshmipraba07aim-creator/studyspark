import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BackgroundAnimation } from '@/components/BackgroundAnimation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'StudySpark - AI Study Buddy & Interactive Quiz Generator',
  description: 'Convert lecture notes and PDFs into interactive AI quizzes, review mistakes, and track exam readiness with personalized study insights.',
  keywords: ['AI Quiz Generator', 'Study Buddy', 'PDF to Quiz', 'Lecture Notes Quiz', 'Exam Prep'],
  authors: [{ name: 'StudySpark Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-slate-900 text-slate-900 flex flex-col font-sans relative">
        <BackgroundAnimation />
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

