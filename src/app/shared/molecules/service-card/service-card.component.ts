import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../models/service';
import { CardComponent } from '../../atoms/card/card.component';
import { PriceTagComponent } from '../../atoms/price-tag/price-tag.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, CardComponent, PriceTagComponent, ButtonComponent, IconComponent],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent {
  @Input() service!: Service;
  @Output() bookService = new EventEmitter<Service>();

  get categoryIcon(): string {
    const icons: Record<Service['category'], string> = {
      hair: 'content_cut',
      beard: 'face',
      combo: 'spa',
      other: 'more_horiz'
    };
    return icons[this.service.category] || 'more_horiz';
  }

  get categoryLabel(): string {
    const labels: Record<Service['category'], string> = {
      hair: 'Corte',
      beard: 'Barba',
      combo: 'Combo',
      other: 'Outro'
    };
    return labels[this.service.category] || 'Serviço';
  }

  formatDuration(): string {
    if (this.service.duration < 60) {
      return `${this.service.duration}min`;
    }
    const hours = Math.floor(this.service.duration / 60);
    const minutes = this.service.duration % 60;
    return minutes > 0 ? `${hours}h${minutes}min` : `${hours}h`;
  }

  onBook(): void {
    this.bookService.emit(this.service);
  }
}

