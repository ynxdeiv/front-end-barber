import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUser } from '../../../models/user';

type DayKey = keyof AdminUser['businessHours'];

@Component({
  selector: 'app-business-hours',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-hours.component.html',
  styleUrl: './business-hours.component.css'
})
export class BusinessHoursComponent {
  @Input() businessHours!: AdminUser['businessHours'];
  @Input() title: string = 'Horário de Funcionamento';

  weekDays: { key: DayKey; label: string }[] = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  getDayHours(dayKey: DayKey) {
    return this.businessHours[dayKey];
  }

  isClosed(dayKey: DayKey): boolean {
    return this.getDayHours(dayKey).closed || false;
  }

  getOpenTime(dayKey: DayKey): string {
    return this.getDayHours(dayKey).open;
  }

  getCloseTime(dayKey: DayKey): string {
    return this.getDayHours(dayKey).close;
  }
}

