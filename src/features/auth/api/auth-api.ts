import axiosInstance from '@/shared/lib/axios';

export const authApi = {
  login: async (data: any) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },
};
