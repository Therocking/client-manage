import { memo, useCallback, useState } from 'react';
import { Pencil, Trash2, MapPin } from 'lucide-react';
import type { Address } from '../../types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => Promise<void>;
}

export const AddressCard = memo(function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      await onDelete(address.id);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }, [onDelete, address.id]);

  return (
    <>
      <div className="card group flex items-start gap-4 p-4 hover:border-brand-500/30 transition-all duration-200 animate-slideUp">
        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600/10">
          <MapPin size={16} className="text-brand-400" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-200 text-sm">{address.street}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {address.city}, {address.zip}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{address.country}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            id={`edit-address-${address.id}`}
            onClick={() => onEdit(address)}
            className="btn-ghost p-1.5 rounded-lg"
            aria-label="Edit address"
          >
            <Pencil size={13} />
          </button>
          <button
            id={`delete-address-${address.id}`}
            onClick={() => setConfirmOpen(true)}
            className="btn-ghost p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
            aria-label="Delete address"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete address?"
        message={`Remove "${address.street}, ${address.city}" permanently?`}
        isLoading={deleting}
      />
    </>
  );
});
