import { create } from 'zustand';
import { Assignment, CreateAssignmentDTO, AssignmentStatus } from './assignment.types';
import { assignmentApi } from '../api/assignment.api';

interface AssignmentState {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  fetchAssignments: (token: string) => Promise<void>;
  addAssignment: (dto: CreateAssignmentDTO, token: string) => Promise<void>;
  toggleStatus: (id: string, currentStatus: AssignmentStatus, token: string) => Promise<void>;
  removeAssignment: (id: string, token: string) => Promise<void>;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  loading: false,
  error: null,

  fetchAssignments: async (token: string) => {
    set({ loading: true });
    try {
      const data = await assignmentApi.getAssignments(token);
      set({ assignments: data, error: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addAssignment: async (dto: CreateAssignmentDTO, token: string) => {
    try {
      const newAssignment = await assignmentApi.createAssignment(dto, token);
      set((state) => ({ assignments: [newAssignment, ...state.assignments] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  toggleStatus: async (id: string, currentStatus: AssignmentStatus, token: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      const updated = await assignmentApi.updateStatus(id, newStatus, token);
      set((state) => ({
        assignments: state.assignments.map((a) => (a._id === id ? updated : a)),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  removeAssignment: async (id: string, token: string) => {
    try {
      await assignmentApi.deleteAssignment(id, token);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
