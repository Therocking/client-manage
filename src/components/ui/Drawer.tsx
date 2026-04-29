import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function Drawer({ isOpen, onClose, title, children, width = 'max-w-lg' }: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative z-10 flex flex-col w-full ${width} bg-surface-900 border-l border-white/5 shadow-glass animate-slideInRight`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="btn-ghost p-1.5 rounded-lg"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
