import axios from 'axios';
import { API_BASE_URL } from '@/shared/lib/api-base';

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
    const { data } = await axios.get(`${API_BASE_URL}/topics/subject/${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
  update: async (dto: { subjectId: string; unitId: string; topic: string; confidence: number }, token: string): Promise<TopicProgress> => {
    const { data } = await axios.put(`${API_BASE_URL}/topics`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
