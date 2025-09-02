import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const sendInvitation = async (projectId, invitationData) => {
  try {
    const response = await api.post(
      API_ENDPOINTS.INVITATIONS.PROJECT_INVITATIONS(projectId),
      invitationData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchInvitations = async (projectId) => {
  try {
    const response = await api.get(API_ENDPOINTS.INVITATIONS.PROJECT_INVITATIONS(projectId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const acceptInvitation = async (projectId, invitationId) => {
  try {
    const response = await api.put(API_ENDPOINTS.INVITATIONS.ACCEPT(projectId, invitationId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const declineInvitation = async (projectId, invitationId) => {
  try {
    const response = await api.put(API_ENDPOINTS.INVITATIONS.DECLINE(projectId, invitationId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
