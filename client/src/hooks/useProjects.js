import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProjects,
  fetchProjectWithTasks,
  createProject,
  updateProject,
  deleteProject,
  renameProject,
  archiveProject,
  transferOwnership,
  getProjectDashboard,
} from '../services/projectService';

export const useProjects = (params = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => getProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProject = (projectId) => {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => fetchProjectWithTasks(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useProjectDashboard = (projectId) => {
  return useQuery({
    queryKey: ['projects', projectId, 'dashboard'],
    queryFn: () => getProjectDashboard(projectId),
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Create project error:', error);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }) => updateProject(projectId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Update project error:', error);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      console.error('Delete project error:', error);
    },
  });
};

export const useRenameProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, newName }) => renameProject(projectId, newName),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Rename project error:', error);
    },
  });
};

export const useArchiveProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, archived }) => archiveProject(projectId, archived),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Archive project error:', error);
    },
  });
};

export const useTransferOwnership = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, userId }) => transferOwnership(projectId, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Transfer ownership error:', error);
    },
  });
};
