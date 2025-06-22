
"use client";
import { profileApi, SetWithCards } from '@/lib/api';
import { supabase } from '@/lib/supabaseClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

// Base user fetching function
const fetchUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return user;
};

// Main user query hook
export const useUser = () => {
  return useQuery({ 
    queryKey: ["user"], 
    queryFn: fetchUser 
  });
};

// Helper hook to get the user ID
export const useUserId = () => {
  const { data: user } = useUser();
  return user?.id;
};

// Profile hooks
export const useProfile = (id?: string) => {
  const userId = id || useUserId();
  
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileApi.getMyProfile(userId!).then(res => res.data),
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  
  return useMutation({
    mutationFn: (updateProfileDto: any, avatar?: File) => profileApi.updateMyProfile(userId!, updateProfileDto, avatar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
};

// Sets hooks
export const useMySets = () => {
  const userId = useUserId();
  
  return useQuery({
    queryKey: ['mySets', userId],
    queryFn: () => profileApi.getMySets(userId!).then(res => res.data),
    enabled: !!userId,
  });
};

export const useUserSets = (userId?: string) => {
  // If no userId is provided, use the current user's ID
  const currentUserId = useUserId();
	
	if (currentUserId === userId || !userId) {
		return useMySets;
	}
  
  return useQuery<SetWithCards[]>({
    queryKey: ['userSets', userId],
    queryFn: () => profileApi.getUserSets(userId!).then(res => res.data),
    enabled: !!userId,
  });
};

export const useWholeProfiles = () => {
	return useQuery({
		queryKey: ['wholeProfiles'],
		queryFn: () => profileApi.getAllProfiles().then(res => res.data)
	})
}