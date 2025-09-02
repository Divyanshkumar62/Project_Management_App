import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const getProjectActivities = async (projectId) => {
  try {
    const response = await api.get(API_ENDPOINTS.ACTIVITY.PROJECT_ACTIVITY(projectId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Alias for backward compatibility
export const getProjectActivity = getProjectActivities;
