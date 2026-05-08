import axios from 'axios';
import { API_BASE_URL } from '@/shared/lib/api-base';
import { ResultProfileResponse } from '../model/utilities.types';

export const resultsApi = {
  getProfile: async (token: string): Promise<ResultProfileResponse> => {
    const { data } = await axios.get(`${API_BASE_URL}/results/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  updateProfile: async (semesters: ResultProfileResponse['semesters'], token: string): Promise<ResultProfileResponse> => {
    const { data } = await axios.put(
      `${API_BASE_URL}/results/profile`,
      { semesters },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
};
