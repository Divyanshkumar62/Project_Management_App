import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const getTaskComments = async (taskId) => {
  try {
    const response = await api.get(API_ENDPOINTS.COMMENTS.TASK_COMMENTS(taskId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createComment = async (taskId, commentData) => {
  try {
    const response = await api.post(API_ENDPOINTS.COMMENTS.TASK_COMMENTS(taskId), commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateComment = async (commentId, commentData) => {
  try {
    const response = await api.put(API_ENDPOINTS.COMMENTS.BY_ID(commentId), commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const uploadCommentAttachment = async (projectId, commentId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      API_ENDPOINTS.UPLOADS.COMMENT_ATTACHMENT(projectId, commentId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
