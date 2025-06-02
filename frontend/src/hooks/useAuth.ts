import { profileApi } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => profileApi.getMyProfile(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useUpdateProfile = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updateProfileDto: any) => profileApi.updateMyProfile(id, updateProfileDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
    },
  });
};

export const useMySets = (id: string) => {
  return useQuery({
    queryKey: ['mySets', id],
    queryFn: () => profileApi.getMySets(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useUserSets = (userId: string) => {
  return useQuery({
    queryKey: ['userSets', userId],
    queryFn: () => profileApi.getUserSets(userId).then(res => res.data),
    enabled: !!userId,
  });
};

const fetchUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return user;
};

export const useUser = () => {
  return useQuery({ 
    queryKey: ["user"], 
    queryFn: fetchUser 
  });
};