import { AdminUser, SchedulerUser } from '../models/user';

// Admin padrão do sistema
export const DEFAULT_ADMIN: AdminUser = {
  id: 1,
  type: 'admin',
  email: 'admin@barber.com',
  password: 'admin123',
  name: 'Administrador',
  phone: '(71) 99999-9999',
  barbershopName: 'Barber Agenda',
  address: 'Rua Exemplo, 123 - Salvador, BA',
  services: ['Corte Masculino', 'Barba Completa', 'Corte + Barba', 'Sobrancelha'],
  businessHours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '18:00', closed: false },
    sunday: { open: '09:00', close: '18:00', closed: true },
  },
  createdAt: new Date().toISOString(),
};

// Cliente padrão para testes
export const DEFAULT_SCHEDULER: SchedulerUser = {
  id: 2,
  type: 'scheduler',
  email: 'cliente@barber.com',
  password: 'cliente123',
  name: 'Cliente Teste',
  phone: '(71) 88888-8888',
  preferences: {},
  createdAt: new Date().toISOString(),
};
