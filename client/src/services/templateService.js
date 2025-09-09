import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const getTemplates = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_ENDPOINTS.TEMPLATES.BASE}?${query}` : API_ENDPOINTS.TEMPLATES.BASE;
    const response = await api.get(url);

    // Normalize response - handle both array and object with templates property
    return Array.isArray(response.data?.templates)
      ? response.data.templates
      : Array.isArray(response.data)
      ? response.data
      : [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createTemplate = async (templateData) => {
  try {
    const response = await api.post(API_ENDPOINTS.TEMPLATES.BASE, templateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProjectFromTemplate = async (templateId, projectData) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.TEMPLATES.CREATE_PROJECT_FROM_TEMPLATE(templateId),
      projectData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.TEMPLATES.BASE}/${templateId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
