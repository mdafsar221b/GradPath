import axiosInstance from '@/shared/lib/axios';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO extends LoginDTO {
  name: string;
  semester: number;
}

export const authApi = {
  login: async (data: LoginDTO) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterDTO) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },
};
