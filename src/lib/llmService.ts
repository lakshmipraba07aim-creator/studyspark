import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuizConfig, Quiz, Question, MCQQuestion, ShortAnswerQuestion, QuestionResult, TopicPerformance } from '@/types/quiz';
import { DEMO_QUIZ, DEMO_LECTURE_TEXT } from './demoData';

const API_KEY = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;

export function isLLMConfigured(): boolean {
  return Boolean(API_KEY && API_KEY.trim().length > 5 && API_KEY !== 'your_gemini_api_key_here');
}

/**
 * Generates a quiz from extracted text content using LLM API if available,
 * or using dynamic NLP text analysis on the user's uploaded document.
 */
export async function generateQuizWithLLM(
  text: string,
  config: QuizConfig,
  filename?: string
): Promise<{ quiz: Quiz; isDemo: boolean }> {
  const isDemoMode = !isLLMConfigured();

  // Clean and prepare input text
  const cleanText = text && text.trim().length > 20 ? text.trim() : DEMO_LECTURE_TEXT;

  if (isLLMConfigured()) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY as string);
      const model = genAI.getGenerativeModel({
        model: process.env.LLM_MODEL || 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const prompt = `
You are StudySpark, an expert AI tutor and educational material creator.
Given the following lecture notes/study material, generate a high-quality interactive quiz.

QUIZ CONFIGURATION:
- Requested Number of Questions: ${config.numberOfQuestions}
- Difficulty Level: ${config.difficulty}
- Allowed Question Types: ${config.questionTypes.join(', ')}
${config.focusTopic ? `- Specific Focus Topic: ${config.focusTopic}` : ''}

STRICT REQUIREMENTS:
1. Base ALL questions strictly on concepts present in the lecture text provided below. Do not invent facts that contradict the text.
2. Produce exactly ${config.numberOfQuestions} questions.
3. If 'mcq' is allowed, generate Multiple Choice Questions with 4 options and indicate the 0-indexed correct answer.
4. If 'short_answer' is allowed, generate Short Answer Questions with a comprehensive 'sampleAnswer' and key 'keywords'.
5. Include a brief, clear 'explanation' for every question explaining why the correct answer is right.
6. Provide a concise topic tag for each question (e.g., "Architecture", "Definitions", "Core Concepts").
7. Ensure exactly one MCQ option is correct.

RETURN JSON ONLY matching this exact structure:
{
  "title": "A concise descriptive title for this quiz",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Question text...",
      "topic": "Topic Name",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation..."
    },
    {
      "id": "q2",
      "type": "short_answer",
      "question": "Question text...",
      "topic": "Topic Name",
      "sampleAnswer": "Comprehensive sample answer...",
      "keywords": ["keyword1", "keyword2"],
      "explanation": "Explanation..."
    }
  ]
}

LECTURE MATERIAL:
---
${cleanText.substring(0, 12000)}
---
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);

      if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        const validatedQuestions: Question[] = parsed.questions.map((q: any, idx: number) => {
          const qId = `q_${idx + 1}`;
          if (q.type === 'short_answer') {
            return {
              id: qId,
              type: 'short_answer',
              question: q.question || 'Explain the key concept from the notes.',
              topic: q.topic || 'General Concept',
              sampleAnswer: q.sampleAnswer || 'Refer to lecture text.',
              keywords: Array.isArray(q.keywords) ? q.keywords : [],
              explanation: q.explanation || 'See sample answer based on notes.',
            } as ShortAnswerQuestion;
          } else {
            const options = Array.isArray(q.options) && q.options.length >= 4 
              ? [String(q.options[0]), String(q.options[1]), String(q.options[2]), String(q.options[3])] as [string, string, string, string]
              : ['Option A', 'Option B', 'Option C', 'Option D'] as [string, string, string, string];

            const correctIdx = typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer <= 3 
              ? q.correctAnswer 
              : 0;

            return {
              id: qId,
              type: 'mcq',
              question: q.question || 'Select the correct statement.',
              topic: q.topic || 'General Concept',
              options,
              correctAnswer: correctIdx,
              explanation: q.explanation || 'Correct answer based on lecture material.',
            } as MCQQuestion;
          }
        });

        const quiz: Quiz = {
          id: `quiz_${Date.now()}`,
          title: parsed.title || formatQuizTitle(filename, cleanText),
          createdAt: new Date().toISOString(),
          config,
          questions: validatedQuestions,
          isDemo: false,
          sourceFilename: filename || 'Uploaded_Notes.pdf',
          extractedSnippet: cleanText.substring(0, 200) + '...',
        };

        return { quiz, isDemo: false };
      }
    } catch (error: any) {
      console.warn('LLM Generation failed or API key missing, using dynamic document text analyzer:', error?.message || error);
    }
  }

  // Dynamic NLP Document Text Analyzer Fallback (generates quiz directly from user's extracted PDF text!)
  const dynamicQuiz = generateDynamicQuizFromText(cleanText, config, filename);
  return { quiz: dynamicQuiz, isDemo: isDemoMode };
}

/**
 * Dynamically parses the user's extracted PDF/lecture text and generates a real quiz
 * specifically based on their uploaded document content.
 */
function generateDynamicQuizFromText(text: string, config: QuizConfig, filename?: string): Quiz {
  const documentTitle = formatQuizTitle(filename, text);

  // Clean lines and filter out empty ones
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Extract candidate sentences / bullet points (at least 20 chars long)
  const sentences: string[] = [];
  text.split(/(?<=[.?!])\s+|\n+/).forEach(s => {
    const trimmed = s.trim().replace(/^[-•*–\d.]+\s*/, '');
    if (trimmed.length >= 25 && trimmed.length <= 300) {
      sentences.push(trimmed);
    }
  });

  // Extract key terms / concepts from the document for distractors & topic tags
  const keyTerms: string[] = [];
  const matches = text.match(/\b([A-Z][a-zA-Z0-9\-\s]{2,30})\b/g) || [];
  matches.forEach(m => {
    const cleaned = m.trim();
    if (cleaned.length > 3 && !['The', 'This', 'That', 'These', 'Those', 'With', 'From', 'Into', 'Over', 'Under', 'Note', 'Lecture', 'Page'].includes(cleaned)) {
      if (!keyTerms.includes(cleaned)) keyTerms.push(cleaned);
    }
  });

  // Fallback term list if text is sparse
  if (keyTerms.length < 4) {
    keyTerms.push('Primary Mechanism', 'System Architecture', 'Core Function', 'Optimization Metric');
  }

  // Infer topics from document headers or terms
  const documentTopics = keyTerms.slice(0, 6);

  const totalRequested = Math.max(3, config.numberOfQuestions);
  const allowMCQ = config.questionTypes.includes('mcq');
  const allowSA = config.questionTypes.includes('short_answer');

  const generatedQuestions: Question[] = [];

  for (let i = 0; i < totalRequested; i++) {
    const qId = `q_${i + 1}`;
    const topic = documentTopics[i % documentTopics.length] || 'Document Concepts';
    const sourceSentence = sentences[i % sentences.length] || sentences[0] || `Key principle from ${documentTitle}.`;

    // Determine type for this index
    let qType: 'mcq' | 'short_answer' = 'mcq';
    if (allowMCQ && allowSA) {
      qType = (i % 3 === 2) ? 'short_answer' : 'mcq';
    } else if (allowSA) {
      qType = 'short_answer';
    }

    if (qType === 'mcq') {
      // Create a Multiple Choice Question from sourceSentence
      const words = sourceSentence.split(' ');
      // Try to pick a focal word or phrase to blank out or test
      const focalTerm = keyTerms[i % keyTerms.length] || words[Math.floor(words.length / 2)] || 'Concept';

      let questionPrompt = '';
      let correctAnswerText = '';

      if (sourceSentence.includes(':')) {
        const parts = sourceSentence.split(':');
        questionPrompt = `According to your document, what is described by: "${parts[1].trim()}"?`;
        correctAnswerText = parts[0].trim();
      } else if (sourceSentence.toLowerCase().includes(' is ') || sourceSentence.toLowerCase().includes(' refers to ')) {
        const splitWord = sourceSentence.toLowerCase().includes(' is ') ? ' is ' : ' refers to ';
        const parts = sourceSentence.split(new RegExp(splitWord, 'i'));
        questionPrompt = `What ${splitWord.trim()} "${parts.slice(1).join(' ').trim()}"?`;
        correctAnswerText = parts[0].trim();
      } else {
        questionPrompt = `Which statement is accurate regarding the concepts in "${documentTitle}"?`;
        correctAnswerText = sourceSentence;
      }

      // Generate distractors using other terms/sentences from the document
      const distractors: string[] = [];
      let termIndex = (i + 1) % keyTerms.length;
      while (distractors.length < 3) {
        const candidate = keyTerms[termIndex] || `Alternative Principle ${distractors.length + 1}`;
        if (candidate !== correctAnswerText && !distractors.includes(candidate)) {
          distractors.push(candidate);
        }
        termIndex = (termIndex + 1) % keyTerms.length;
      }

      // Assemble 4 options and pick random correct index (0-3)
      const correctIdx = i % 4;
      const options: string[] = [...distractors];
      options.splice(correctIdx, 0, correctAnswerText);

      generatedQuestions.push({
        id: qId,
        type: 'mcq',
        question: questionPrompt,
        topic,
        options: [options[0], options[1], options[2], options[3]] as [string, string, string, string],
        correctAnswer: correctIdx,
        explanation: `Excerpt from your notes: "${sourceSentence}"`,
      } as MCQQuestion);
    } else {
      // Create a Short Answer Question
      const questionPrompt = sourceSentence.length > 60
        ? `Explain the main concept discussed in the following excerpt: "${sourceSentence.substring(0, 100)}..."`
        : `Describe the role of ${topic} as presented in your lecture notes.`;

      const keywords = sourceSentence
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 4)
        .slice(0, 5);

      generatedQuestions.push({
        id: qId,
        type: 'short_answer',
        question: questionPrompt,
        topic,
        sampleAnswer: sourceSentence,
        keywords: keywords.length > 0 ? keywords : [topic.toLowerCase()],
        explanation: `Based directly on your uploaded notes: "${sourceSentence}"`,
      } as ShortAnswerQuestion);
    }
  }

  return {
    id: `quiz_dynamic_${Date.now()}`,
    title: documentTitle,
    createdAt: new Date().toISOString(),
    config,
    questions: generatedQuestions,
    isDemo: false,
    sourceFilename: filename || 'Uploaded_Lecture_Notes.pdf',
    extractedSnippet: text.substring(0, 250) + '...',
  };
}

/**
 * Derives a clean quiz title from filename or initial text header.
 */
function formatQuizTitle(filename?: string, text?: string): string {
  if (filename && filename.trim().length > 0 && !filename.includes('Lecture_Notes.pdf')) {
    const clean = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  if (text) {
    const firstLine = text.split('\n').map(l => l.trim()).find(l => l.length > 5 && l.length < 60);
    if (firstLine) {
      return firstLine.replace(/^[#=*\s-]+/, '').trim();
    }
  }

  return 'Interactive Lecture Quiz';
}

/**
 * Evaluates short-answer questions using LLM API if available, or keyword similarity fallback.
 */
export async function evaluateShortAnswer(
  questionText: string,
  sampleAnswer: string,
  studentAnswer: string,
  keywords?: string[]
): Promise<{ isCorrect: boolean; score: number; feedback: string }> {
  if (!studentAnswer || studentAnswer.trim().length === 0) {
    return {
      isCorrect: false,
      score: 0,
      feedback: 'No answer provided.',
    };
  }

  if (isLLMConfigured()) {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY as string);
      const model = genAI.getGenerativeModel({
        model: process.env.LLM_MODEL || 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `
You are an objective academic evaluator. Compare the student's answer to the expected answer.

QUESTION: ${questionText}
EXPECTED ANSWER: ${sampleAnswer}
STUDENT ANSWER: ${studentAnswer}

Evaluate if the student demonstrates understanding of the core concept.

RETURN JSON ONLY:
{
  "isCorrect": boolean (true if student captured main ideas, false otherwise),
  "score": number (0.0 to 1.0),
  "feedback": "1-2 sentence constructive feedback highlighting what was correct or missed"
}
`;

      const res = await model.generateContent(prompt);
      const evalParsed = JSON.parse(res.response.text());
      return {
        isCorrect: Boolean(evalParsed.isCorrect),
        score: typeof evalParsed.score === 'number' ? evalParsed.score : (evalParsed.isCorrect ? 1 : 0),
        feedback: evalParsed.feedback || (evalParsed.isCorrect ? 'Good explanation!' : 'Needs more key details.'),
      };
    } catch (err) {
      console.warn('LLM evaluation fallback to keyword similarity');
    }
  }

  // Fallback keyword similarity grading
  const lowerAnswer = studentAnswer.toLowerCase();
  let matchedKeywords = 0;
  const targetKeywords = keywords && keywords.length > 0 ? keywords : sampleAnswer.toLowerCase().split(/\W+/).filter(w => w.length > 4);

  targetKeywords.forEach(kw => {
    if (lowerAnswer.includes(kw.toLowerCase())) {
      matchedKeywords++;
    }
  });

  const ratio = targetKeywords.length > 0 ? matchedKeywords / targetKeywords.length : (lowerAnswer.length > 15 ? 0.7 : 0.3);
  const isCorrect = ratio >= 0.35 || lowerAnswer.length > 30;

  return {
    isCorrect,
    score: isCorrect ? (ratio > 0.6 ? 1 : 0.75) : 0.25,
    feedback: isCorrect
      ? 'Great job capturing the key principles in your response!'
      : `Your answer was partially complete. Key elements to include: ${targetKeywords.slice(0, 3).join(', ')}.`,
  };
}

/**
 * Generates dynamic AI study insights based on performance across quiz topics.
 */
export function generateStudyInsight(
  percentage: number,
  topicPerformance: TopicPerformance[],
  results: QuestionResult[]
): string {
  const weakTopics = topicPerformance
    .filter(t => t.percentage < 70)
    .map(t => t.topic);

  const strongTopics = topicPerformance
    .filter(t => t.percentage >= 80)
    .map(t => t.topic);

  if (percentage >= 90) {
    return `Outstanding performance! You showed exceptional mastery across ${strongTopics.join(', ') || 'all topics'}. To stay sharp, try creating a 'Hard' difficulty quiz with focus on advanced applications.`;
  } else if (percentage >= 70) {
    if (weakTopics.length > 0) {
      return `Solid work! You demonstrated great understanding of ${strongTopics.join(', ') || 'the foundational concepts'}. You may want to review ${weakTopics.join(' and ')}, as these were the areas with missed questions.`;
    }
    return `Good job! You've got a solid grasp on the core concepts. Review the detailed explanations in your answer review to push your score up to 90%+.`;
  } else {
    return `Keep practicing! We recommend re-reading your notes on ${weakTopics.join(', ') || 'key definitions'} and retaking this quiz or creating an Easy difficulty refresh quiz.`;
  }
}

/**
 * Helper to build a customized demo quiz matching the requested question count and types.
 */
function createCustomizedDemoQuiz(text: string, config: QuizConfig, filename?: string): Quiz {
  const title = filename 
    ? filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') 
    : (config.focusTopic ? `${config.focusTopic} Quiz` : DEMO_QUIZ.title);

  let pool = [...DEMO_QUIZ.questions];

  if (config.questionTypes.length > 0) {
    pool = pool.filter(q => config.questionTypes.includes(q.type));
  }

  let finalQuestions: Question[] = [];
  while (finalQuestions.length < config.numberOfQuestions && pool.length > 0) {
    const remaining = config.numberOfQuestions - finalQuestions.length;
    finalQuestions = finalQuestions.concat(pool.slice(0, remaining));
  }

  finalQuestions = finalQuestions.slice(0, config.numberOfQuestions).map((q, idx) => ({
    ...q,
    id: `q_${idx + 1}`
  }));

  return {
    id: `demo_${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    config,
    questions: finalQuestions,
    isDemo: true,
    sourceFilename: filename || 'Lecture_Notes.pdf',
    extractedSnippet: text ? text.substring(0, 150) + '...' : DEMO_QUIZ.extractedSnippet,
  };
}

