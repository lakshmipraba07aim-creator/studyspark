import { Quiz, QuizResult, RecentQuizSummary } from '@/types/quiz';
import { MOCK_RECENT_QUIZZES } from './demoData';

const RECENT_QUIZZES_KEY = 'studyspark_recent_quizzes';
const ACTIVE_QUIZ_KEY = 'studyspark_active_quiz';
const ACTIVE_RESULT_KEY = 'studyspark_active_result';

export function getRecentQuizzes(): RecentQuizSummary[] {
  if (typeof window === 'undefined') return MOCK_RECENT_QUIZZES;
  try {
    const data = localStorage.getItem(RECENT_QUIZZES_KEY);
    if (!data) {
      localStorage.setItem(RECENT_QUIZZES_KEY, JSON.stringify(MOCK_RECENT_QUIZZES));
      return MOCK_RECENT_QUIZZES;
    }
    return JSON.parse(data);
  } catch {
    return MOCK_RECENT_QUIZZES;
  }
}

export function saveRecentQuiz(quiz: Quiz, scorePercentage?: number): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getRecentQuizzes();
    const summary: RecentQuizSummary = {
      id: quiz.id,
      title: quiz.title,
      date: new Date().toISOString().split('T')[0],
      questionCount: quiz.questions.length,
      scorePercentage,
      difficulty: quiz.config.difficulty,
      isDemo: quiz.isDemo,
    };

    // Remove duplicates if existing
    const filtered = list.filter(item => item.id !== quiz.id);
    const updated = [summary, ...filtered].slice(0, 10);
    localStorage.setItem(RECENT_QUIZZES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recent quiz', err);
  }
}

export function setActiveQuiz(quiz: Quiz): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_QUIZ_KEY, JSON.stringify(quiz));
  } catch (err) {
    console.error('Failed to set active quiz', err);
  }
}

export function getActiveQuiz(): Quiz | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(ACTIVE_QUIZ_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setActiveResult(result: QuizResult): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_RESULT_KEY, JSON.stringify(result));
    // Also update recent quiz score
    const list = getRecentQuizzes();
    const updated = list.map(item => {
      if (item.id === result.quizId) {
        return { ...item, scorePercentage: result.percentage };
      }
      return item;
    });
    localStorage.setItem(RECENT_QUIZZES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save active result', err);
  }
}

export function getActiveResult(): QuizResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(ACTIVE_RESULT_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
