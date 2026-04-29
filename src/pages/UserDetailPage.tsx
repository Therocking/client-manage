import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, AlertCircle, Pencil } from 'lucide-react';
import type { User, Address, UserFormData, AddressFormData } from '../types';
import { userService } from '../services/userService';
import { useAddresses } from '../hooks/useAddresses';
import { AddressCard } from '../components/addresses/AddressCard';
import { AddressForm } from '../components/addresses/AddressForm';
import { UserForm } from '../components/users/UserForm';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { LazyImage } from '../components/ui/LazyImage';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [editUserOpen, setEditUserOpen] = useState(false);
  const [addressDrawerOpen, setAddressDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { addresses, loading: addrLoading, createAddress, updateAddress, deleteAddress } =
    useAddresses(id ?? '');

  useEffect(() => {
    if (!id) return;
    setUserLoading(true);
    userService.getById(id)
      .then(setUser)
      .catch(() => setUserError('User not found.'))
      .finally(() => setUserLoading(false));
  }, [id]);

  const handleUserSubmit = useCallback(async (data: UserFormData) => {
    if (!id) return;
    setSubmitting(true);
    try {
      const updated = await userService.update(id, data);
      setUser(updated);
      setEditUserOpen(false);
    } finally {
      setSubmitting(false);
    }
  }, [id]);

  const openNewAddress = useCallback(() => {
    setEditingAddress(null);
    setAddressDrawerOpen(true);
  }, []);

  const openEditAddress = useCallback((addr: Address) => {
    setEditingAddress(addr);
    setAddressDrawerOpen(true);
  }, []);

  const closeAddressDrawer = useCallback(() => {
    setAddressDrawerOpen(false);
    setEditingAddress(null);
  }, []);

  const handleAddressSubmit = useCallback(async (data: AddressFormData) => {
    setSubmitting(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await createAddress(data);
      }
      closeAddressDrawer();
    } finally {
      setSubmitting(false);
    }
  }, [editingAddress, updateAddress, createAddress, closeAddressDrawer]);

  if (userLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 animate-fadeIn">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-slate-400">{userError ?? 'User not found'}</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          <ArrowLeft size={14} />
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} />
          All Clients
        </Link>
      </div>

      <div className="card mb-8 p-6 flex flex-col sm:flex-row sm:items-center gap-6 animate-slideUp">
        <LazyImage
          src={user.photo}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-20 w-20 rounded-2xl flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-slate-100">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={12} className="text-brand-400" />
            {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
          </div>
        </div>
        <button
          id="edit-user-profile-btn"
          onClick={() => setEditUserOpen(true)}
          className="btn-secondary self-start sm:self-center gap-2"
        >
          <Pencil size={14} />
          Edit Profile
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Addresses</h2>
        <button id="add-address-btn" onClick={openNewAddress} className="btn-primary text-xs py-1.5 px-3">
          <Plus size={13} />
          Add Address
        </button>
      </div>

      {addrLoading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {!addrLoading && addresses.length === 0 && (
        <EmptyState
          title="No addresses"
          description="Add a delivery or billing address for this client."
          icon={<MapPin className="h-9 w-9 text-brand-400" />}
          action={
            <button id="empty-add-address-btn" onClick={openNewAddress} className="btn-primary text-sm">
              <Plus size={14} />
              Add Address
            </button>
          }
        />
      )}

      {!addrLoading && addresses.length > 0 && (
        <div className="flex flex-col gap-3">
          {addresses.map(addr => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={openEditAddress}
              onDelete={deleteAddress}
            />
          ))}
        </div>
      )}

      <Drawer isOpen={editUserOpen} onClose={() => setEditUserOpen(false)} title="Edit Client">
        <UserForm
          initialData={user}
          onSubmit={handleUserSubmit}
          onCancel={() => setEditUserOpen(false)}
          isLoading={submitting}
        />
      </Drawer>

      <Drawer
        isOpen={addressDrawerOpen}
        onClose={closeAddressDrawer}
        title={editingAddress ? 'Edit Address' : 'Add Address'}
        width="max-w-md"
      >
        <AddressForm
          initialData={editingAddress}
          onSubmit={handleAddressSubmit}
          onCancel={closeAddressDrawer}
          isLoading={submitting}
        />
      </Drawer>
    </>
  );
}
