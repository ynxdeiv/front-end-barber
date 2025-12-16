import { Barbeiro } from '../models/barbeiro';

export const BARBEIROS: Barbeiro[] = [
  {
    id: 1,
    name: 'Carlos Silva',
    email: 'carlos.silva@barber.com',
    phone: '71996352184',
    specialty: 'Corte Clássico',
    active: true,
    commissionPercentage: 50,
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao.santos@barber.com',
    phone: '75999245678',
    specialty: 'Barba e Bigode',
    active: true,
    commissionPercentage: 45,
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@barber.com',
    phone: '98982263425',
    specialty: 'Completo',
    active: true,
    commissionPercentage: 55,
    createdAt: new Date('2024-01-20').toISOString()
  }
];

