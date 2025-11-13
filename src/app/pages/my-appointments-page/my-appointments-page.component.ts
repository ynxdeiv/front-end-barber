import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardTemplateComponent } from '../../shared/templates/dashboard-template/dashboard-template.component';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { Appointment, AppointmentStatus } from '../../models/appointment';
import { CardComponent } from '../../shared/atoms/card/card.component';
import { ButtonComponent } from '../../shared/atoms/button/button.component';
import { IconComponent } from '../../shared/atoms/icon/icon.component';
import { BadgeComponent } from '../../shared/atoms/badge/badge.component';
import { PriceTagComponent } from '../../shared/atoms/price-tag/price-tag.component';
import { CalendarComponent } from '../../shared/organisms/calendar/calendar.component';
import { TimeSlotListComponent } from '../../shared/organisms/time-slot-list/time-slot-list.component';
import { ServiceSelectionStepComponent } from '../../shared/molecules/service-selection-step/service-selection-step.component';
import { PostAppointmentPaymentModalComponent, PaymentMethod } from '../../shared/organisms/post-appointment-payment-modal/post-appointment-payment-modal.component';
import { DEFAULT_SERVICES } from '../../data/services';
import { Service } from '../../models/service';
import { PaymentResult } from '../../services/payment-simulation.service';

@Component({
  selector: 'app-my-appointments-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardTemplateComponent,
    CardComponent,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    PriceTagComponent,
    CalendarComponent,
    TimeSlotListComponent,
    ServiceSelectionStepComponent,
    PostAppointmentPaymentModalComponent
  ],
  templateUrl: './my-appointments-page.component.html',
  styleUrl: './my-appointments-page.component.css'
})
export class MyAppointmentsPageComponent implements OnInit {
  appointments = signal<Appointment[]>([]);
  filteredAppointments = signal<Appointment[]>([]);
  selectedAppointment = signal<Appointment | null>(null);
  
  // Estados para remarcação
  showRescheduleModal = signal(false);
  rescheduleDate = signal<Date | null>(null);
  rescheduleTime = signal<string | null>(null);
  rescheduleService = signal<Service | null>(null);
  refreshTrigger = signal(0);
  
  // Estados para pagamento
  showPaymentModal = signal(false);
  appointmentToPay = signal<Appointment | null>(null);
  serviceToPay = signal<Service | null>(null);
  
  // Filtros
  filterStatus = signal<AppointmentStatus | 'all'>('all');
  services = DEFAULT_SERVICES;

