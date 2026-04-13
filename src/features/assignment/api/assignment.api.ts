import axios from 'axios';
import { Assignment, CreateAssignmentDTO, AssignmentStatus } from '../model/assignment.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const assignmentApi = {
  getAssignments: async (token: string): Promise<Assignment[]> => {
    const { data } = await axios.get(`${API_URL}/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  createAssignment: async (dto: CreateAssignmentDTO, token: string): Promise<Assignment> => {
    const { data } = await axios.post(`${API_URL}/assignments`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  updateStatus: async (id: string, status: AssignmentStatus, token: string): Promise<Assignment> => {
    const { data } = await axios.patch(`${API_URL}/assignments/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  deleteAssignment: async (id: string, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/assignments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
