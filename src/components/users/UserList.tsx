import { memo, useCallback } from 'react';
import type { User } from '../../types';
import { UserCard } from './UserCard';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => Promise<void>;
}

export const UserList = memo(function UserList({ users, onEdit, onDelete }: UserListProps) {
  const handleDelete = useCallback(
    (id: string) => onDelete(id),
    [onDelete]
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          addressCount={user.addresses?.length ?? 0}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
});
