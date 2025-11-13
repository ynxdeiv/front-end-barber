import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Appointment } from '../../../models/appointment';
import { CardComponent } from '../../atoms/card/card.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { BadgeComponent } from '../../atoms/badge/badge.component';

@Component({
  selector: 'app-payment-success-screen',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, IconComponent, BadgeComponent],
  templateUrl: './payment-success-screen.component.html',
  styleUrl: './payment-success-screen.component.css'
})
export class PaymentSuccessScreenComponent {
  @Input() appointment!: Appointment;
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  onClose(): void {
    this.close.emit();
    this.router.navigate(['/appointment']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
}

