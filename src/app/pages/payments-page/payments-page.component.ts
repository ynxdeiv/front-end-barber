import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardTemplateComponent } from '../../shared/templates/dashboard-template/dashboard-template.component';
import { PaymentSummaryComponent } from '../../shared/organisms/payment-summary/payment-summary.component';
import { PaymentListComponent } from '../../shared/organisms/payment-list/payment-list.component';
import { PaymentFormComponent } from '../../shared/organisms/payment-form/payment-form.component';
import { BarberCardComponent } from '../../shared/molecules/barber-card/barber-card.component';
import { ButtonComponent } from '../../shared/atoms/button/button.component';
import { IconComponent } from '../../shared/atoms/icon/icon.component';
import { PaymentService } from '../../services/payment.service';
import { BarberService } from '../../services/barber.service';
import { Pagamento, PaymentStatus } from '../../models/pagamento';
import { Barbeiro } from '../../models/barbeiro';

@Component({
  selector: 'app-payments-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardTemplateComponent,
    PaymentSummaryComponent,
    PaymentListComponent,
    PaymentFormComponent,
    BarberCardComponent,
    ButtonComponent,
    IconComponent
  ],
  templateUrl: './payments-page.component.html',
  styleUrl: './payments-page.component.css'
})
export class PaymentsPageComponent implements OnInit {
  // View modes
  showForm = signal(false);
  viewMode = signal<'list' | 'barbers'>('list');
  selectedBarbeiroId = signal<number | undefined>(undefined);

  // Data
  payments = signal<Pagamento[]>([]);
  barbeiros = signal<Barbeiro[]>([]);
  filteredPayments = signal<Pagamento[]>([]);

  // Filters
  statusFilter = signal<PaymentStatus | undefined>(undefined);
  barbeiroFilter = signal<number | undefined>(undefined);

  // UI State
  showSuccessMessage = signal(false);
  showErrorMessage = signal(false);
  message = signal('');

  constructor(
    private paymentService: PaymentService,
    private barberService: BarberService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.payments.set(this.paymentService.getAllPayments());
    this.barbeiros.set(this.barberService.getActiveBarbeiros());
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.payments()];

    if (this.statusFilter()) {
      filtered = filtered.filter(p => p.status === this.statusFilter());
    }

    if (this.barbeiroFilter()) {
      filtered = filtered.filter(p => p.barbeiroId === this.barbeiroFilter());
    }

    this.filteredPayments.set(filtered);
  }

  onStatusFilterChange(status: PaymentStatus | 'all'): void {
    this.statusFilter.set(status === 'all' ? undefined : status);
    this.applyFilters();
  }

  onBarbeiroFilterChange(barbeiroId: number | 'all'): void {
    this.barbeiroFilter.set(barbeiroId === 'all' ? undefined : barbeiroId);
    this.applyFilters();
  }

  onCreatePayment(data: {
    barbeiroId: number;
    amount: number;
    serviceDescription: string;
    notes?: string;
  }): void {
    const payment = this.paymentService.createPayment(
      data.barbeiroId,
      data.amount,
      data.serviceDescription,
      undefined,
      data.notes
    );

    if (payment) {
      this.showSuccessMessage.set(true);
      this.message.set('Pagamento criado com sucesso!');
      this.showForm.set(false);
      this.loadData();

      setTimeout(() => {
        this.hideMessages();
      }, 5000);
    } else {
      this.showErrorMessage.set(true);
      this.message.set('Erro ao criar pagamento. Tente novamente.');
      setTimeout(() => {
        this.hideMessages();
      }, 5000);
    }
  }

  onMarkAsPaid(paymentId: string): void {
    const success = this.paymentService.markAsPaid(paymentId);
    if (success) {
      this.showSuccessMessage.set(true);
      this.message.set('Pagamento marcado como pago!');
      this.loadData();

      setTimeout(() => {
        this.hideMessages();
      }, 5000);
    }
  }

  onCancelPayment(paymentId: string): void {
    if (confirm('Tem certeza que deseja cancelar este pagamento?')) {
      const success = this.paymentService.cancelPayment(paymentId);
      if (success) {
        this.showSuccessMessage.set(true);
        this.message.set('Pagamento cancelado!');
        this.loadData();

        setTimeout(() => {
          this.hideMessages();
        }, 5000);
      }
    }
  }

  onViewDetails(payment: Pagamento): void {
    // Aqui você pode implementar um modal ou navegação para detalhes
    alert(`Detalhes do Pagamento:\n\nBarbeiro: ${payment.barbeiroName}\nValor: R$ ${payment.amount.toFixed(2)}\nComissão: R$ ${payment.commission.toFixed(2)}\nStatus: ${payment.status}\nDescrição: ${payment.serviceDescription}`);
  }

  onViewBarberPayments(barbeiroId: number): void {
    this.barbeiroFilter.set(barbeiroId);
    this.viewMode.set('list');
    this.applyFilters();
  }

  onCreatePaymentForBarber(barbeiroId: number): void {
    this.selectedBarbeiroId.set(barbeiroId);
    this.showForm.set(true);
  }

  getTotalByBarbeiro(barbeiroId: number): { total: number; pending: number; paid: number } {
    return this.paymentService.getTotalByBarbeiro(barbeiroId);
  }

  toggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'list' ? 'barbers' : 'list');
  }

  hideMessages(): void {
    this.showSuccessMessage.set(false);
    this.showErrorMessage.set(false);
    this.message.set('');
  }
}

