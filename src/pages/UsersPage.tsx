import { useState, useMemo, useCallback } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import type { User, UserFormData } from '../types';
import { useUsers } from '../hooks/useUsers';
import { UserList } from '../components/users/UserList';
import { UserForm } from '../components/users/UserForm';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';

export default function UsersPage() {
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = useCallback(() => {
    setEditingUser(null);
    setDrawerOpen(true);
  }, []);

  const openEdit = useCallback((user: User) => {
    setEditingUser(user);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setEditingUser(null);
  }, []);

  const handleSubmit = useCallback(async (data: UserFormData) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data);
      } else {
        await createUser(data);
      }
      closeDrawer();
    } finally {
      setSubmitting(false);
    }
  }, [editingUser, updateUser, createUser, closeDrawer]);

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
    ),
    [users]
  );

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Clients</h1>
          <p className="mt-1 text-sm text-slate-400">
            {loading ? 'Loading…' : `${users.length} client${users.length !== 1 ? 's' : ''} total`}
          </p>
        </div>
        <button id="new-user-btn" onClick={openCreate} className="btn-primary">
          <Plus size={16} />
          New Client
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center gap-4 py-20 animate-fadeIn">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <p className="text-sm text-slate-400 max-w-xs text-center">{error}</p>
          <button onClick={fetchUsers} className="btn-secondary gap-2">
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <EmptyState
          title="No clients yet"
          description="Add your first client to start managing contacts and addresses."
          action={
            <button id="empty-new-user-btn" onClick={openCreate} className="btn-primary">
              <Plus size={16} />
              New Client
            </button>
          }
        />
      )}

      {!loading && !error && users.length > 0 && (
        <UserList
          users={sortedUsers}
          onEdit={openEdit}
          onDelete={deleteUser}
        />
      )}

      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        title={editingUser ? 'Edit Client' : 'New Client'}
      >
        <UserForm
          initialData={editingUser}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
          isLoading={submitting}
        />
      </Drawer>
    </>
  );
}
