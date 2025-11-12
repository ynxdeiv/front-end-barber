import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly STORAGE_KEY = 'barber_appointments';

  constructor() {
    // Inicializar storage se não existir
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  /**
   * Obtém todos os agendamentos
   */
  getAllAppointments(): Appointment[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Obtém agendamentos para uma data específica
   */
  getAppointmentsByDate(date: Date): Appointment[] {
    const allAppointments = this.getAllAppointments();
    const dateString = this.formatDate(date);
    return allAppointments.filter(apt => apt.date === dateString);
  }

  /**
   * Verifica se um horário específico está disponível
   */
  isTimeSlotAvailable(date: Date, startTime: string, endTime: string): boolean {
    const appointments = this.getAppointmentsByDate(date);
    
    if (appointments.length === 0) {
      return true;
    }

    // Converter horários para minutos para comparação precisa
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // Verificar se há sobreposição com algum agendamento existente
    return !appointments.some(apt => {
      const aptStart = timeToMinutes(apt.startTime);
      const aptEnd = timeToMinutes(apt.endTime);

      // Verifica se há sobreposição de horários
      // Há sobreposição se:
      // 1. O novo horário começa durante um agendamento existente
      // 2. O novo horário termina durante um agendamento existente
      // 3. O novo horário engloba completamente um agendamento existente
      return (
        (newStart >= aptStart && newStart < aptEnd) ||
        (newEnd > aptStart && newEnd <= aptEnd) ||
        (newStart <= aptStart && newEnd >= aptEnd)
      );
    });
  }

  /**
   * Cria um novo agendamento
   */
  createAppointment(date: Date, time: string, userId?: string): Appointment | null {
    // Extrair startTime e endTime do formato "HH:MM - HH:MM"
    const [startTime, endTime] = time.split(' - ').map(t => t.trim());
    
    if (!startTime || !endTime) {
      console.error('Formato de horário inválido:', time);
      return null;
    }

    // Verificar se o horário está disponível
    if (!this.isTimeSlotAvailable(date, startTime, endTime)) {
      return null;
    }

    const appointment: Appointment = {
      id: this.generateId(),
      date: this.formatDate(date),
      time,
      startTime,
      endTime,
      userId,
      createdAt: new Date().toISOString()
    };

    const allAppointments = this.getAllAppointments();
    allAppointments.push(appointment);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allAppointments));

    return appointment;
  }

  /**
   * Remove um agendamento
   */
  deleteAppointment(id: string): boolean {
    const allAppointments = this.getAllAppointments();
    const filtered = allAppointments.filter(apt => apt.id !== id);
    
    if (filtered.length === allAppointments.length) {
      return false; // Não encontrado
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Verifica se uma data tem agendamentos
   */
  hasAppointments(date: Date): boolean {
    const appointments = this.getAppointmentsByDate(date);
    return appointments.length > 0;
  }

  /**
   * Formata uma data para YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Gera um ID único para o agendamento
   */
  private generateId(): string {
    return `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

