import api from './api';
import { API_ENDPOINTS } from '../constants/api';

export const getNotifications = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Default export for backward compatibility
const notificationService = {
  getNotifications,
  markAsRead,
  deleteNotification,
};

export default notificationService;
