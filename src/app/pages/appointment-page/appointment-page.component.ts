import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardTemplateComponent } from '../../shared/templates/dashboard-template/dashboard-template.component';
import { CalendarComponent } from '../../shared/organisms/calendar/calendar.component';
import { TimeSlotListComponent } from '../../shared/organisms/time-slot-list/time-slot-list.component';
import { AppointmentService } from '../../services/appointment.service';
import { IconComponent } from '../../shared/atoms/icon/icon.component';

@Component({
  selector: 'app-appointment-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardTemplateComponent,
    CalendarComponent,
    TimeSlotListComponent,
    IconComponent
  ],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.css'
})
export class AppointmentPageComponent {
  selectedDate: Date = new Date();
  showSuccessMessage = false;
  showErrorMessage = false;
  message = '';
  refreshTrigger = 0; // Trigger para forçar atualização da lista de horários

  constructor(private appointmentService: AppointmentService) {}

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.hideMessages();
  }

  onScheduleAppointment(data: { date: Date; time: string }) {
    const appointment = this.appointmentService.createAppointment(
      data.date,
      data.time
    );

    if (appointment) {
      this.showSuccessMessage = true;
      this.message = `Agendamento confirmado para ${this.formatDate(data.date)} às ${data.time}`;
      
      // Forçar atualização da lista de horários
      this.refreshTrigger = Date.now();
      
      // Ocultar mensagem após 5 segundos
      setTimeout(() => {
        this.hideMessages();
      }, 5000);
    } else {
      this.showErrorMessage = true;
      this.message = 'Este horário já está ocupado. Por favor, escolha outro horário.';
      
      // Ocultar mensagem após 5 segundos
      setTimeout(() => {
        this.hideMessages();
      }, 5000);
    }
  }

  private formatDate(date: Date): string {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${day} de ${month}`;
  }

  private hideMessages(): void {
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
    this.message = '';
  }
}

