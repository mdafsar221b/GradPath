import { create } from 'zustand';
import { progressApi, ProgressData } from '../api/progress.api';

interface ProgressState {
  progressList: ProgressData[];
  loading: boolean;
  fetchProgress: (token: string) => Promise<void>;
  toggleUnit: (subjectId: string, unitNumber: number, token: string) => Promise<void>;
  setUnitCompletion: (subjectId: string, unitNumber: number, completed: boolean, token: string) => Promise<void>;
  getProgressForSubject: (subjectId: string) => ProgressData | undefined;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressList: [],
  loading: false,

  fetchProgress: async (token: string) => {
    set({ loading: true });
    try {
      const data = await progressApi.getAllProgress(token);
      set({ progressList: data });
    } catch (error) {
      console.error('Failed to fetch progress', error);
    } finally {
      set({ loading: false });
    }
  },

  toggleUnit: async (subjectId: string, unitNumber: number, token: string) => {
    try {
      const updated = await progressApi.toggleUnit(subjectId, unitNumber, token);
      set((state) => ({
        progressList: state.progressList.find(p => p.subjectId === subjectId)
          ? state.progressList.map(p => p.subjectId === subjectId ? updated : p)
          : [...state.progressList, updated]
      }));
    } catch (error) {
      console.error('Failed to toggle unit', error);
    }
  },

  setUnitCompletion: async (subjectId: string, unitNumber: number, completed: boolean, token: string) => {
    try {
      const updated = await progressApi.setUnitCompletion(subjectId, unitNumber, completed, token);
      set((state) => ({
        progressList: state.progressList.find((p) => p.subjectId === subjectId)
          ? state.progressList.map((p) => (p.subjectId === subjectId ? updated : p))
          : [...state.progressList, updated]
      }));
    } catch (error) {
      console.error('Failed to set unit completion', error);
    }
  },

  getProgressForSubject: (subjectId: string) => {
    return get().progressList.find(p => p.subjectId === subjectId);
  }
}));
