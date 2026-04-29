export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  country: string;
  zip: string;
  userId: string;
}

export type UserFormData = Omit<User, 'id'>;
export type AddressFormData = Omit<Address, 'id' | 'userId'>;
