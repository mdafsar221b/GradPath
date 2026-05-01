import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface CodingChallenge {
  _id?: string;
  title: string;
  language: 'c' | 'cpp' | 'java' | 'sql' | 'javascript' | 'html-css-js';
  track: string;
  subjectCode?: string;
  unitNumber?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
}

export interface CodingReview {
  verdict: 'accepted' | 'partial' | 'needs-work';
  score: number;
  feedback: string;
  strengths?: string[];
  fixes?: string[];
  improvedCode?: string;
}

export const codingApi = {
  challenges: async (params: { track?: string; language?: string }, token: string): Promise<CodingChallenge[]> => {
    const { data } = await axios.get(`${API_URL}/coding/challenges`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  review: async (dto: { challengeId: string; code: string; language: string }, token: string): Promise<{ review: CodingReview }> => {
    const { data } = await axios.post(`${API_URL}/coding/review`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
