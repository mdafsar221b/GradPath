import axios from 'axios';
import { API_BASE_URL } from '@/shared/lib/api-base';

export interface AiAskDTO {
  question: string;
  subjectId?: string;
  unitId?: string;
  conversationId?: string;
}

export interface AiMessage {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface AiAskResponse {
  conversationId: string;
  answer: string;
  messages: AiMessage[];
}

export const aiApi = {
  ask: async (dto: AiAskDTO, token: string): Promise<AiAskResponse> => {
    const { data } = await axios.post(`${API_BASE_URL}/ai/ask`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
