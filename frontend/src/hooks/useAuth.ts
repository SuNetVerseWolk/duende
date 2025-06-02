// src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../lib/api';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getMyProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: profileApi.updateMyProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile);
    },
  });
};

export const useUserSets = (userId?: string) => {
  return useQuery({
    queryKey: ['userSets', userId],
    queryFn: () => userId ? profileApi.getUserSets(userId) : profileApi.getMySets(),
    enabled: !!userId || true, // if no userId provided, fetch current user's sets
  });
};

// Example of how to use these hooks in a component:
/*
function ProfileComponent() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{profile?.name}</h1>
      <button onClick={() => updateProfile({ name: 'New Name' })}>
        Update Name
      </button>
    </div>
  );
}
*/