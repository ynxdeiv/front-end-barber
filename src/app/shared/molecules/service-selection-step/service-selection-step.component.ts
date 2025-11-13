import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../models/service';
import { ServiceOptionCardComponent } from '../../atoms/service-option-card/service-option-card.component';

@Component({
  selector: 'app-service-selection-step',
  standalone: true,
  imports: [CommonModule, ServiceOptionCardComponent],
  templateUrl: './service-selection-step.component.html',
  styleUrl: './service-selection-step.component.css'
})
export class ServiceSelectionStepComponent {
  @Input() services: Service[] = [];
  @Input() selectedServiceId?: string;
  @Output() serviceSelected = new EventEmitter<Service>();

  onServiceSelect(service: Service): void {
    this.serviceSelected.emit(service);
  }

  isSelected(serviceId: string): boolean {
    return this.selectedServiceId === serviceId;
  }
}

