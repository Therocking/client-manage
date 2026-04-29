import { useState, useEffect, useCallback, type FormEvent } from 'react';
import type { Address, AddressFormData } from '../../types';

interface AddressFormProps {
  initialData?: Address | null;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EMPTY: AddressFormData = { street: '', city: '', country: '', zip: '' };

interface FormErrors {
  street?: string;
  city?: string;
  country?: string;
  zip?: string;
}

export function AddressForm({ initialData, onSubmit, onCancel, isLoading = false }: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      const { id: _id, userId: _uid, ...rest } = initialData;
      setForm(rest);
    } else {
      setForm(EMPTY);
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  const validate = useCallback((data: AddressFormData): FormErrors => {
    const e: FormErrors = {};
    if (!data.street.trim()) e.street = 'Street is required';
    if (!data.city.trim()) e.city = 'City is required';
    if (!data.country.trim()) e.country = 'Country is required';
    if (!data.zip.trim()) e.zip = 'ZIP code is required';
    return e;
  }, []);

  const handleChange = (field: keyof AddressFormData, value: string) => {
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

  const handleBlur = (field: keyof AddressFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const fieldError = validate(form)[field];

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ street: true, city: true, country: true, zip: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSubmit(form);
  };

  const fields: { key: keyof AddressFormData; label: string; placeholder: string }[] = [
    { key: 'street', label: 'Street *', placeholder: '123 Maple St' },
    { key: 'city', label: 'City *', placeholder: 'San Francisco' },
    { key: 'country', label: 'Country *', placeholder: 'USA' },
    { key: 'zip', label: 'ZIP Code *', placeholder: '94102' },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label htmlFor={`addr-${key}`} className="label">{label}</label>
          <input
            id={`addr-${key}`}
            type="text"
            placeholder={placeholder}
            value={form[key]}
            onChange={e => handleChange(key, e.target.value)}
            onBlur={() => handleBlur(key)}
            className={`input ${errors[key] ? 'input-error' : ''}`}
          />
          {errors[key] && (
            <p className="mt-1 text-xs text-red-400">{errors[key]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={isLoading}>
          Cancel
        </button>
        <button id="submit-address-form" type="submit" className="btn-primary flex-1" disabled={isLoading}>
          {isLoading ? 'Saving…' : initialData ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
}
