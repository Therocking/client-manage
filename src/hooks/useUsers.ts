import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import type { User, UserFormData } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async (payload: UserFormData): Promise<User> => {
    const user = await userService.create(payload);
    setUsers(prev => [...prev, user]);
    return user;
  }, []);

  const updateUser = useCallback(async (id: string, payload: Partial<UserFormData>): Promise<User> => {
    const updated = await userService.update(id, payload);
    setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
    return updated;
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    await userService.remove(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser };
}
