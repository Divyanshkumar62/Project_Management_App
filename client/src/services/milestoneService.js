import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const getMilestones = async (projectId) => {
  try {
    const response = await api.get(API_ENDPOINTS.MILESTONES.PROJECT_MILESTONES(projectId));

    // Normalize response - handle both array and object with milestones property
    return Array.isArray(response.data?.milestones)
      ? response.data.milestones
      : Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createMilestone = async (projectId, milestoneData) => {
  try {
    const response = await api.post(API_ENDPOINTS.MILESTONES.PROJECT_MILESTONES(projectId), milestoneData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateMilestone = async (projectId, milestoneId, updateData) => {
  try {
    const response = await api.put(API_ENDPOINTS.MILESTONES.BY_ID(projectId, milestoneId), updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteMilestone = async (projectId, milestoneId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.MILESTONES.BY_ID(projectId, milestoneId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
