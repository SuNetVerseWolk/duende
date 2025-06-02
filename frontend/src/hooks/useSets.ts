import { setsApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserId } from '@/hooks/useAuth';

export const useSets = () => {
  return useQuery({
    queryKey: ['sets'],
    queryFn: () => setsApi.findAll().then(res => res.data),
  });
};

export const useSet = (id: bigint) => {
	const userId = useUserId();

  return useQuery({
    queryKey: ['set', id],
    queryFn: () => setsApi.findOne(userId!, id).then(res => res.data),
    enabled: !!id && !!userId,
  });
};

export const useUserSets = (userId?: string, includePrivate?: boolean) => {
  const currentUserId = useUserId();
  const targetUserId = userId || currentUserId;

  return useQuery({
    queryKey: ['userSets', targetUserId, includePrivate],
    queryFn: () => setsApi.findByUser(targetUserId!, includePrivate).then(res => res.data),
    enabled: !!targetUserId,
  });
};

export const useCreateSet = () => {
  const queryClient = useQueryClient();
	const userId = useUserId();
  
  return useMutation({
    mutationFn: (createSetDto: any) => setsApi.create(userId!, createSetDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      // Also invalidate any user-specific sets queries
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
    },
  });
};

export const useUpdateSet = (id: bigint) => {
  const queryClient = useQueryClient();
	const userId = useUserId();
  
  return useMutation({
    mutationFn: (updateSetDto: any) => setsApi.update(userId!, id, updateSetDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.invalidateQueries({ queryKey: ['set', id] });
      // Also invalidate any user-specific sets queries
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
    },
  });
};

export const useDeleteSet = (id: bigint) => {
  const queryClient = useQueryClient();
	const userId = useUserId();
  
  return useMutation({
    mutationFn: () => setsApi.remove(userId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.removeQueries({ queryKey: ['set', id] });
      // Also invalidate any user-specific sets queries
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
    },
  });
};