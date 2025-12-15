import { Component, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

type BusinessHours = Record<DayKey, DayHours>;

@Component({
  selector: 'app-business-hours',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-hours.component.html',
  styleUrl: './business-hours.component.css'
})
export class BusinessHoursComponent {
  @Input() title: string = 'Horário de Funcionamento';
  @Input() businessHours?: BusinessHours;

  weekDays: { key: DayKey; label: string }[] = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  defaultBusinessHours = signal<BusinessHours>({
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '14:00', closed: false },
    sunday: { open: '09:00', close: '14:00', closed: true }
  });

  getBusinessHours(): BusinessHours {
    return this.businessHours || this.defaultBusinessHours();
  }

  getDayHours(dayKey: DayKey): DayHours {
    return this.getBusinessHours()[dayKey];
  }

  isClosed(dayKey: DayKey): boolean {
    return this.getDayHours(dayKey).closed || false;
  }

  isDayClosed(dayKey: DayKey): boolean {
    return this.isClosed(dayKey);
  }

  getOpenTime(dayKey: DayKey): string {
    return this.getDayHours(dayKey).open;
  }

  getCloseTime(dayKey: DayKey): string {
    return this.getDayHours(dayKey).close;
  }

  toggleDayClosed(dayKey: DayKey): void {
    this.defaultBusinessHours.update(hours => ({
      ...hours,
      [dayKey]: {
        ...hours[dayKey],
        closed: !hours[dayKey].closed
      }
    }));
  }

  updateOpenTime(dayKey: DayKey, time: string): void {
    this.defaultBusinessHours.update(hours => ({
      ...hours,
      [dayKey]: {
        ...hours[dayKey],
        open: time
      }
    }));
  }

  updateCloseTime(dayKey: DayKey, time: string): void {
    this.defaultBusinessHours.update(hours => ({
      ...hours,
      [dayKey]: {
        ...hours[dayKey],
        close: time
      }
    }));
  }

  saveBusinessHours(): void {
    console.log('Business hours saved:', this.getBusinessHours());
  }
}
