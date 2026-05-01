import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
    const { data } = await axios.post(`${API_URL}/ai/ask`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
