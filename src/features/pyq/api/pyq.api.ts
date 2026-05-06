import axiosInstance from '@/shared/lib/axios';
import {
  ModelPaperResponse,
  ParsePyqPaperResponse,
  PyqAnswerReview,
  PyqPracticeQuestion,
  PyqQuestion,
  PyqResourcePaperResponse,
  PyqResourceStatus,
  PyqSubjectSummary,
} from '../model/pyq.types';

export const pyqApi = {
  listQuestions: async (resourceId: string): Promise<PyqQuestion[]> => {
    const response = await axiosInstance.get(`/pyq/resources/${resourceId}/questions`);
    return response.data;
  },

  createQuestion: async (resourceId: string, payload: Partial<PyqQuestion>): Promise<PyqQuestion> => {
    const response = await axiosInstance.post(`/pyq/resources/${resourceId}/questions`, payload);
    return response.data;
  },

  updateQuestion: async (id: string, payload: Partial<PyqQuestion>): Promise<PyqQuestion> => {
    const response = await axiosInstance.put(`/pyq/questions/${id}`, payload);
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/pyq/questions/${id}`);
  },

  getResourceStatuses: async (subjectId?: string): Promise<PyqResourceStatus[]> => {
    const response = await axiosInstance.get('/pyq/resources/status', {
      params: subjectId ? { subjectId } : {},
    });
    return response.data;
  },

  getSubjectSummary: async (subjectId: string): Promise<PyqSubjectSummary> => {
    const response = await axiosInstance.get(`/pyq/subjects/${subjectId}/summary`);
    return response.data;
  },

  getResourcePaper: async (resourceId: string): Promise<PyqResourcePaperResponse> => {
    const response = await axiosInstance.get(`/pyq/resources/${resourceId}/paper`);
    return response.data;
  },

  parseResourcePaper: async (
    resourceId: string,
    payload: { rawText: string; year?: string; examSession?: string }
  ): Promise<ParsePyqPaperResponse> => {
    const response = await axiosInstance.post(`/pyq/resources/${resourceId}/parse-paper`, payload);
    return response.data;
  },

  generateModelPaper: async (subjectId: string): Promise<ModelPaperResponse> => {
    const response = await axiosInstance.post(`/pyq/subjects/${subjectId}/model-paper`);
    return response.data;
  },

  getPracticeQuestion: async (
    subjectId: string,
    params: {
      unitId?: string;
      year?: string;
      marks?: number;
      questionType?: 'short' | 'medium' | 'long';
      excludeId?: string;
    }
  ): Promise<PyqPracticeQuestion> => {
    const response = await axiosInstance.get(`/pyq/subjects/${subjectId}/practice-question`, { params });
    return response.data;
  },

  reviewPracticeAnswer: async (
    questionId: string,
    payload: { answer: string }
  ): Promise<PyqAnswerReview> => {
    const response = await axiosInstance.post(`/pyq/questions/${questionId}/review`, payload);
    return response.data;
  },
};
