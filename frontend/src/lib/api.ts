import axios from "axios";
import { profiles, Sets } from "../../generated/prisma";
import { supabase } from "./supabaseClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  } catch (error) {
    console.error("Failed to set auth token", error);
    throw error;
  }
});

const handleApiError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || defaultMessage);
  }
  throw new Error(defaultMessage);
};

const updateProfile = async (
  id: string,
  profileData: Partial<profiles>,
  avatar?: File
): Promise<profiles> => {
  try {
    const formData = new FormData();
    
    // Append profile data
		Object.entries(profileData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // Handle arrays (both empty and non-empty)
      if (Array.isArray(value) && typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      }
      // Handle primitive values
      else {
        formData.append(key, String(value));
      }
    });
    
    // Append avatar if provided
    if (avatar) {
      formData.append('avatar', avatar);
    }

    const response = await api.put<profiles>(`/profiles/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, `Failed to update profile with ID ${id}`);
  }
};

//export type SetWithCount = Sets & {
//  _count: { Cards: number };
//  Profile: { name: string };
//};
export type SetWithCards = Sets & {
	_count: { Cards: number },
	Cards?: Cards[]
}

export type WholeProfiles = profiles & {
	_count: { Sets: number },
	Sets: SetWithCards[]
}
export type Cards = {
    id: string; // was bigint
    created_at: Date;
    text: string | null;
    translation: string | null;
    id_set: string | null; // was bigint | null
}

export const profileApi = {
  getMyProfile: (id: string) => api.get<profiles>(`/profiles/me/${id}`),
  updateMyProfile: updateProfile,
  getMySets: (id: string) => api.get<SetWithCards[]>(`/profiles/me/${id}/sets`),
	getAllProfiles: () => api.get<WholeProfiles[]>(`/profiles/all`),
  getUserSets: (userId: string) => api.get<SetWithCards[]>(`/profiles/${userId}/sets`),
};

export const setsApi = {
  create: (createSetDto: Omit<Sets, "id" | "id_profile" | "created_at">, userId: string) =>
    api.post<Sets>(`/sets/${userId}`, createSetDto),
  //findAll: () =>
  //  api.get<GroupedSetsResponse>(`/sets`),
  findOne: (id: string, userId?: string) =>
    api.get<SetWithCards>(`/sets/${userId}/${id}`),
  update: (id: bigint, updateSetDto: Partial<Sets>, userId: string) =>
    api.patch<Sets>(`/sets/${userId}/${id}`, updateSetDto),
  remove: (id: bigint, userId: string) =>
    api.delete<void>(`/sets/${userId}/${id}`),
  findByUser: (profileId: string, includePrivate: boolean = false) =>
    api.get<SetWithCards[]>(`/sets/user/${profileId}`),
};

export const cardsApi = {
  create: (userId: string, createCardDto: any) =>
    api.post(`/cards/${userId}`, {
      ...createCardDto,
      //id_set: createCardDto.id_set?.toString() // Ensure string conversion
    }),
  findAllForSet: (setId: string, userId: string) =>
    api.get<Cards[]>(`/cards/set/${setId}/by/${userId}`),
  findOne: (id: bigint, userId: string) =>
    api.get<Cards>(`/cards/${id}/by/${userId}`),
  update: (id: string, userId: string, updateCardDto: Omit<Cards, 'id' | 'created_at'>) =>
    api.patch(`/cards/${id}/by/${userId}`, updateCardDto),
  remove: (id: string, userId: string) =>
    api.delete(`/cards/${id}/by/${userId}`),
};

export default api;
