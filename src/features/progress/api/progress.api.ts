import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ProgressData {
  _id?: string;
  subjectId: string;
  completedUnits: number[];
}

export const progressApi = {
  toggleUnit: async (subjectId: string, unitNumber: number, token: string): Promise<ProgressData> => {
    const { data } = await axios.post(`${API_URL}/progress/toggle`, 
      { subjectId, unitNumber },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  getAllProgress: async (token: string): Promise<ProgressData[]> => {
    const { data } = await axios.get(`${API_URL}/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  getSubjectProgress: async (subjectId: string, token: string): Promise<ProgressData> => {
    const { data } = await axios.get(`${API_URL}/progress/${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  }
};
