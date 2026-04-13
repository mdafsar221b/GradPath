import axios from 'axios';
import { Assignment } from '@/features/assignment/model/assignment.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
    const { data } = await axios.get(`${API_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  }
};
