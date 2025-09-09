import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const getTaskTimeEntries = async (taskId) => {
  try {
    const response = await api.get(API_ENDPOINTS.TIME_TRACKING.TASK_TIME_ENTRIES(taskId));

    // Normalize response
    return Array.isArray(response.data?.timeEntries)
      ? response.data.timeEntries
      : Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProjectTimeEntries = async (projectId) => {
  try {
    const response = await api.get(API_ENDPOINTS.TIME_TRACKING.PROJECT_TIME_ENTRIES(projectId));

    // Normalize response
    return Array.isArray(response.data?.timeEntries)
      ? response.data.timeEntries
      : Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCurrentTimer = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.TIME_TRACKING.CURRENT_TIMER);
    return response.data; // This will be null if no running timer
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const startTimeTracking = async (taskId, description = '') => {
  try {
    const response = await api.post(
      API_ENDPOINTS.TIME_TRACKING.START_TRACKING(taskId),
      { description }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const stopTimeTracking = async (taskId) => {
  try {
    const response = await api.post(API_ENDPOINTS.TIME_TRACKING.STOP_TRACKING(taskId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTimeEntry = async (entryId, updateData) => {
  try {
    const response = await api.put(API_ENDPOINTS.TIME_TRACKING.UPDATE_ENTRY(entryId), updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteTimeEntry = async (entryId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.TIME_TRACKING.UPDATE_ENTRY(entryId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Helper function to format duration in minutes to hours:minutes
export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

// Helper function to calculate duration between two dates
export const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const diffMs = end - start;
  return Math.floor(diffMs / 60000); // Convert to minutes
};

// Helper function to format time for display
export const formatTime = (date) => {
  return new Date(date).toLocaleString();
};
