import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardTemplateComponent } from '../../shared/templates/dashboard-template/dashboard-template.component';
import { CalendarComponent } from '../../shared/organisms/calendar/calendar.component';
import { TimeSlotListComponent } from '../../shared/organisms/time-slot-list/time-slot-list.component';
import { ServiceSelectionStepComponent } from '../../shared/molecules/service-selection-step/service-selection-step.component';
import { AppointmentProgressComponent, AppointmentStep } from '../../shared/molecules/appointment-progress/appointment-progress.component';
import { PostAppointmentPaymentModalComponent, PaymentMethod } from '../../shared/organisms/post-appointment-payment-modal/post-appointment-payment-modal.component';
import { PaymentSuccessScreenComponent } from '../../shared/organisms/payment-success-screen/payment-success-screen.component';
import { CardComponent } from '../../shared/atoms/card/card.component';
import { ButtonComponent } from '../../shared/atoms/button/button.component';
import { IconComponent } from '../../shared/atoms/icon/icon.component';
import { PriceTagComponent } from '../../shared/atoms/price-tag/price-tag.component';
import { AppointmentService } from '../../services/appointment.service';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment } from '../../models/appointment';
import { Service } from '../../models/service';
import { DEFAULT_SERVICES } from '../../data/services';

@Component({
  selector: 'app-appointment-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashboardTemplateComponent,
    CalendarComponent,
    TimeSlotListComponent,
    ServiceSelectionStepComponent,
    AppointmentProgressComponent,
    PostAppointmentPaymentModalComponent,
    PaymentSuccessScreenComponent,
    CardComponent,
    ButtonComponent,
    IconComponent,
    PriceTagComponent
  ],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.css'
})
export class AppointmentPageComponent {
  // Estado do fluxo
  currentStep = signal<AppointmentStep>('date');
  selectedDate = signal<Date>(new Date());
  selectedTime = signal<string | null>(null);
  selectedService = signal<Service | null>(null);
  createdAppointment = signal<Appointment | null>(null);

  // Dados
  services = DEFAULT_SERVICES;
  refreshTrigger = signal(0);

  // Modais
  showPaymentModal = signal(false);
  showSuccessScreen = signal(false);

  // Mensagens
  showSuccessMessage = signal(false);
  showErrorMessage = signal(false);
  message = signal('');

  constructor(
    private appointmentService: AppointmentService,
    private paymentService: PaymentService,
    public authService: AuthService
  ) {}

  // Step 1: Seleção de Data
  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
    this.hideMessages();
    if (this.currentStep() === 'date') {
      // Avançar para seleção de serviço se já tiver horário selecionado
      if (this.selectedTime()) {
        this.currentStep.set('service');
      }
    }
  }

  // Step 2: Seleção de Horário
  onTimeSelected(time: string): void {
    this.selectedTime.set(time);
    // Avançar para seleção de serviço
    this.currentStep.set('service');
  }

  // Step 3: Seleção de Serviço
  onServiceSelected(service: Service): void {
    this.selectedService.set(service);
    // Avançar para confirmação
    this.currentStep.set('confirm');
  }

  // Step 4: Confirmar Agendamento
  onConfirmAppointment(): void {
    if (!this.selectedDate() || !this.selectedTime() || !this.selectedService()) {
      this.showErrorMessage.set(true);
      this.message.set('Por favor, complete todas as etapas.');
      return;
    }

    const user = this.authService.getCurrentUser();
    const appointment = this.appointmentService.createAppointmentWithService(
      this.selectedDate()!,
      this.selectedTime()!,
      this.selectedService()!,
      user?.id ? user.id.toString() : undefined
    );

    if (appointment) {
      this.createdAppointment.set(appointment);
      // Abrir modal de pagamento
      this.showPaymentModal.set(true);
    } else {
      this.showErrorMessage.set(true);
      this.message.set('Este horário já está ocupado. Por favor, escolha outro horário.');
      setTimeout(() => this.hideMessages(), 5000);
    }
  }

  // Processar Pagamento
  onPaymentProcessed(data: { appointmentId: string; paymentMethod: PaymentMethod; paymentResult: any }): void {
    const appointment = this.createdAppointment();
    if (!appointment) return;

    // Processar pagamento
    const paymentResult = this.paymentService.processAppointmentPayment(
      appointment.id,
      appointment.serviceName || '',
      appointment.servicePrice || 0,
      data.paymentMethod
    );

    if (paymentResult.success && paymentResult.paymentId) {
      // Confirmar agendamento
      this.appointmentService.confirmAppointment(appointment.id, paymentResult.paymentId);

      // Fechar modal de pagamento e mostrar tela de sucesso
      this.showPaymentModal.set(false);
      this.showSuccessScreen.set(true);
      this.refreshTrigger.set(Date.now());
    } else {
      this.showErrorMessage.set(true);
      this.message.set('Erro ao processar pagamento. Tente novamente.');
    }
  }

  // Resetar fluxo
  resetFlow(): void {
    this.currentStep.set('date');
    this.selectedDate.set(new Date());
    this.selectedTime.set(null);
    this.selectedService.set(null);
    this.createdAppointment.set(null);
    this.showPaymentModal.set(false);
    this.showSuccessScreen.set(false);
    this.refreshTrigger.set(Date.now());
  }

  // Voltar para etapa anterior
  goBack(): void {
    if (this.currentStep() === 'service') {
      this.currentStep.set('date');
      this.selectedTime.set(null);
    } else if (this.currentStep() === 'confirm') {
      this.currentStep.set('service');
      this.selectedService.set(null);
    }
  }

  // Fechar modal de pagamento
  onClosePaymentModal(): void {
    this.showPaymentModal.set(false);
    // Resetar fluxo se cancelar pagamento
    this.resetFlow();
  }

  // Fechar tela de sucesso
  onCloseSuccessScreen(): void {
    this.showSuccessScreen.set(false);
    this.resetFlow();
  }

  // Helpers
  getTotalPrice(): number {
    return this.selectedService()?.price || 0;
  }

  formatDate(date: Date): string {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} de ${month}`;
  }

  private hideMessages(): void {
    this.showSuccessMessage.set(false);
    this.showErrorMessage.set(false);
    this.message.set('');
  }
}
