import axios from 'axios';
import { API_BASE_URL } from '@/shared/lib/api-base';
import { Assignment, CreateAssignmentDTO, AssignmentStatus } from '../model/assignment.types';

export const assignmentApi = {
  getAssignments: async (token: string): Promise<Assignment[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  createAssignment: async (dto: CreateAssignmentDTO, token: string): Promise<Assignment> => {
    const { data } = await axios.post(`${API_BASE_URL}/assignments`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  updateStatus: async (id: string, status: AssignmentStatus, token: string): Promise<Assignment> => {
    const { data } = await axios.patch(`${API_BASE_URL}/assignments/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  deleteAssignment: async (id: string, token: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/assignments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
