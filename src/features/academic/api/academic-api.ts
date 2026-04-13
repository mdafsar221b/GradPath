import axiosInstance from '@/shared/lib/axios';

export const academicApi = {
  getSubjects: async (semester: number) => {
    const response = await axiosInstance.get(`/academic/subjects/${semester}`);
    return response.data;
  },
  getUnits: async (subjectId: string) => {
    const response = await axiosInstance.get(`/academic/units/${subjectId}`);
    return response.data;
  },
};
