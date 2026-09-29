export type QuestionType = 'mcq' | 'short_answer';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
  topic?: string;
  explanation: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: [string, string, string, string];
  correctAnswer: number; // Index 0-3
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short_answer';
  sampleAnswer: string;
  keywords?: string[];
}

export type Question = MCQQuestion | ShortAnswerQuestion;

export interface QuizConfig {
  numberOfQuestions: number;
  difficulty: Difficulty;
  questionTypes: QuestionType[];
  focusTopic?: string;
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string; // ISO string
  config: QuizConfig;
  questions: Question[];
  isDemo?: boolean;
  sourceFilename?: string;
  extractedSnippet?: string;
}

export interface QuestionResult {
  questionId: string;
  type: QuestionType;
  questionText: string;
  userAnswer: string | number; // option index or written text
  correctAnswer: string | number;
  isCorrect: boolean;
  explanation: string;
  topic?: string;
  feedback?: string; // For short answer LLM feedback
}

export interface TopicPerformance {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface QuizResult {
  quizId: string;
  quizTitle: string;
  completedAt: string;
  timeTakenSeconds: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  percentage: number;
  topicPerformance: TopicPerformance[];
  aiStudyInsight: string;
  results: QuestionResult[];
  isDemo?: boolean;
}

export interface RecentQuizSummary {
  id: string;
  title: string;
  date: string;
  questionCount: number;
  scorePercentage?: number;
  difficulty: Difficulty;
  isDemo?: boolean;
}
