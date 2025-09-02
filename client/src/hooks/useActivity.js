import { useQuery } from '@tanstack/react-query';
import { getProjectActivities } from '../services/activityService';

export const useProjectActivities = (projectId) => {
  return useQuery({
    queryKey: ['activity', projectId],
    queryFn: () => getProjectActivities(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
