export type UserType = 'admin' | 'scheduler';

export interface BaseUser {
  id: number;
  email: string;
  password?: string; // Optional for responses
  name: string;
  phone: string;
  createdAt: string;
  active?: boolean;
}

export interface AdminUser extends BaseUser {
  type: 'admin';
  barbershopName: string;
  address: string;
  services?: string[]; // Optional for API compatibility
  businessHours?: {
    monday: { open: string; close: string; closed?: boolean };
    tuesday: { open: string; close: string; closed?: boolean };
    wednesday: { open: string; close: string; closed?: boolean };
    thursday: { open: string; close: string; closed?: boolean };
    friday: { open: string; close: string; closed?: boolean };
    saturday: { open: string; close: string; closed?: boolean };
    sunday: { open: string; close: string; closed?: boolean };
  };
}

export interface SchedulerUser extends BaseUser {
  type: 'scheduler';
  preferences?: {
    favoriteBarber?: string;
    serviceType?: string;
  };
}

export type User = AdminUser | SchedulerUser;

// API Request/Response types
export interface RegisterAdminRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  barbershopName: string;
  address: string;
}

export interface RegisterSchedulerRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
    phone: string;
    type: UserType;
    barbershopName?: string;
    address?: string;
    createdAt: string;
  };
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  type: UserType;
  barbershopName?: string;
  address?: string;
  createdAt: string;
}

