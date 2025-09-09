import api from './api';
import { API_ENDPOINTS } from '../constants/api';

// Get user resource profile
export const getUserResourceProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.RESOURCES.PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user resource profile
export const updateUserResourceProfile = async (resourceData) => {
  try {
    const response = await api.put(API_ENDPOINTS.RESOURCES.PROFILE, resourceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get project resources
export const getProjectResources = async (projectId) => {
  try {
    const response = await api.get(API_ENDPOINTS.RESOURCES.PROJECT_RESOURCES(projectId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Allocate resource to project
export const allocateResource = async (projectId, allocationData) => {
  try {
    const payload = { ...allocationData, projectId };
    const response = await api.post(
      API_ENDPOINTS.RESOURCES.ALLOCATE_RESOURCE(projectId),
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update resource allocation
export const updateAllocation = async (projectId, allocationId, updateData) => {
  try {
    const response = await api.put(
      API_ENDPOINTS.RESOURCES.UPDATE_ALLOCATION(projectId, allocationId),
      updateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Remove resource allocation
export const removeAllocation = async (allocationId) => {
  try {
    const response = await api.delete(
      API_ENDPOINTS.RESOURCES.REMOVE_ALLOCATION(allocationId)
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user availability
export const updateUserAvailability = async (availabilityData) => {
  try {
    const response = await api.put(API_ENDPOINTS.RESOURCES.AVAILABILITY, availabilityData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
