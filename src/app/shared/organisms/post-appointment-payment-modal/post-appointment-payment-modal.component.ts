import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../../models/appointment';
import { Service } from '../../../models/service';
import { CardComponent } from '../../atoms/card/card.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { PriceTagComponent } from '../../atoms/price-tag/price-tag.component';
import { CreditCardFormComponent } from '../../molecules/credit-card-form/credit-card-form.component';
import { PixPaymentFlowComponent } from '../../molecules/pix-payment-flow/pix-payment-flow.component';
import { PaymentSimulationService, CreditCardData, PaymentResult } from '../../../services/payment-simulation.service';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';
export type PaymentStep = 'method_selection' | 'payment_form' | 'processing' | 'success';

@Component({
  selector: 'app-post-appointment-payment-modal',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    IconComponent,
    PriceTagComponent,
    CreditCardFormComponent,
    PixPaymentFlowComponent
  ],
  templateUrl: './post-appointment-payment-modal.component.html',
  styleUrl: './post-appointment-payment-modal.component.css'
})
export class PostAppointmentPaymentModalComponent {
  @Input() appointment!: Appointment;
  @Input() service?: Service;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() paymentProcessed = new EventEmitter<{ appointmentId: string; paymentMethod: PaymentMethod; paymentResult: PaymentResult }>();

  currentStep = signal<PaymentStep>('method_selection');
  selectedPaymentMethod = signal<PaymentMethod | null>(null);
  paymentResult = signal<PaymentResult | null>(null);

  paymentMethods: { value: PaymentMethod; label: string; icon: string; description: string }[] = [
    { value: 'pix', label: 'PIX', icon: 'qr_code', description: 'Aprovação instantânea' },
    { value: 'credit_card', label: 'Cartão de Crédito', icon: 'credit_card', description: 'Parcelamento disponível' },
    { value: 'debit_card', label: 'Cartão de Débito', icon: 'account_balance', description: 'Débito em conta' },
    { value: 'cash', label: 'Dinheiro', icon: 'payments', description: 'Pagamento presencial' }
  ];

  constructor(private paymentService: PaymentSimulationService) {}

  get totalPrice(): number {
    return this.service?.price || this.appointment.servicePrice || 0;
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
    
    if (method === 'cash') {
      // Para dinheiro, apenas confirma
      this.processCashPayment();
    } else {
      // Para outros métodos, vai para formulário
      this.currentStep.set('payment_form');
    }
  }

  onCreditCardSubmit(cardData: CreditCardData): void {
    this.currentStep.set('processing');
    
    this.paymentService.simulateCreditCardPayment(cardData, this.totalPrice).subscribe(result => {
      this.paymentResult.set(result);
      
      if (result.success) {
        this.currentStep.set('success');
        setTimeout(() => {
          this.finalizePayment(result);
        }, 2000);
      } else {
        // Voltar para formulário em caso de erro
        this.currentStep.set('payment_form');
      }
    });
  }

  onPixPaymentConfirmed(paymentId: string): void {
    const result: PaymentResult = {
      success: true,
      paymentId,
      method: 'pix',
      message: 'Pagamento PIX confirmado!',
      timestamp: new Date().toISOString()
    };
    
    this.paymentResult.set(result);
    this.currentStep.set('success');
    
    setTimeout(() => {
      this.finalizePayment(result);
    }, 2000);
  }

  private processCashPayment(): void {
    const result: PaymentResult = {
      success: true,
      paymentId: `cash_${Date.now()}`,
      method: 'cash',
      message: 'Pagamento em dinheiro confirmado. Pague no local.',
      timestamp: new Date().toISOString()
    };
    
    this.paymentResult.set(result);
    this.currentStep.set('success');
    
    setTimeout(() => {
      this.finalizePayment(result);
    }, 2000);
  }

  private finalizePayment(result: PaymentResult): void {
    this.paymentProcessed.emit({
      appointmentId: this.appointment.id,
      paymentMethod: this.selectedPaymentMethod()!,
      paymentResult: result
    });
  }

  goBack(): void {
    if (this.currentStep() === 'payment_form') {
      this.currentStep.set('method_selection');
      this.selectedPaymentMethod.set(null);
    }
  }

  onClose(): void {
    this.close.emit();
    // Reset state
    this.currentStep.set('method_selection');
    this.selectedPaymentMethod.set(null);
    this.paymentResult.set(null);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}
