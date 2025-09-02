export const API_BASE_URL = "http://localhost:5001/api";

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
    TRANSFER_OWNERSHIP: (projectId, userId) => `/projects/${projectId}/transfer-ownership/${userId}`,
  },
  
  // Tasks
  TASKS: {
    BASE: "/tasks",
    USER_TASKS: "/tasks/user",
    PROJECT_TASKS: (projectId) => `/projects/${projectId}/tasks`,
    BY_ID: (projectId, taskId) => `/projects/${projectId}/tasks/${taskId}`,
  },
  
  // Invitations
  INVITATIONS: {
    PROJECT_INVITATIONS: (projectId) => `/projects/${projectId}/invitations`,
    ACCEPT: (projectId, invitationId) => `/projects/${projectId}/invitations/${invitationId}/accept`,
    DECLINE: (projectId, invitationId) => `/projects/${projectId}/invitations/${invitationId}/decline`,
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
    TASK_ATTACHMENT: (projectId, taskId) => `/uploads/projects/${projectId}/tasks/${taskId}/attachments`,
    COMMENT_ATTACHMENT: (projectId, commentId) => `/uploads/projects/${projectId}/comments/${commentId}/attachments`,
    DELETE_ATTACHMENT: (attachmentId) => `/uploads/attachments/${attachmentId}`,
  },
};
