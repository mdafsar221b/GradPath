import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface QuizQuestion {
  _id: string;
  prompt: string;
  questionType: 'mcq' | 'short' | 'medium' | 'long';
  options: string[];
  answerIndex?: number;
  explanation: string;
  answerGuide?: string;
  marks?: number;
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  _id: string;
  title: string;
  mode: 'unit' | 'pyq' | 'mixed' | 'viva';
  subjectId: { _id: string; name: string; code?: string } | string;
  unitId?: { _id: string; unitNumber: number; title: string } | string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizAttempt {
  _id: string;
  score: number;
  total: number;
  answers: number[];
  createdAt: string;
  topicBreakdown: { topic: string; correct: number; total: number }[];
}

export const quizApi = {
  generate: async (dto: { subjectId: string; unitId?: string; mode: string; count: number }, token: string): Promise<Quiz> => {
    const { data } = await axios.post(`${API_URL}/quizzes/generate`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  list: async (params: { subjectId?: string; unitId?: string }, token: string): Promise<Quiz[]> => {
    const { data } = await axios.get(`${API_URL}/quizzes`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  attempt: async (quizId: string, answers: number[], token: string): Promise<{ attempt: QuizAttempt; quiz: Quiz }> => {
    const { data } = await axios.post(`${API_URL}/quizzes/${quizId}/attempt`, { answers }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
