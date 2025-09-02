import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTaskComments,
  createComment,
  updateComment,
  deleteComment,
  uploadCommentAttachment,
} from '../services/commentService';

export const useTaskComments = (taskId) => {
  return useQuery({
    queryKey: ['comments', 'task', taskId],
    queryFn: () => getTaskComments(taskId),
    enabled: !!taskId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, commentData }) => createComment(taskId, commentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'task', variables.taskId] });
    },
    onError: (error) => {
      console.error('Create comment error:', error);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, commentData }) => updateComment(commentId, commentData),
    onSuccess: () => {
      // Invalidate all comment queries since we don't know which task the comment belongs to
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      console.error('Update comment error:', error);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      // Invalidate all comment queries since we don't know which task the comment belongs to
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      console.error('Delete comment error:', error);
    },
  });
};

export const useUploadCommentAttachment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, commentId, file }) => uploadCommentAttachment(projectId, commentId, file),
    onSuccess: () => {
      // Invalidate all comment queries since we don't know which task the comment belongs to
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      console.error('Upload comment attachment error:', error);
    },
  });
};
