import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardTemplateComponent } from '../../shared/templates/dashboard-template/dashboard-template.component';
import { CalendarComponent } from '../../shared/organisms/calendar/calendar.component';
import { TimeSlotListComponent } from '../../shared/organisms/time-slot-list/time-slot-list.component';

@Component({
  selector: 'app-appointment-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardTemplateComponent,
    CalendarComponent,
    TimeSlotListComponent
  ],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.css'
})
export class AppointmentPageComponent {
  selectedDate: Date = new Date(2024, 9, 5); // 5 de Outubro de 2024

  onDateSelected(date: Date) {
    this.selectedDate = date;
  }

  onScheduleAppointment(data: { date: Date; time: string }) {
    console.log('Agendando:', data);
  }
}

