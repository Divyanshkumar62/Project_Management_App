// Dynamic API base URL - works for both development and production
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;

    // Development environment
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }

    // Production environment
    if (hostname.includes('project-pilot') || hostname.includes('render.com')) {
      return 'https://project-pilot-tx67.onrender.com/api';
    }
  }

  // Fallback for SSR or unknown environments
  return process.env.NODE_ENV === 'production'
    ? 'https://project-pilot-tx67.onrender.com/api'
    : 'http://localhost:5001/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    SEARCH_USERS: "/auth/search",
  },

  // Projects
  PROJECTS: {
    BASE: "/projects",
    BY_ID: (id) => `/projects/${id}`,
    DASHBOARD: (id) => `/projects/${id}/dashboard`,
    RENAME: (id) => `/projects/${id}/rename`,
    ARCHIVE: (id) => `/projects/${id}/archive`,
    TRANSFER_OWNERSHIP: (projectId, userId) =>
      `/projects/${projectId}/transfer-ownership/${userId}`,
  },

  // Tasks
  TASKS: {
    BASE: "/tasks",
    USER_TASKS: "/tasks/user",
    PROJECT_TASKS: (projectId) => `/projects/${projectId}/tasks`,
    BY_ID: (projectId, taskId) => `/projects/${projectId}/tasks/${taskId}`,
    STATUS_BY_ID: (projectId, taskId) => `/projects/${projectId}/tasks/${taskId}/status`,
  },

  // Invitations
  INVITATIONS: {
    PROJECT_INVITATIONS: (projectId) => `/projects/${projectId}/invitations`,
    ACCEPT: (projectId, invitationId) =>
      `/projects/${projectId}/invitations/${invitationId}/accept`,
    DECLINE: (projectId, invitationId) =>
      `/projects/${projectId}/invitations/${invitationId}/decline`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: "/notifications",
    MARK_READ: (id) => `/notifications/${id}/read`,
    DELETE: (id) => `/notifications/${id}`,
  },

  // Activity
  ACTIVITY: {
    PROJECT_ACTIVITY: (projectId) => `/projects/${projectId}/activity`,
  },

  // Templates
  TEMPLATES: {
    BASE: "/templates",
    CREATE_PROJECT_FROM_TEMPLATE: (templateId) =>
      `/templates/${templateId}/create-project`,
  },

  // Milestones
  MILESTONES: {
    PROJECT_MILESTONES: (projectId) => `/projects/${projectId}/milestones`,
    BY_ID: (projectId, milestoneId) =>
      `/projects/${projectId}/milestones/${milestoneId}`,
  },

  // Time Tracking
  TIME_TRACKING: {
    TASK_TIME_ENTRIES: (taskId) => `/time-entries/task/${taskId}`,
    PROJECT_TIME_ENTRIES: (projectId) => `/time-entries/project/${projectId}`,
    CURRENT_TIMER: "/time-entries/current",
    START_TRACKING: (taskId) => `/time-entries/task/${taskId}/start`,
    STOP_TRACKING: (taskId) => `/time-entries/task/${taskId}/stop`,
    UPDATE_ENTRY: (entryId) => `/time-entries/${entryId}`,
  },

  // Comments
  COMMENTS: {
    TASK_COMMENTS: (taskId) => `/tasks/${taskId}/comments`,
    BY_ID: (commentId) => `/comments/${commentId}`,
  },

  // Users
  USERS: {
    ME: "/users/me",
    PASSWORD: "/users/me/password",
    AVATAR: "/users/me/avatar",
    PUBLIC_PROFILE: (userId) => `/users/${userId}`,
  },

  // Uploads
  UPLOADS: {
    TASK_ATTACHMENT: (projectId, taskId) =>
      `/uploads/projects/${projectId}/tasks/${taskId}/attachments`,
    COMMENT_ATTACHMENT: (projectId, commentId) =>
      `/uploads/projects/${projectId}/comments/${commentId}/attachments`,
    DELETE_ATTACHMENT: (attachmentId) => `/uploads/attachments/${attachmentId}`,
  },

  // Resources
  RESOURCES: {
    PROFILE: "/resources/profile",
    AVAILABILITY: "/resources/availability",
    PROJECT_RESOURCES: (projectId) => `/projects/${projectId}/resources`,
    ALLOCATE_RESOURCE: (projectId) =>
      `/projects/${projectId}/resources/allocate`,
    UPDATE_ALLOCATION: (projectId, allocationId) =>
      `/projects/${projectId}/resources/allocations/${allocationId}`,
    REMOVE_ALLOCATION: (allocationId) =>
      `/resources/allocations/${allocationId}`,
  },
};
