import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagamento } from '../../../models/pagamento';
import { CardComponent } from '../../atoms/card/card.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-payment-summary',
  standalone: true,
  imports: [CommonModule, CardComponent, IconComponent],
  templateUrl: './payment-summary.component.html',
  styleUrl: './payment-summary.component.css'
})
export class PaymentSummaryComponent implements OnInit, OnChanges {
  @Input() payments: Pagamento[] = [];

  summary = {
    total: 0,
    pending: 0,
    paid: 0,
    cancelled: 0,
    pendingCount: 0,
    paidCount: 0,
    cancelledCount: 0
  };

  ngOnInit(): void {
    this.calculateSummary();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payments']) {
      this.calculateSummary();
    }
  }

  private calculateSummary(): void {
    this.summary = {
      total: 0,
      pending: 0,
      paid: 0,
      cancelled: 0,
      pendingCount: 0,
      paidCount: 0,
      cancelledCount: 0
    };

    this.payments.forEach(payment => {
      this.summary.total += payment.commission;

      switch (payment.status) {
        case 'pending':
          this.summary.pending += payment.commission;
          this.summary.pendingCount++;
          break;
        case 'paid':
          this.summary.paid += payment.commission;
          this.summary.paidCount++;
          break;
        case 'cancelled':
          this.summary.cancelled += payment.commission;
          this.summary.cancelledCount++;
          break;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}

