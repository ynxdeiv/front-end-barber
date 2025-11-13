import { Injectable } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { PaymentService } from './payment.service';
import { Appointment, AppointmentStatus } from '../models/appointment';
import { Pagamento } from '../models/pagamento';

export interface DashboardMetrics {
  // AGENDAMENTOS
  totalAppointments: number;
  appointmentsToday: number;
  upcomingAppointments: number;
  appointmentCompletionRate: number;
  pendingPaymentsCount: number;

  // FINANCEIRO
  monthlyRevenue: number;
  revenueGrowth: number; // % vs mês anterior
  averageTicket: number;
  pendingPayments: number;
  todayRevenue: number;

  // CLIENTES
  totalClients: number;
  newClientsThisMonth: number;
  clientRetentionRate: number;

  // SERVIÇOS
  popularServices: { service: string; count: number }[];
  servicePerformance: { service: string; revenue: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class MetricsCalculationService {
  constructor(
    private appointmentService: AppointmentService,
    private paymentService: PaymentService
  ) {}

  /**
   * Calcula todas as métricas do dashboard
   */
  calculateMetrics(): DashboardMetrics {
    const appointments = this.appointmentService.getAllAppointments();
    const payments = this.paymentService.getAllPayments();
    const today = new Date();
    const todayString = this.formatDate(today);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Agendamentos
    const appointmentsToday = appointments.filter(apt => apt.date === todayString);
    const upcomingAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && apt.status === 'confirmed';
    });
    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    const totalAppointments = appointments.length;
    const appointmentCompletionRate = totalAppointments > 0
      ? (completedAppointments.length / totalAppointments) * 100
      : 0;

    // Pagamentos pendentes
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const pendingPaymentsCount = pendingPayments.length;
    const pendingPaymentsAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    // Receita mensal atual
    const monthlyPayments = payments.filter(p => {
      const paymentDate = new Date(p.paymentDate || p.createdAt);
      return paymentDate.getMonth() === currentMonth &&
             paymentDate.getFullYear() === currentYear &&
             p.status === 'paid';
    });
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    // Receita mês anterior
    const lastMonthPayments = payments.filter(p => {
      const paymentDate = new Date(p.paymentDate || p.createdAt);
      return paymentDate.getMonth() === lastMonth &&
             paymentDate.getFullYear() === lastMonthYear &&
             p.status === 'paid';
    });
    const lastMonthRevenue = lastMonthPayments.reduce((sum, p) => sum + p.amount, 0);

    // Crescimento de receita
    const revenueGrowth = lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : monthlyRevenue > 0 ? 100 : 0;

    // Ticket médio
    const paidPayments = payments.filter(p => p.status === 'paid');
    const averageTicket = paidPayments.length > 0
      ? paidPayments.reduce((sum, p) => sum + p.amount, 0) / paidPayments.length
      : 0;

    // Receita de hoje
    const todayPayments = payments.filter(p => {
      const paymentDate = new Date(p.paymentDate || p.createdAt);
      return this.formatDate(paymentDate) === todayString && p.status === 'paid';
    });
    const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);

    // Clientes únicos
    const uniqueUserIds = new Set(appointments.map(apt => apt.userId).filter(Boolean));
    const totalClients = uniqueUserIds.size;

    // Novos clientes este mês
    const newClientsThisMonth = appointments.filter(apt => {
      const aptDate = new Date(apt.createdAt);
      return aptDate.getMonth() === currentMonth &&
             aptDate.getFullYear() === currentYear;
    }).filter((apt, index, self) =>
      index === self.findIndex(a => a.userId === apt.userId)
    ).length;

    // Taxa de retenção (simplificada - clientes com mais de 1 agendamento)
    const clientAppointmentCounts = new Map<string, number>();
    appointments.forEach(apt => {
      if (apt.userId) {
        clientAppointmentCounts.set(apt.userId, (clientAppointmentCounts.get(apt.userId) || 0) + 1);
      }
    });
    const returningClients = Array.from(clientAppointmentCounts.values()).filter(count => count > 1).length;
    const clientRetentionRate = totalClients > 0
      ? (returningClients / totalClients) * 100
      : 0;

    // Serviços populares
    const serviceCounts = new Map<string, number>();
    appointments.forEach(apt => {
      if (apt.serviceName) {
        serviceCounts.set(apt.serviceName, (serviceCounts.get(apt.serviceName) || 0) + 1);
      }
    });
    const popularServices = Array.from(serviceCounts.entries())
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Performance de serviços (por receita)
    const serviceRevenue = new Map<string, number>();
    appointments.forEach(apt => {
      if (apt.serviceName && apt.servicePrice) {
        const current = serviceRevenue.get(apt.serviceName) || 0;
        serviceRevenue.set(apt.serviceName, current + apt.servicePrice);
      }
    });
    const servicePerformance = Array.from(serviceRevenue.entries())
      .map(([service, revenue]) => ({ service, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalAppointments,
      appointmentsToday: appointmentsToday.length,
      upcomingAppointments: upcomingAppointments.length,
      appointmentCompletionRate: Math.round(appointmentCompletionRate * 10) / 10,
      pendingPaymentsCount,
      monthlyRevenue,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      averageTicket: Math.round(averageTicket * 100) / 100,
      pendingPayments: pendingPaymentsAmount,
      todayRevenue,
      totalClients,
      newClientsThisMonth,
      clientRetentionRate: Math.round(clientRetentionRate * 10) / 10,
      popularServices,
      servicePerformance
    };
  }

  /**
   * Obtém agendamentos de hoje
   */
  getTodayAppointments(): Appointment[] {
    const today = new Date();
    const todayString = this.formatDate(today);
    const allAppointments = this.appointmentService.getAllAppointments();
    return allAppointments
      .filter(apt => apt.date === todayString)
      .sort((a, b) => {
        const timeA = a.startTime || '';
        const timeB = b.startTime || '';
        return timeA.localeCompare(timeB);
      });
  }

  /**
   * Formata data para YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

