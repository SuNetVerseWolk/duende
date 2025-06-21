import { setsApi, SetWithCards } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserId } from '@/hooks/useAuth';
import { Sets } from '../../generated/prisma';

// Helper type for create/update DTOs (omits auto-generated fields)
type SetMutationDto = Omit<Sets, 'id' | 'id_profile'>;

//export const useSets = () => {
//  return useQuery<GroupedSetsResponse>({
//    queryKey: ['sets'],
//    queryFn: () => setsApi.findAll().then(res => res.data),
//  });
//};

export const useSet = (id: string) => {
  const userId = useUserId();
  return useQuery<SetWithCards>({
    queryKey: ['set', id],
    queryFn: () => setsApi.findOne(id, userId).then(res => res.data),
    enabled: !!id && !!userId,
  });
};

export const useUserSets = (userId?: string, includePrivate = false) => {
  const currentUserId = useUserId();
  const targetUserId = userId || currentUserId;
  
  return useQuery<SetWithCards[]>({
    queryKey: ['userSets', targetUserId, includePrivate],
    queryFn: () => setsApi.findByUser(targetUserId!, includePrivate).then(res => res.data),
    enabled: !!targetUserId,
  });
};

export const useCreateSet = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  
  return useMutation({
    mutationFn: (createSetDto: SetMutationDto) => 
      setsApi.create(createSetDto, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
      queryClient.invalidateQueries({ queryKey: ['mySets'] });
      queryClient.invalidateQueries({ queryKey: ['groupedSets'] });
    },
  });
};

export const useUpdateSet = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: bigint, data: Partial<SetMutationDto> }) => 
      setsApi.update(id, data, userId!),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.invalidateQueries({ queryKey: ['set', id] });
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
      queryClient.invalidateQueries({ queryKey: ['groupedSets'] });
    },
  });
};

export const useDeleteSet = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  
  return useMutation({
    mutationFn: (id: bigint) => setsApi.remove(id, userId!),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['sets'] });
      queryClient.removeQueries({ queryKey: ['set', id] });
      queryClient.invalidateQueries({ queryKey: ['userSets'] });
      queryClient.invalidateQueries({ queryKey: ['groupedSets'] });
    },
  });
};