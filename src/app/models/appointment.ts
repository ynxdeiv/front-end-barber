import { User } from './user';

export type AppointmentStatus = 'pending_payment' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Format: "HH:MM - HH:MM"
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  userId?: string; // ID do usuário que fez o agendamento (referência ao data/users.ts)
  userName?: string; // Nome do usuário (para exibição rápida)
  userEmail?: string; // Email do usuário (para referência)
  serviceId?: string; // ID do serviço selecionado
  serviceName?: string; // Nome do serviço (para exibição)
  servicePrice?: number; // Preço do serviço
  status: AppointmentStatus; // Status do agendamento
  paymentId?: string; // ID do pagamento associado
  createdAt: string; // ISO date string
  confirmedAt?: string; // ISO date string - quando foi confirmado
}

