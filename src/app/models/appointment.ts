import { User } from './user';

export type AppointmentStatus = 'pending_payment' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Format: "HH:MM - HH:MM"
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  userId?: number; // ID do usuário que fez o agendamento
  userName?: string; // Nome do usuário (para exibição rápida)
  userEmail?: string; // Email do usuário (para referência)
  serviceId?: number; // ID do serviço selecionado
  serviceName?: string; // Nome do serviço (para exibição)
  servicePrice?: number; // Preço do serviço
  barberId?: number; // ID do barbeiro
  barberName?: string; // Nome do barbeiro
  status: AppointmentStatus; // Status do agendamento
  paymentId?: string; // ID do pagamento associado
  createdAt: string; // ISO date string
  confirmedAt?: string; // ISO date string - quando foi confirmado
}

