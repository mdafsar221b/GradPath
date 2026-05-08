import axios from 'axios';
import { API_BASE_URL } from '@/shared/lib/api-base';

export interface ProgressData {
  _id?: string;
  subjectId: string;
  completedUnits: number[];
}

export const progressApi = {
  toggleUnit: async (subjectId: string, unitNumber: number, token: string): Promise<ProgressData> => {
    const { data } = await axios.post(`${API_BASE_URL}/progress/toggle`, 
      { subjectId, unitNumber },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  getAllProgress: async (token: string): Promise<ProgressData[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  getSubjectProgress: async (subjectId: string, token: string): Promise<ProgressData> => {
    const { data } = await axios.get(`${API_BASE_URL}/progress/${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  setUnitCompletion: async (
    subjectId: string,
    unitNumber: number,
    completed: boolean,
    token: string
  ): Promise<ProgressData> => {
    const { data } = await axios.put(
      `${API_BASE_URL}/progress/unit`,
      { subjectId, unitNumber, completed },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }
};
