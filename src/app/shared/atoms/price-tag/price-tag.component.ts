import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-tag.component.html',
  styleUrl: './price-tag.component.css'
})
export class PriceTagComponent {
  @Input() price: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showCurrency: boolean = true;

  formatPrice(): string {
    if (this.showCurrency) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(this.price);
    }
    return this.price.toFixed(2);
  }
}

