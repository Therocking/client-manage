import { useState, useEffect, useCallback, type FormEvent } from 'react';
import type { User, UserFormData } from '../../types';

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EMPTY: UserFormData = { firstName: '', lastName: '', email: '', photo: '' };

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const [form, setForm] = useState<UserFormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { id: _id, ...rest } = initialData;
      setForm(rest);
    } else {
      setForm(EMPTY);
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  const validate = useCallback((data: UserFormData): FormErrors => {
    const e: FormErrors = {};
    if (!data.firstName.trim()) e.firstName = 'First name is required';
    if (!data.lastName.trim()) e.lastName = 'Last name is required';
    if (!data.email.trim()) e.email = 'Email is required';
    else if (!validateEmail(data.email)) e.email = 'Invalid email address';
    return e;
  }, []);

  const handleChange = (field: keyof UserFormData, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);

    if (touched[field]) {
      const fieldError = validate(form)[field];

      setErrors(prev => ({
        ...prev,
        [field]: fieldError
      }));
    }
  };

  const handleBlur = (field: keyof UserFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const fieldError = validate(form)[field];

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = { firstName: true, lastName: true, email: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSubmit(form);
  };

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="firstName" className="label">First Name *</label>
        <input
          id="firstName"
          type="text"
          placeholder="Alice"
          value={form.firstName}
          onChange={e => handleChange('firstName', e.target.value)}
          onBlur={() => handleBlur('firstName')}
          className={`input ${errors.firstName ? 'input-error' : ''}`}
        />
        {errors.firstName && (
          <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="label">Last Name *</label>
        <input
          id="lastName"
          type="text"
          placeholder="Johnson"
          value={form.lastName}
          onChange={e => handleChange('lastName', e.target.value)}
          onBlur={() => handleBlur('lastName')}
          className={`input ${errors.lastName ? 'input-error' : ''}`}
        />
        {errors.lastName && (
          <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="label">Email *</label>
        <input
          id="email"
          type="email"
          placeholder="alice@example.com"
          value={form.email}
          onChange={e => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`input ${errors.email ? 'input-error' : ''}`}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="photo" className="label">Photo URL</label>
        <input
          id="photo"
          type="url"
          placeholder="https://example.com/avatar.png"
          value={form.photo}
          onChange={e => {
            handleChange('photo', e.target.value)
            setImgError(false)
          }}
          className="input"
        />
        <p className="mt-1 text-xs text-slate-500">Leave blank to use a default avatar.</p>
      </div>

      {form.photo && !imgError && (
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <img
            src={form.photo}
            alt="Preview"
            className="h-10 w-10 rounded-full object-cover border border-white/10"
            onError={() => setImgError(true)}
          />
          <span className="text-xs text-slate-400">Photo preview</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={isLoading}>
          Cancel
        </button>
        <button id="submit-user-form" type="submit" className="btn-primary flex-1" disabled={isLoading}>
          {isLoading ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Client'}
        </button>
      </div>
    </form>
  );
}
