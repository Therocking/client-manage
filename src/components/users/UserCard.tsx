import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, MapPin, ExternalLink } from 'lucide-react';
import type { User } from '../../types';
import { LazyImage } from '../ui/LazyImage';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => Promise<void>;
  addressCount?: number;
}

export const UserCard = memo(function UserCard({ user, onEdit, onDelete, addressCount = 0 }: UserCardProps) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await onDelete(user.id);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }, [onDelete, user.id]);

  return (
    <>
      <div className="card group flex flex-col gap-4 p-5 hover:border-brand-500/30 hover:shadow-glow transition-all duration-300 animate-slideUp">
        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <LazyImage
            src={user.photo}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-14 w-14 rounded-2xl flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-slate-100 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-slate-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Address badge */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={12} className="text-brand-400" />
          <span>{addressCount} {addressCount === 1 ? 'address' : 'addresses'}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            id={`view-user-${user.id}`}
            onClick={() => navigate(`/users/${user.id}`)}
            className="btn-primary flex-1 justify-center text-xs py-1.5"
          >
            <ExternalLink size={13} />
            View
          </button>
          <button
            id={`edit-user-${user.id}`}
            onClick={() => onEdit(user)}
            className="btn-secondary p-2"
            aria-label="Edit user"
          >
            <Pencil size={14} />
          </button>
          <button
            id={`delete-user-${user.id}`}
            onClick={() => setConfirmOpen(true)}
            className="btn-danger p-2"
            aria-label="Delete user"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete client?"
        message={`This will permanently remove ${user.firstName} ${user.lastName} and all their addresses.`}
        isLoading={deleting}
      />
    </>
  );
});
