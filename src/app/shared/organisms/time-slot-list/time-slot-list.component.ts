import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlotItemComponent } from '../../molecules/time-slot-item/time-slot-item.component';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  selected?: boolean;
}

@Component({
  selector: 'app-time-slot-list',
  standalone: true,
  imports: [CommonModule, TimeSlotItemComponent],
  templateUrl: './time-slot-list.component.html',
  styleUrl: './time-slot-list.component.css'
})
export class TimeSlotListComponent {
  @Input() selectedDate: Date = new Date();
  @Output() scheduleAppointment = new EventEmitter<{ date: Date; time: string }>();

  selectedTimeSlot: string | null = '11:00 - 11:30';

  timeSlots: TimeSlot[] = [
    { start: '09:00', end: '09:30', available: true },
    { start: '09:30', end: '10:00', available: true },
    { start: '10:00', end: '10:30', available: false },
    { start: '10:30', end: '11:00', available: false },
    { start: '11:00', end: '11:30', available: true, selected: true },
    { start: '11:30', end: '12:00', available: true }
  ];

  get formattedDate(): string {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const dayName = days[this.selectedDate.getDay()];
    const day = this.selectedDate.getDate();
    const month = months[this.selectedDate.getMonth()];
    
    return `${dayName}, ${day} de ${month}`;
  }

  isSelected(slot: TimeSlot): boolean {
    return `${slot.start} - ${slot.end}` === this.selectedTimeSlot;
  }

  onSchedule(slot: TimeSlot): void {
    if (slot.available) {
      this.selectedTimeSlot = `${slot.start} - ${slot.end}`;
      this.scheduleAppointment.emit({
        date: this.selectedDate,
        time: `${slot.start} - ${slot.end}`
      });
    }
  }
}

