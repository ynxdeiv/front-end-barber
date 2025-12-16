import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagamento, PaymentStatus } from '../../../models/pagamento';
import { PaymentRowComponent } from '../../molecules/payment-row/payment-row.component';
import { CardComponent } from '../../atoms/card/card.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, PaymentRowComponent, CardComponent, IconComponent],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css'
})
export class PaymentListComponent implements OnInit, OnChanges {
  @Input() payments: Pagamento[] = [];
  @Input() filterByStatus?: PaymentStatus;
  @Input() filterByBarbeiro?: number;
  @Input() refreshTrigger: number = 0;
  @Output() markAsPaid = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<Pagamento>();

  filteredPayments: Pagamento[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['payments'] || changes['filterByStatus'] || changes['filterByBarbeiro'] || changes['refreshTrigger']) {
      this.applyFilters();
    }
  }

  private applyFilters(): void {
    let filtered = [...this.payments];

    if (this.filterByStatus) {
      filtered = filtered.filter(p => p.status === this.filterByStatus);
    }

    if (this.filterByBarbeiro) {
      filtered = filtered.filter(p => p.barbeiroId === this.filterByBarbeiro);
    }

    // Ordenar por data de criação (mais recentes primeiro)
    filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    this.filteredPayments = filtered;
  }

  onMarkAsPaid(paymentId: string): void {
    this.markAsPaid.emit(paymentId);
  }

  onCancel(paymentId: string): void {
    this.cancel.emit(paymentId);
  }

  onViewDetails(payment: Pagamento): void {
    this.viewDetails.emit(payment);
  }
}

