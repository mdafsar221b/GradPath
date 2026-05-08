import axiosInstance from '@/shared/lib/axios';
import {
  DiscussionAuthorSnapshot,
  DiscussionContextRequest,
  DiscussionContextResponse,
  DiscussionReply,
} from '../model/discussion.types';

export const discussionApi = {
  getContext: async (params: DiscussionContextRequest): Promise<DiscussionContextResponse> => {
    const response = await axiosInstance.get('/discussions/context', { params });
    return response.data;
  },

  createPost: async (
    payload: DiscussionContextRequest & {
      body: string;
      parentId?: string;
      authorSnapshot?: DiscussionAuthorSnapshot;
    }
  ): Promise<{ post: DiscussionReply }> => {
    const response = await axiosInstance.post('/discussions/context/posts', payload);
    return response.data;
  },

  updatePost: async (id: string, body: string): Promise<{ post: DiscussionReply }> => {
    const response = await axiosInstance.patch(`/discussions/posts/${id}`, { body });
    return response.data;
  },

  deletePost: async (id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/discussions/posts/${id}`);
    return response.data;
  },
};
