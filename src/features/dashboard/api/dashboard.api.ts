import axios from 'axios';
import { API_BASE_URL } from '@/shared/lib/api-base';
import { Assignment } from '@/features/assignment/model/assignment.types';

export interface DashboardData {
  stats: {
    totalAssignments: number;
    pendingAssignments: number;
    completedAssignments: number;
  };
  upcomingDeadlines: Assignment[];
  subjectProgress: {
    _id: string;
    name: string;
    code: string;
    completedUnits: number;
    progressPercentage: number;
  }[];
}

export const dashboardApi = {
  getDashboardSummary: async (token: string): Promise<DashboardData> => {
    const { data } = await axios.get(`${API_BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  }
};
