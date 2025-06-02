// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // for cookies if you're using them for auth
});

// Profiles API
export const profileApi = {
  getMyProfile: () => api.get('/profiles/me').then(res => res.data),
  
  updateMyProfile: (updateData: any) => 
    api.patch('/profiles/me', updateData).then(res => res.data),
  
  getMySets: () => 
    api.get('/profiles/me/sets').then(res => res.data),
  
  getUserSets: (userId: string) => 
    api.get(`/profiles/${userId}/sets`).then(res => res.data),
};

// Add other API endpoints here as needed

export default api;