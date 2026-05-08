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
    if (typeof response.data === 'string' && response.data.includes('<html')) {
      throw new Error('Backend returned an anti-bot HTML page instead of JSON. Check your hosting provider or Cloudflare settings.');
    }
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response from server.');
    }
    return response.data;
  },
  register: async (data: RegisterDTO) => {
    const response = await axiosInstance.post('/auth/register', data);
    if (typeof response.data === 'string' && response.data.includes('<html')) {
      throw new Error('Backend returned an anti-bot HTML page instead of JSON. Check your hosting provider or Cloudflare settings.');
    }
    if (!response.data || !response.data.token) {
      throw new Error('Invalid response from server.');
    }
    return response.data;
  },
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },
};
