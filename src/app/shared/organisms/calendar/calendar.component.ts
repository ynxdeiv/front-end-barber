import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';
import { AppointmentService } from '../../../services/appointment.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date = new Date();
  @Input() refreshTrigger: number = 0; // Trigger para forçar atualização
  @Output() dateSelected = new EventEmitter<Date>();

  currentDate = new Date();
  selectedDay = 0;

  constructor(private appointmentService: AppointmentService) {
    // Inicializar com a data atual
    const today = new Date();
    this.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.selectedDay = today.getDate();
  }

  ngOnInit(): void {
    this.updateSelectedDay();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate'] && changes['selectedDate'].currentValue) {
      const newDate = changes['selectedDate'].currentValue as Date;
      // Atualizar o mês atual se necessário
      if (newDate.getMonth() !== this.currentDate.getMonth() || 
          newDate.getFullYear() !== this.currentDate.getFullYear()) {
        this.currentDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      }
      this.updateSelectedDay();
    }
    // Forçar detecção de mudanças quando refreshTrigger mudar
    if (changes['refreshTrigger']) {
      // O Angular detectará automaticamente as mudanças através do método hasAppointments
    }
  }

  private updateSelectedDay(): void {
    if (this.selectedDate) {
      // Verificar se a data selecionada está no mês atual
      if (this.selectedDate.getMonth() === this.currentDate.getMonth() &&
          this.selectedDate.getFullYear() === this.currentDate.getFullYear()) {
        this.selectedDay = this.selectedDate.getDate();
      } else {
        this.selectedDay = 0;
      }
    }
  }

  weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  get currentMonthName(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  get daysInMonth(): number[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: number[] = [];

    // Preencher dias vazios do início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(0);
    }

    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.selectedDay = 0;
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.selectedDay = 0;
  }

  selectDay(day: number) {
    if (day > 0) {
      this.selectedDay = day;
      const selectedDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        day
      );
      this.dateSelected.emit(selectedDate);
    }
  }

  isSelected(day: number): boolean {
    if (day === 0) return false;
    const date = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    
    // Verificar se é a data selecionada
    if (this.selectedDate && 
        date.getDate() === this.selectedDate.getDate() &&
        date.getMonth() === this.selectedDate.getMonth() &&
        date.getFullYear() === this.selectedDate.getFullYear()) {
      return true;
    }
    
    return day === this.selectedDay && day > 0;
  }

  isToday(day: number): boolean {
    if (day === 0) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }

  hasAppointments(day: number): boolean {
    if (day === 0) return false;
    const date = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    return this.appointmentService.hasAppointments(date);
  }
}

