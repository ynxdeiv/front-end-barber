import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

export type AppointmentStep = 'date' | 'service' | 'confirm';

@Component({
  selector: 'app-appointment-progress',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './appointment-progress.component.html',
  styleUrl: './appointment-progress.component.css'
})
export class AppointmentProgressComponent {
  @Input() currentStep: AppointmentStep = 'date';

  steps: { key: AppointmentStep; label: string; icon: string }[] = [
    { key: 'date', label: 'Data e Horário', icon: 'calendar_month' },
    { key: 'service', label: 'Serviço', icon: 'content_cut' },
    { key: 'confirm', label: 'Confirmar', icon: 'check_circle' }
  ];

  getStepIndex(step: AppointmentStep): number {
    return this.steps.findIndex(s => s.key === step);
  }

  isCompleted(step: AppointmentStep): boolean {
    return this.getStepIndex(step) < this.getStepIndex(this.currentStep);
  }

  isCurrent(step: AppointmentStep): boolean {
    return step === this.currentStep;
  }
}

