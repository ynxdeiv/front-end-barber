import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  @Output() dateSelected = new EventEmitter<Date>();

  currentDate = new Date(2024, 9, 1); // Outubro 2024
  selectedDay = 5;

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
    return day === this.selectedDay && day > 0;
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentDate.getMonth() === today.getMonth() &&
      this.currentDate.getFullYear() === today.getFullYear()
    );
  }
}

