import { NextRequest, NextResponse } from 'next/server';
import { generateQuizWithLLM, isLLMConfigured } from '@/lib/llmService';
import { extractTextFromPDF, cleanTextContent } from '@/lib/pdfExtractor';
import { QuizConfig } from '@/types/quiz';
import { DEMO_LECTURE_TEXT } from '@/lib/demoData';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let text = '';
    let filename = 'Lecture_Notes.pdf';
    let config: QuizConfig = {
      numberOfQuestions: 10,
      difficulty: 'Medium',
      questionTypes: ['mcq', 'short_answer'],
      focusTopic: '',
    };
    let isDemoModeForced = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const configJson = formData.get('config') as string | null;
      const isDemoFlag = formData.get('isDemo') as string | null;

      if (isDemoFlag === 'true') {
        isDemoModeForced = true;
      }

      if (configJson) {
        try {
          config = JSON.parse(configJson);
        } catch {
          // fallback default config
        }
      }

      if (file && file.size > 0) {
        filename = file.name;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          const extraction = await extractTextFromPDF(buffer);
          if (extraction.error && !extraction.text) {
            return NextResponse.json({ error: extraction.error }, { status: 400 });
          }
          text = extraction.text;
        } else {
          // Plain text or markdown file
          const rawText = buffer.toString('utf-8');
          const cleaned = cleanTextContent(rawText);
          text = cleaned.text;
        }
      } else {
        text = DEMO_LECTURE_TEXT;
      }
    } else {
      const body = await req.json();
      text = body.text || DEMO_LECTURE_TEXT;
      filename = body.filename || 'Lecture_Notes.txt';
      isDemoModeForced = Boolean(body.isDemo);

      if (body.numberOfQuestions || body.difficulty) {
        config = {
          numberOfQuestions: Number(body.numberOfQuestions) || 10,
          difficulty: body.difficulty || 'Medium',
          questionTypes: body.questionTypes || ['mcq', 'short_answer'],
          focusTopic: body.focusTopic || '',
        };
      }
    }

    // Force demo text if empty or forced demo mode
    if (isDemoModeForced || !text || text.trim().length < 20) {
      text = DEMO_LECTURE_TEXT;
    }

    const { quiz, isDemo } = await generateQuizWithLLM(text, config, filename);

    return NextResponse.json({
      success: true,
      quiz,
      isDemo: isDemo || isDemoModeForced || !isLLMConfigured(),
      message: (isDemo || isDemoModeForced || !isLLMConfigured())
        ? 'Quiz generated in Demo Mode using sample lecture content.'
        : 'Quiz successfully generated with AI.',
    });
  } catch (error: any) {
    console.error('API /api/generate-quiz Error:', error);
    return NextResponse.json(
      { error: error?.message || 'An error occurred while generating the quiz.' },
      { status: 500 }
    );
  }
}
