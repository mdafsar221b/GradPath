import axiosInstance from '@/shared/lib/axios';
import {
  PracticePyqPaper,
  PracticePyqPaperQuestions,
  TopicGuideResponse,
  TopicPracticeMap,
} from '../model/practice.types';

export const practiceApi = {
  getTopicMap: async (subjectId: string): Promise<TopicPracticeMap> => {
    const response = await axiosInstance.get(`/practice/subjects/${subjectId}/topic-map`);
    return response.data;
  },

  getTopicGuide: async (payload: {
    subjectId: string;
    unitId: string;
    topic: string;
  }): Promise<TopicGuideResponse> => {
    const response = await axiosInstance.post('/practice/topics/guide', payload);
    return response.data;
  },

  setTopicCovered: async (payload: {
    subjectId: string;
    unitId: string;
    topic: string;
    covered: boolean;
  }): Promise<void> => {
    await axiosInstance.put('/practice/topics/progress', payload);
  },

  getPyqPapers: async (subjectId: string): Promise<PracticePyqPaper[]> => {
    const response = await axiosInstance.get(`/practice/subjects/${subjectId}/pyq-papers`);
    return response.data;
  },

  getPyqPaperQuestions: async (
    resourceId: string,
    marks?: number
  ): Promise<PracticePyqPaperQuestions> => {
    const response = await axiosInstance.get(`/practice/resources/${resourceId}/pyq-questions`, {
      params: marks ? { marks } : {},
    });
    return response.data;
  },

  generateExamAnswer: async (questionId: string): Promise<{ answer: string }> => {
    const response = await axiosInstance.post(`/practice/questions/${questionId}/exam-answer`);
    return response.data;
  },
};
