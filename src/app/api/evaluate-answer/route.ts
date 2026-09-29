import { NextRequest, NextResponse } from 'next/server';
import { evaluateShortAnswer } from '@/lib/llmService';

export async function POST(req: NextRequest) {
  try {
    const { question, sampleAnswer, studentAnswer, keywords } = await req.json();

    if (!question || !studentAnswer) {
      return NextResponse.json({ error: 'Missing required evaluation fields' }, { status: 400 });
    }

    const result = await evaluateShortAnswer(question, sampleAnswer || '', studentAnswer, keywords);

    return NextResponse.json({
      success: true,
      correct: result.isCorrect,
      score: result.score,
      feedback: result.feedback,
    });
  } catch (error: any) {
    console.error('API /api/evaluate-answer Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to evaluate answer.' },
      { status: 500 }
    );
  }
}
