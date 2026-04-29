import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/users', label: 'Clients', icon: Users, exact: false },
];

function NavLink({ to, label, icon: Icon, exact }: typeof navItems[0]) {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === to : pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
        ${isActive
          ? 'bg-brand-600/20 text-brand-300 ring-1 ring-brand-500/30'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`}
    >
      <Icon size={16} className={isActive ? 'text-brand-400' : ''} />
      {label}
    </Link>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col border-r border-white/5 bg-surface-950 px-4 py-6 gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600">
            <Users size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-100 tracking-tight">ClientManager</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex md:hidden items-center gap-3 border-b border-white/5 bg-surface-950 px-4 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
            <Users size={13} className="text-white" />
          </div>
          <span className="font-bold text-slate-100">ClientManager</span>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
