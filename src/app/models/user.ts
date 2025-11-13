export type UserType = 'admin' | 'scheduler';

export interface BaseUser {
  id: number;
  email: string;
  password: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface AdminUser extends BaseUser {
  type: 'admin';
  barbershopName: string;
  address: string;
  services: string[];
  businessHours: {
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
  preferences: {
    favoriteBarber?: string;
    serviceType?: string;
  };
}

export type User = AdminUser | SchedulerUser;
