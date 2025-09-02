import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  fetchTasks,
  fetchUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  uploadTaskAttachment,
  deleteAttachment,
} from '../services/taskService';

export const useTasks = (projectId, params = {}) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasks(projectId, params),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserTasks = (params = {}) => {
  return useQuery({
    queryKey: ['tasks', 'user', params],
    queryFn: () => fetchUserTasks(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTask = (projectId, taskId) => {
  return useQuery({
    queryKey: ['tasks', projectId, taskId],
    queryFn: () => getTaskById(projectId, taskId),
    enabled: !!(projectId && taskId),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, taskData }) => createTask(projectId, taskData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Create task error:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, taskId, taskData }) => updateTask(projectId, taskId, taskData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId, variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Update task error:', error);
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, taskId, status }) => updateTaskStatus(projectId, taskId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId, variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Update task status error:', error);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, taskId }) => deleteTask(projectId, taskId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Delete task error:', error);
    },
  });
};

export const useUploadTaskAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, taskId, file }) => uploadTaskAttachment(projectId, taskId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId, variables.taskId] });
    },
    onError: (error) => {
      console.error('Upload attachment error:', error);
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      // Invalidate all task queries since we don't know which task the attachment belonged to
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Delete attachment error:', error);
    },
  });
};
