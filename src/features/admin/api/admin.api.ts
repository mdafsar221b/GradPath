import axiosInstance from '@/shared/lib/axios';
import { AdminUserDirectoryFilters, AdminUserStats, AdminUsersResponse } from '../model/admin.types';

export const adminApi = {
  getUsers: async (filters: AdminUserDirectoryFilters): Promise<AdminUsersResponse> => {
    const response = await axiosInstance.get('/admin/users', { params: filters });
    return response.data;
  },

  getUserStats: async (): Promise<AdminUserStats> => {
    const response = await axiosInstance.get('/admin/users/stats');
    return response.data;
  },
};
