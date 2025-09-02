import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  sendInvitation,
  fetchInvitations,
  acceptInvitation,
  declineInvitation,
} from '../services/invitationService';

export const useInvitations = (projectId) => {
  return useQuery({
    queryKey: ['invitations', projectId],
    queryFn: () => fetchInvitations(projectId),
    enabled: !!projectId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useSendInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, invitationData }) => sendInvitation(projectId, invitationData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
    onError: (error) => {
      console.error('Send invitation error:', error);
    },
  });
};

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, invitationId }) => acceptInvitation(projectId, invitationId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Accept invitation error:', error);
    },
  });
};

export const useDeclineInvitation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, invitationId }) => declineInvitation(projectId, invitationId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invitations', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Decline invitation error:', error);
    },
  });
};
