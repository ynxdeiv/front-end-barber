import { Injectable } from '@angular/core';
import { Appointment, AppointmentStatus } from '../models/appointment';
import { Service } from '../models/service';
import { AuthService } from './auth.service';
import { apiClient } from '../config/api.config';
import { throwApiError } from '../utils/api-error.util';

export interface CreateAppointmentRequest {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  userId: number;
  serviceId: number;
  barberId?: number;
}

export interface AppointmentAvailability {
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly API_PATH = '/appointments';

  constructor(private authService: AuthService) {}

  /**
   * Obtém todos os agendamentos (Admin only)
   * @param date - Filtrar por data (opcional)
   * @param status - Filtrar por status (opcional)
   */
  async getAllAppointments(date?: string, status?: AppointmentStatus): Promise<Appointment[]> {
    try {
      const params: any = {};
      if (date) params.date = date;
      if (status) params.status = status;

      const response = await apiClient.get<Appointment[]>(this.API_PATH, { params });
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Obtém agendamentos para uma data específica
   */
  async getAppointmentsByDate(date: Date | string): Promise<Appointment[]> {
    const dateString = typeof date === 'string' ? date : this.formatDate(date);
    return this.getAllAppointments(dateString);
  }

  /**
   * Obtém agendamentos de um usuário específico (Admin only)
   */
  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<Appointment[]>(`${this.API_PATH}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Obtém agendamentos do usuário atual
   */
  async getMyAppointments(): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<Appointment[]>(`${this.API_PATH}/my`);
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Verifica se um horário específico está disponível
   */
  async checkAvailability(date: string | Date, startTime: string, endTime: string, barberId?: number): Promise<boolean> {
    try {
      const dateString = typeof date === 'string' ? date : this.formatDate(date);
      const params: any = {
        date: dateString,
        startTime,
        endTime
      };
      if (barberId) params.barberId = barberId.toString();

      const response = await apiClient.get<AppointmentAvailability>(`${this.API_PATH}/availability`, { params });
      return response.data.available;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Verifica se um horário específico está disponível (método legado para compatibilidade)
   */
  async isTimeSlotAvailable(date: Date, startTime: string, endTime: string, barberId?: number): Promise<boolean> {
    return this.checkAvailability(date, startTime, endTime, barberId);
  }

  /**
   * Cria um novo agendamento
   */
  async createAppointment(
    date: Date | string,
    startTime: string,
    endTime: string,
    userId: number,
    serviceId: number,
    barberId?: number
  ): Promise<Appointment> {
    try {
      const dateString = typeof date === 'string' ? date : this.formatDate(date);

      const request: CreateAppointmentRequest = {
        date: dateString,
        startTime,
        endTime,
        userId,
        serviceId,
        barberId
      };

      const response = await apiClient.post<Appointment>(this.API_PATH, request);
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Cria um novo agendamento com serviço selecionado (método legado para compatibilidade)
   */
  async createAppointmentWithService(
    date: Date,
    time: string,
    service?: Service,
    userId?: number,
    barberId?: number
  ): Promise<Appointment | null> {
    try {
      // Extrair startTime e endTime do formato "HH:MM - HH:MM"
      const [startTime, endTime] = time.split(' - ').map(t => t.trim());

      if (!startTime || !endTime) {
        console.error('Formato de horário inválido:', time);
        return null;
      }

      if (!userId || !service?.id) {
        console.error('userId e serviceId são obrigatórios');
        return null;
      }

      // Verificar se o horário está disponível
      const available = await this.isTimeSlotAvailable(date, startTime, endTime, barberId);
      if (!available) {
        console.error('Horário não disponível');
        return null;
      }

      return await this.createAppointment(date, startTime, endTime, userId, service.id, barberId);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return null;
    }
  }

  /**
   * Obtém agendamento por ID
   */
  async getAppointmentById(id: string): Promise<Appointment> {
    try {
      const response = await apiClient.get<Appointment>(`${this.API_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Confirma agendamento após pagamento
   */
  async confirmAppointment(appointmentId: string, paymentId: string): Promise<Appointment> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string; appointment: Appointment }>(
        `${this.API_PATH}/${appointmentId}/confirm`,
        { paymentId }
      );
      return response.data.appointment;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Atualiza status de um agendamento
   */
  async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): Promise<Appointment> {
    try {
      const response = await apiClient.patch<Appointment>(
        `${this.API_PATH}/${appointmentId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Cancela um agendamento
   */
  async cancelAppointment(appointmentId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `${this.API_PATH}/${appointmentId}/cancel`
      );
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Remove um agendamento (deleta completamente) - Admin only
   */
  async deleteAppointment(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.API_PATH}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return false;
    }
  }

  /**
   * Remarca um agendamento (cancela e cria novo)
   */
  async rescheduleAppointment(
    id: string,
    newDate: Date,
    newStartTime: string,
    newEndTime: string,
    userId: number,
    serviceId: number,
    barberId?: number
  ): Promise<Appointment | null> {
    try {
      // Verificar disponibilidade
      const available = await this.isTimeSlotAvailable(newDate, newStartTime, newEndTime, barberId);
      if (!available) {
        console.error('Novo horário não disponível');
        return null;
      }

      // Cancelar agendamento atual
      await this.cancelAppointment(id);

      // Criar novo agendamento
      return await this.createAppointment(newDate, newStartTime, newEndTime, userId, serviceId, barberId);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      return null;
    }
  }

  /**
   * Verifica se uma data tem agendamentos
   */
  async hasAppointments(date: Date): Promise<boolean> {
    const appointments = await this.getAppointmentsByDate(date);
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
}

