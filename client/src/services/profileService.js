import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const getProfile = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.USERS.ME);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put(API_ENDPOINTS.USERS.ME, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await api.put(API_ENDPOINTS.USERS.PASSWORD, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.put(API_ENDPOINTS.USERS.AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPublicProfile = async (userId) => {
  try {
    const response = await api.get(API_ENDPOINTS.USERS.PUBLIC_PROFILE(userId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
