import axios from 'axios';
import { Resource, CreateResourceDTO } from '../model/resource.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const resourceApi = {
  getResources: async (subjectId: string, unitId: string, token: string): Promise<Resource[]> => {
    const { data } = await axios.get(`${API_URL}/resources`, {
      params: { subjectId, unitId },
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  createResource: async (formData: FormData, token: string): Promise<Resource> => {
    const { data } = await axios.post(`${API_URL}/resources`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
