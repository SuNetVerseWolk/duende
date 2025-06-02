import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const profileApi = {
  getMyProfile: (id: string) => api.get(`/profiles/me/${id}`),
  updateMyProfile: (id: string, updateProfileDto: any) => 
    api.patch(`/profiles/me/${id}`, updateProfileDto),
  getMySets: (id: string) => api.get(`/profiles/me/${id}/sets`),
  getUserSets: (userId: string) => api.get(`/profiles/${userId}/sets`),
};

export default api;