  constructor(
    private appointmentService: AppointmentService,
    public authService: AuthService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      const userAppointments = this.appointmentService.getAppointmentsByUserId(user.id.toString());
      this.appointments.set(userAppointments);
      this.applyFilters();
    }
  }

  applyFilters(): void {
    const status = this.filterStatus();
    const all = this.appointments();
    
    if (status === 'all') {
      this.filteredAppointments.set(all);
    } else {
      this.filteredAppointments.set(all.filter(apt => apt.status === status));
    }
  }

  onFilterChange(status: AppointmentStatus | 'all'): void {
    this.filterStatus.set(status);
    this.applyFilters();
  }

  getStatusVariant(status: AppointmentStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending_payment': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'neutral';
    }
  }

  getStatusLabel(status: AppointmentStatus): string {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending_payment': return 'Aguardando Pagamento';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return 'Desconhecido';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatDateTime(dateString: string, time: string): string {
    const date = new Date(dateString);
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  canCancel(appointment: Appointment): boolean {
    // Agendamentos pendentes de pagamento podem sempre ser cancelados
    if (appointment.status === 'pending_payment') {
      return true;
    }
    
    // Para agendamentos confirmados, só pode cancelar se for pelo menos 2 horas antes
    if (appointment.status === 'confirmed') {
      const appointmentDate = new Date(appointment.date + 'T' + appointment.startTime);
      const now = new Date();
      const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilAppointment >= 2;
    }
    
    return false;
  }

  canReschedule(appointment: Appointment): boolean {
    const appointmentDate = new Date(appointment.date + 'T' + appointment.startTime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    // Só pode remarcar se for pelo menos 2 horas antes do agendamento
    return hoursUntilAppointment >= 2 && 
           (appointment.status === 'confirmed' || appointment.status === 'pending_payment');
  }

  onCancel(appointment: Appointment): void {
    if (confirm(`Tem certeza que deseja cancelar o agendamento de ${this.formatDate(appointment.date)} às ${appointment.time}?`)) {
      const success = this.appointmentService.cancelAppointment(appointment.id);
      if (success) {
        this.loadAppointments();
        alert('Agendamento cancelado com sucesso!');
      } else {
        alert('Erro ao cancelar agendamento. Tente novamente.');
      }
    }
  }

  onReschedule(appointment: Appointment): void {
    this.selectedAppointment.set(appointment);
    this.rescheduleDate.set(new Date(appointment.date));
    this.rescheduleTime.set(null);
    this.rescheduleService.set(this.services.find(s => s.name === appointment.serviceName) || null);
    this.showRescheduleModal.set(true);
  }

  onRescheduleDateSelected(date: Date): void {
    this.rescheduleDate.set(date);
  }

  onRescheduleTimeSelected(time: string): void {
    this.rescheduleTime.set(time);
  }

  onRescheduleServiceSelected(service: Service): void {
    this.rescheduleService.set(service);
  }

  confirmReschedule(): void {
    const appointment = this.selectedAppointment();
    if (!appointment || !this.rescheduleDate() || !this.rescheduleTime() || !this.rescheduleService()) {
      alert('Por favor, complete todas as informações para remarcar.');
      return;
    }

    // Extrair horário de início e fim
    const [startTime] = this.rescheduleTime()!.split(' - ');
    const endTime = this.rescheduleTime()!.split(' - ')[1] || this.calculateEndTime(startTime, this.rescheduleService()!.duration);

    const success = this.appointmentService.rescheduleAppointment(
      appointment.id,
      this.rescheduleDate()!,
      this.rescheduleTime()!,
      startTime,
      endTime
    );

    if (success) {
      this.showRescheduleModal.set(false);
      this.loadAppointments();
      this.refreshTrigger.update(v => v + 1);
      alert('Agendamento remarcado com sucesso!');
    } else {
      alert('Este horário não está disponível. Por favor, escolha outro.');
    }
  }

  cancelReschedule(): void {
    this.showRescheduleModal.set(false);
    this.selectedAppointment.set(null);
    this.rescheduleDate.set(null);
    this.rescheduleTime.set(null);
    this.rescheduleService.set(null);
  }

  calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    return `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
  }

  goToNewAppointment(): void {
    this.router.navigate(['/appointment']);
  }

  canPay(appointment: Appointment): boolean {
    return appointment.status === 'pending_payment';
  }

  onPay(appointment: Appointment): void {
    const service = this.services.find(s => s.name === appointment.serviceName);
    this.appointmentToPay.set(appointment);
    this.serviceToPay.set(service || null);
    this.showPaymentModal.set(true);
  }

  onPaymentProcessed(data: { appointmentId: string; paymentMethod: PaymentMethod; paymentResult: PaymentResult }): void {
    const appointment = this.appointmentToPay();
    if (!appointment) return;

    if (data.paymentResult.success) {
      // Processar pagamento no serviço
      this.paymentService.processAppointmentPayment(
        appointment.id,
        appointment.serviceName || 'Serviço',
        appointment.servicePrice || 0,
        data.paymentMethod,
        undefined // barbeiroId opcional
      );

      // Confirmar agendamento
      this.appointmentService.confirmAppointment(appointment.id, data.paymentResult.paymentId);

      // Fechar modal e recarregar lista
      this.showPaymentModal.set(false);
      this.appointmentToPay.set(null);
      this.serviceToPay.set(null);
      this.loadAppointments();
      
      alert('Pagamento processado com sucesso! Agendamento confirmado.');
    } else {
      alert(`Falha no pagamento: ${data.paymentResult.message}`);
    }
  }

  onClosePaymentModal(): void {
    this.showPaymentModal.set(false);
    this.appointmentToPay.set(null);
    this.serviceToPay.set(null);
  }
}

