import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlotItemComponent } from '../../molecules/time-slot-item/time-slot-item.component';
import { AppointmentService } from '../../../services/appointment.service';

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
export class TimeSlotListComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date = new Date();
  @Input() refreshTrigger: number = 0; // Trigger para forçar atualização
  @Output() scheduleAppointment = new EventEmitter<{ date: Date; time: string }>();

  selectedTimeSlot: string | null = null;
  timeSlots: TimeSlot[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.generateTimeSlots();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && !changes['selectedDate'].firstChange) {
      this.selectedTimeSlot = null;
      this.generateTimeSlots();
    }
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.selectedTimeSlot = null;
      this.generateTimeSlots();
    }
  }

  /**
   * Gera os horários disponíveis para o dia selecionado
   * Horário de funcionamento: 09:00 às 18:00, com intervalos de 30 minutos
   */
  generateTimeSlots(): void {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;
    const intervalMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        
        let endHourCalc = hour;
        let endMinuteCalc = minute + intervalMinutes;
        
        if (endMinuteCalc >= 60) {
          endHourCalc++;
          endMinuteCalc = 0;
        }
        
        // Não criar slot se ultrapassar o horário de fechamento
        if (endHourCalc >= endHour && endMinuteCalc > 0) {
          break;
        }
        
        const endTime = `${String(endHourCalc).padStart(2, '0')}:${String(endMinuteCalc).padStart(2, '0')}`;
        
        // Verificar se o horário está disponível
        const available = this.appointmentService.isTimeSlotAvailable(
          this.selectedDate,
          startTime,
          endTime
        );

        slots.push({
          start: startTime,
          end: endTime,
          available
        });
      }
    }

    this.timeSlots = slots;
  }

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

