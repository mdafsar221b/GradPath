import axios from 'axios';
import { ResultProfileResponse } from '../model/utilities.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const resultsApi = {
  getProfile: async (token: string): Promise<ResultProfileResponse> => {
    const { data } = await axios.get(`${API_URL}/results/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  updateProfile: async (semesters: ResultProfileResponse['semesters'], token: string): Promise<ResultProfileResponse> => {
    const { data } = await axios.put(
      `${API_URL}/results/profile`,
      { semesters },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
};
