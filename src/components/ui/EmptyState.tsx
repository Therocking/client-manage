import { Users } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({
  title = 'No clients yet',
  description = 'Get started by creating your first client.',
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600/10 ring-1 ring-brand-500/20">
        {icon ?? <Users className="h-9 w-9 text-brand-400" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-200">{title}</h3>
      <p className="mb-6 max-w-xs text-center text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}
