import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditCardData, PaymentSimulationService } from '../../../services/payment-simulation.service';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './credit-card-form.component.html',
  styleUrl: './credit-card-form.component.css'
})
export class CreditCardFormComponent {
  @Input() amount: number = 0;
  @Output() submit = new EventEmitter<CreditCardData>();
  @Output() cancel = new EventEmitter<void>();

  cardData: CreditCardData = {
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: 1,
    cpf: ''
  };

  errors = signal<Record<string, string>>({});
  isSubmitting = signal(false);

  installments = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(private paymentService: PaymentSimulationService) {}

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.paymentService.formatCardNumber(input.value);
    this.cardData.number = formatted;
    this.validateCardNumber();
  }

  onExpiryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = this.paymentService.formatExpiryDate(input.value);
    this.cardData.expiry = formatted;
    this.validateExpiry();
  }

  onCVVInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cardData.cvv = input.value.replace(/\D/g, '').substring(0, 4);
    this.validateCVV();
  }

  validateCardNumber(): void {
    const errors = { ...this.errors() };
    if (this.cardData.number.replace(/\D/g, '').length < 13) {
      errors['number'] = 'Número de cartão inválido';
    } else if (!this.paymentService.validateCreditCard(this.cardData.number)) {
      errors['number'] = 'Número de cartão inválido';
    } else {
      delete errors['number'];
    }
    this.errors.set(errors);
  }

  validateExpiry(): void {
    const errors = { ...this.errors() };
    if (!this.cardData.expiry || this.cardData.expiry.length < 5) {
      errors['expiry'] = 'Data inválida';
    } else if (!this.paymentService.validateExpiryDate(this.cardData.expiry)) {
      errors['expiry'] = 'Cartão expirado';
    } else {
      delete errors['expiry'];
    }
    this.errors.set(errors);
  }

  validateCVV(): void {
    const errors = { ...this.errors() };
    if (!this.paymentService.validateCVV(this.cardData.cvv)) {
      errors['cvv'] = 'CVV inválido';
    } else {
      delete errors['cvv'];
    }
    this.errors.set(errors);
  }

  validateName(): void {
    const errors = { ...this.errors() };
    if (!this.cardData.name || this.cardData.name.trim().length < 3) {
      errors['name'] = 'Nome inválido';
    } else if (/\d/.test(this.cardData.name)) {
      errors['name'] = 'Nome não pode conter números';
    } else {
      delete errors['name'];
    }
    this.errors.set(errors);
  }

  validateCPF(): void {
    const errors = { ...this.errors() };
    const cpf = this.cardData.cpf?.replace(/\D/g, '') || '';
    if (cpf && cpf.length !== 11) {
      errors['cpf'] = 'CPF inválido';
    } else {
      delete errors['cpf'];
    }
    this.errors.set(errors);
  }

  formatCPF(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  }

  onCPFInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cardData.cpf = this.formatCPF(input.value);
    this.validateCPF();
  }

  getInstallmentValue(): number {
    return this.amount / this.cardData.installments;
  }

  isFormValid(): boolean {
    return Object.keys(this.errors()).length === 0 &&
           this.cardData.number.replace(/\D/g, '').length >= 13 &&
           this.cardData.name.trim().length >= 3 &&
           this.cardData.expiry.length === 5 &&
           this.cardData.cvv.length >= 3;
  }

  onSubmit(): void {
    // Validar todos os campos
    this.validateCardNumber();
    this.validateExpiry();
    this.validateCVV();
    this.validateName();
    if (this.cardData.cpf) {
      this.validateCPF();
    }

    if (this.isFormValid()) {
      this.isSubmitting.set(true);
      this.submit.emit(this.cardData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

