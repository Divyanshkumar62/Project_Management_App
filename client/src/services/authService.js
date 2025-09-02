import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    console.log('✅ Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const signup = async (userData) => {
  try {
    console.log('📝 Signup request:', userData);
    const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
    console.log('✅ Signup response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Signup error:', error.response?.data || error.message);
    throw error.response?.data || { message: error.message };
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.AUTH.SEARCH_USERS}?query=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
