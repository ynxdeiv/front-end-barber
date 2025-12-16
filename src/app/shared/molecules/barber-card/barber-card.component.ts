import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Barbeiro } from '../../../models/barbeiro';
import { CardComponent } from '../../atoms/card/card.component';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-barber-card',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent, IconComponent],
  templateUrl: './barber-card.component.html',
  styleUrl: './barber-card.component.css'
})
export class BarberCardComponent {
  @Input() barbeiro!: Barbeiro;
  @Input() totalPending?: number;
  @Input() totalPaid?: number;
  @Output() viewPayments = new EventEmitter<number>();
  @Output() createPayment = new EventEmitter<number>();

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}

