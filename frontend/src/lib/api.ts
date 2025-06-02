import axios from "axios";
import { Cards, profiles, Sets } from "../../generated/prisma";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const profileApi = {
  getMyProfile: (id: string) => api.get<profiles>(`/profiles/me/${id}`),
  updateMyProfile: (id: string, updateProfileDto: any) =>
    api.patch(`/profiles/me/${id}`, updateProfileDto),
  getMySets: (id: string) => api.get<Sets[]>(`/profiles/me/${id}/sets`),
  getUserSets: (userId: string) => api.get<Sets[]>(`/profiles/${userId}/sets`),
};

export const setsApi = {
  create: (userId: string, createSetDto: any) => api.post(`/sets/${userId}`, createSetDto),
  findAll: () => api.get<Sets[]>("/sets"),
  findOne: (userId: string, id: bigint) => api.get<Sets>(`/sets/${userId}/${id}`),
  update: (userId: string, id: bigint, updateSetDto: any) =>
    api.patch(`/sets/${userId}/${id}`, updateSetDto),
  remove: (userId: string, id: bigint) => api.delete(`/sets/${userId}/${id}`),
  findByUser: (userId: string, includePrivate?: boolean) =>
    api.get<Sets[]>(`/sets/user/${userId}`, { params: { includePrivate } }),
};

export const cardsApi = {
  create: (userId: string, createCardDto: any) => 
    api.post(`/cards/${userId}`, createCardDto),
  findAllForSet: (setId: bigint, userId: string) => 
    api.get<Cards[]>(`/cards/set/${setId}/by/${userId}`),
  findOne: (id: bigint, userId: string) => 
    api.get<Cards>(`/cards/${id}/by/${userId}`),
  update: (id: bigint, userId: string, updateCardDto: any) => 
    api.patch(`/cards/${id}/by/${userId}`, updateCardDto),
  remove: (id: bigint, userId: string) => 
    api.delete(`/cards/${id}/by/${userId}`),
};

export default api;
