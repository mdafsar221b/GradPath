import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Flashcard {
  _id: string;
  subjectId: { _id: string; name: string; code?: string } | string;
  unitId?: { _id: string; unitNumber: number; title: string } | string;
  topic?: string;
  front: string;
  back: string;
  difficulty: number;
  intervalDays: number;
  dueAt: string;
}

export const flashcardApi = {
  generate: async (dto: { subjectId: string; unitId?: string; count: number }, token: string): Promise<Flashcard[]> => {
    const { data } = await axios.post(`${API_URL}/flashcards/generate`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  list: async (params: { subjectId?: string; unitId?: string; due?: boolean }, token: string): Promise<Flashcard[]> => {
    const { data } = await axios.get(`${API_URL}/flashcards`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  review: async (id: string, rating: 'again' | 'good' | 'easy', token: string): Promise<Flashcard> => {
    const { data } = await axios.patch(`${API_URL}/flashcards/${id}/review`, { rating }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
