import { useState, useEffect, useCallback } from 'react';
import type { Address, AddressFormData } from '../types';
import { addressService } from '../services/addressService';

export function useAddresses(userId: string) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await addressService.getByUserId(userId);
      setAddresses(data);
    } catch {
      setError('Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const createAddress = useCallback(async (payload: AddressFormData): Promise<Address> => {
    const address = await addressService.create(userId, payload);
    setAddresses(prev => [...prev, address]);
    return address;
  }, [userId]);

  const updateAddress = useCallback(async (id: string, payload: Partial<AddressFormData>): Promise<Address> => {
    const updated = await addressService.update(id, payload);
    setAddresses(prev => prev.map(a => (a.id === id ? updated : a)));
    return updated;
  }, []);

  const deleteAddress = useCallback(async (id: string): Promise<void> => {
    await addressService.remove(id);
    setAddresses(prev => prev.filter(a => a.id !== id));
  }, []);

  return { addresses, loading, error, fetchAddresses, createAddress, updateAddress, deleteAddress };
}
