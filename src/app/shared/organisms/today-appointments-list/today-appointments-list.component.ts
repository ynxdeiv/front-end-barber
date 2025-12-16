import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment, AppointmentStatus } from '../../../models/appointment';
import { CardComponent } from '../../atoms/card/card.component';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-today-appointments-list',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent, IconComponent],
  templateUrl: './today-appointments-list.component.html',
  styleUrl: './today-appointments-list.component.css'
})
export class TodayAppointmentsListComponent {
  @Input() appointments: Appointment[] = [];

  getStatusBadgeVariant(status: AppointmentStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    const variants: Record<AppointmentStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
      confirmed: 'success',
      pending_payment: 'warning',
      completed: 'info',
      cancelled: 'error'
    };
    return variants[status] || 'neutral';
  }

  getStatusLabel(status: AppointmentStatus): string {
    const labels: Record<AppointmentStatus, string> = {
      confirmed: 'Confirmado',
      pending_payment: 'Aguardando Pagamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  }

  formatTime(time: string): string {
    return time.split(' - ')[0]; // Retorna apenas o horário de início
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}

