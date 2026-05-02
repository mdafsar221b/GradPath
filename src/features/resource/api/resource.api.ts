import axios from 'axios';
import { Resource, ResourceDifficulty, ResourceStats, ResourceType } from '../model/resource.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const resourceApi = {
  getResources: async (
    params: {
      subjectId?: string;
      unitId?: string;
      category?: string;
      semester?: number;
      type?: ResourceType | '';
      difficulty?: ResourceDifficulty | '';
      year?: string;
      search?: string;
      tag?: string;
    },
    token: string
  ): Promise<Resource[]> => {
    const { data } = await axios.get(`${API_URL}/resources`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  getResourceStats: async (token: string): Promise<ResourceStats> => {
    const { data } = await axios.get(`${API_URL}/resources/stats`, {
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

  updateResource: async (id: string, updateData: Partial<Resource>, token: string): Promise<Resource> => {
    const { data } = await axios.put(`${API_URL}/resources/${id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  deleteResource: async (id: string, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/resources/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
