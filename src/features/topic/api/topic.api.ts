import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface TopicProgress {
  _id: string;
  subjectId: string;
  unitId: string;
  topic: string;
  confidence: number;
  status: 'new' | 'learning' | 'revising' | 'mastered';
}

export const topicApi = {
  bySubject: async (subjectId: string, token: string): Promise<TopicProgress[]> => {
    const { data } = await axios.get(`${API_URL}/topics/subject/${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  update: async (dto: { subjectId: string; unitId: string; topic: string; confidence: number }, token: string): Promise<TopicProgress> => {
    const { data } = await axios.put(`${API_URL}/topics`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
