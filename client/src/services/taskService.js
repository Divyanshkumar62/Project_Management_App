import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const createTask = async (projectId, taskData) => {
  try {
    const response = await api.post(API_ENDPOINTS.TASKS.PROJECT_TASKS(projectId), taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchTasks = async (projectId, params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query 
      ? `${API_ENDPOINTS.TASKS.PROJECT_TASKS(projectId)}?${query}` 
      : API_ENDPOINTS.TASKS.PROJECT_TASKS(projectId);
    const response = await api.get(url);
    
    // Handle different response formats
    return Array.isArray(response.data?.tasks) 
      ? response.data.tasks 
      : Array.isArray(response.data) 
      ? response.data 
      : [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchUserTasks = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query 
      ? `${API_ENDPOINTS.TASKS.USER_TASKS}?${query}` 
      : API_ENDPOINTS.TASKS.USER_TASKS;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTaskById = async (projectId, taskId) => {
  try {
    const response = await api.get(API_ENDPOINTS.TASKS.BY_ID(projectId, taskId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTask = async (projectId, taskId, taskData) => {
  try {
    const taskIdStr = typeof taskId === 'object' ? taskId._id || taskId.id : String(taskId);
    const response = await api.put(API_ENDPOINTS.TASKS.BY_ID(projectId, taskIdStr), taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteTask = async (projectId, taskId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.TASKS.BY_ID(projectId, taskId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Alias for backward compatibility
export const removeTask = deleteTask;

export const updateTaskStatus = async (projectId, taskId, status) => {
  try {
    const taskIdStr = typeof taskId === 'object' ? taskId._id || taskId.id : String(taskId);
    const response = await api.put(API_ENDPOINTS.TASKS.STATUS_BY_ID(projectId, taskIdStr), { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Upload attachment to task
export const uploadTaskAttachment = async (projectId, taskId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(
      API_ENDPOINTS.UPLOADS.TASK_ATTACHMENT(projectId, taskId),
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

// Delete attachment
export const deleteAttachment = async (attachmentId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.UPLOADS.DELETE_ATTACHMENT(attachmentId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
