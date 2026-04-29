import type { User, UserFormData } from '../types';
import api from './api';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users?_embed=addresses');
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  create: async (payload: UserFormData): Promise<User> => {
    const { data } = await api.post<User>('/users', payload);
    return data;
  },

  update: async (id: string, payload: Partial<UserFormData>): Promise<User> => {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
