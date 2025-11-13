import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagamento, PaymentStatus } from '../../../models/pagamento';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-payment-row',
  standalone: true,
  imports: [CommonModule, BadgeComponent, ButtonComponent, IconComponent],
  templateUrl: './payment-row.component.html',
  styleUrl: './payment-row.component.css'
})
export class PaymentRowComponent {
  @Input() payment!: Pagamento;
  @Output() markAsPaid = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<Pagamento>();

  getStatusVariant(status: PaymentStatus): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'neutral';
    }
  }

  getStatusLabel(status: PaymentStatus): string {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  onMarkAsPaid(): void {
    this.markAsPaid.emit(this.payment.id);
  }

  onCancel(): void {
    this.cancel.emit(this.payment.id);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.payment);
  }
}

