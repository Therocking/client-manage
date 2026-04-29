import api from './api';
import type { Address, AddressFormData } from '../types';

export const addressService = {
  getByUserId: async (userId: string): Promise<Address[]> => {
    const { data } = await api.get<Address[]>(`/addresses?userId=${userId}`);
    return data;
  },

  create: async (userId: string, payload: AddressFormData): Promise<Address> => {
    const { data } = await api.post<Address>('/addresses', { ...payload, userId });
    return data;
  },

  update: async (id: string, payload: Partial<AddressFormData>): Promise<Address> => {
    const { data } = await api.patch<Address>(`/addresses/${id}`, payload);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
};
