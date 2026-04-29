import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="mb-2 text-base font-semibold text-slate-100">{title}</h3>
        <p className="mb-6 text-sm text-slate-400">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn-secondary" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
