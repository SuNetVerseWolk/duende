import axios from "axios";
import { Cards, profiles, Sets } from "../../generated/prisma";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export type SetWithCount = Sets & {
  _count: { Cards: number };
  Profile: { name: string };
};

export type GroupedSetsResponse = Array<{
  profileId: string;
  profileName: string;
  sets: Array<Sets & { cardsCount: number }>;
}>;

export const profileApi = {
  getMyProfile: (id: string) => api.get<profiles>(`/profiles/me/${id}`),
  updateMyProfile: (id: string, updateProfileDto: any) =>
    api.patch(`/profiles/me/${id}`, updateProfileDto),
  getMySets: (id: string) => api.get<Sets[]>(`/profiles/me/${id}/sets`),
  getUserSets: (userId: string) => api.get<Sets[]>(`/profiles/${userId}/sets`),
};

export const setsApi = {
  create: (createSetDto: Omit<Sets, "id" | "id_profile">, userId: string) =>
    api.post<Sets>(`/sets/${userId}`, createSetDto),
  findAll: () =>
    api.get<GroupedSetsResponse>(`/sets`),
  findOne: (id: bigint, userId?: string) =>
    api.get<SetWithCount>(`/sets/${userId}/${id}`),
  update: (id: bigint, updateSetDto: Partial<Sets>, userId: string) =>
    api.patch<Sets>(`/sets/${userId}/${id}`, updateSetDto),
  remove: (id: bigint, userId: string) =>
    api.delete<void>(`/sets/${userId}/${id}`),
  findByUser: (profileId: string, includePrivate: boolean = false) =>
    api.get<SetWithCount[]>(`/sets/user/${profileId}`, {
      params: { includePrivate },
    }),
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
