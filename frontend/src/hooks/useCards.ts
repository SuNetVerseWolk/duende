import { cardsApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserId } from './useAuth';

export const useCardsForSet = (setId: bigint) => {
	const userId = useUserId();

  return useQuery({
    queryKey: ['cards', 'set', setId, userId],
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
    mutationFn: (createCardDto: any) => cardsApi.create(userId!, createCardDto),
    onSuccess: (_, variables) => {
      // Invalidate the cards query for the specific set
      if (variables.setId) {
        queryClient.invalidateQueries({
          queryKey: ['cards', 'set', variables.setId, userId],
        });
      }
    },
  });
};

export const useUpdateCard = (id: bigint) => {
  const queryClient = useQueryClient();
	const userId = useUserId();
  
  return useMutation({
    mutationFn: (updateCardDto: any) => cardsApi.update(id, userId!, updateCardDto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['card', id, userId],
      });
      // Also invalidate any set-specific cards queries
      queryClient.invalidateQueries({
        queryKey: ['cards', 'set'],
      });
    },
  });
};

export const useDeleteCard = (id: bigint) => {
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
        queryKey: ['cards', 'set'],
      });
    },
  });
};