import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const getProjects = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.PROJECTS.BASE}?${query}` : API_ENDPOINTS.PROJECTS.BASE;
    const response = await api.get(url);
    
    // Normalize response - handle both array and object with projects property
    return Array.isArray(response.data?.projects)
      ? response.data.projects
      : Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchProjects = async () => {
  return getProjects();
};

export const fetchProjectWithTasks = async (projectId) => {
  try {
    const response = await api.get(API_ENDPOINTS.PROJECTS.BY_ID(projectId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post(API_ENDPOINTS.PROJECTS.BASE, projectData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProject = async (projectId, updatedData) => {
  try {
    const response = await api.put(API_ENDPOINTS.PROJECTS.BY_ID(projectId), updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.PROJECTS.BY_ID(projectId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const renameProject = async (projectId, newName) => {
  try {
    const response = await api.put(API_ENDPOINTS.PROJECTS.RENAME(projectId), { newName });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const archiveProject = async (projectId, archived) => {
  try {
    const response = await api.put(API_ENDPOINTS.PROJECTS.ARCHIVE(projectId), { archived });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const transferOwnership = async (projectId, userId) => {
  try {
    const response = await api.put(API_ENDPOINTS.PROJECTS.TRANSFER_OWNERSHIP(projectId, userId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProjectDashboard = async (projectId) => {
  try {
    const response = await api.get(API_ENDPOINTS.PROJECTS.DASHBOARD(projectId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
