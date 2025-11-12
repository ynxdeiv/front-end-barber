export interface Appointment {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Format: "HH:MM - HH:MM"
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  userId?: string; // Opcional: para identificar o usuário que fez o agendamento
  createdAt: string; // ISO date string
}

