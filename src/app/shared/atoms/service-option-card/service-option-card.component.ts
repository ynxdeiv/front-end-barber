import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../models/service';
import { CardComponent } from '../card/card.component';
import { PriceTagComponent } from '../price-tag/price-tag.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-service-option-card',
  standalone: true,
  imports: [CommonModule, CardComponent, PriceTagComponent, IconComponent],
  templateUrl: './service-option-card.component.html',
  styleUrl: './service-option-card.component.css'
})
export class ServiceOptionCardComponent {
  @Input() service!: Service;
  @Input() selected: boolean = false;
  @Output() select = new EventEmitter<Service>();

  get categoryColor(): string {
    const colors: Record<Service['category'], string> = {
      hair: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      beard: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      combo: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      other: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    };
    return colors[this.service.category] || colors.other;
  }

  get categoryIcon(): string {
    const icons: Record<Service['category'], string> = {
      hair: 'content_cut',
      beard: 'face',
      combo: 'spa',
      other: 'more_horiz'
    };
    return icons[this.service.category] || 'more_horiz';
  }

  formatDuration(): string {
    if (this.service.duration < 60) {
      return `${this.service.duration}min`;
    }
    const hours = Math.floor(this.service.duration / 60);
    const minutes = this.service.duration % 60;
    return minutes > 0 ? `${hours}h${minutes}min` : `${hours}h`;
  }

  onSelect(): void {
    this.select.emit(this.service);
  }
}

