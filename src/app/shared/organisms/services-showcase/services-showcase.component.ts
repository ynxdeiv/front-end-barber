import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Service } from '../../../models/service';
import { ServiceCardComponent } from '../../molecules/service-card/service-card.component';

@Component({
  selector: 'app-services-showcase',
  standalone: true,
  imports: [CommonModule, ServiceCardComponent],
  templateUrl: './services-showcase.component.html',
  styleUrl: './services-showcase.component.css'
})
export class ServicesShowcaseComponent {
  @Input() services: Service[] = [];
  @Input() title: string = 'Nossos Serviços';
  @Input() subtitle: string = 'Escolha o serviço perfeito para você';
  @Output() bookService = new EventEmitter<Service>();

  onBookService(service: Service): void {
    this.bookService.emit(service);
  }
}

