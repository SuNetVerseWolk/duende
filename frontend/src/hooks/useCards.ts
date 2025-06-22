import { Cards, cardsApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserId } from './useAuth';

export const useCardsForSet = (setId: string) => {
  const userId = useUserId();

  return useQuery({
    queryKey: ['set', setId, 'cards'],
    queryFn: () => cardsApi.findAllForSet(setId, userId!).then(res => res.data),
    enabled: !!setId && !!userId,
  });
};

export const useCard = (id: bigint) => {
	const userId = useUserId();

  return useQuery({
    queryKey: ['card', id, userId],
    queryFn: () => cardsApi.findOne(id, userId!).then(res => res.data),
    enabled: !!id && !!userId,
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  
  return useMutation({
    mutationFn: (createCardDto: Omit<Cards, "id" | "created_at">) => cardsApi.create(userId!, createCardDto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['set', variables.id_set, 'cards'],
      });
    },
  });
};

export const useUpdateCard = (id: string) => {
  const queryClient = useQueryClient();
	const userId = useUserId();
  
  return useMutation({
    mutationFn: (updateCardDto: Omit<Cards, 'id' | 'created_at'>) => cardsApi.update(id, userId!, updateCardDto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['card', id, userId],
      });
      // Also invalidate any set-specific cards queries
      queryClient.invalidateQueries({
        queryKey: ['set'],
      });
    },
  });
};

export const useDeleteCard = (id: string) => {
  const queryClient = useQueryClient();
	const userId = useUserId();
  
  return useMutation({
    mutationFn: () => cardsApi.remove(id, userId!),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['card', id, userId],
      });
      // Also invalidate any set-specific cards queries
      queryClient.invalidateQueries({
        queryKey: ['set'],
      });
    },
  });
};