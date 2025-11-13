import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barbeiro } from '../../../models/barbeiro';
import { ButtonComponent } from '../../atoms/button/button.component';
import { CardComponent } from '../../atoms/card/card.component';
import { LabelComponent } from '../../atoms/label/label.component';
import { InputComponent } from '../../atoms/input/input.component';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    LabelComponent,
    InputComponent
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent implements OnInit {
  @Input() barbeiros: Barbeiro[] = [];
  @Input() selectedBarbeiroId?: number;
  @Output() submit = new EventEmitter<{
    barbeiroId: number;
    amount: number;
    serviceDescription: string;
    notes?: string;
  }>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    barbeiroId: 0,
    amount: '',
    serviceDescription: '',
    notes: ''
  };

  ngOnInit(): void {
    if (this.selectedBarbeiroId) {
      this.formData.barbeiroId = this.selectedBarbeiroId;
    }
  }

  get selectedBarbeiro(): Barbeiro | undefined {
    return this.barbeiros.find(b => b.id === this.formData.barbeiroId);
  }

  get calculatedCommission(): number {
    if (!this.selectedBarbeiro || !this.formData.amount) {
      return 0;
    }
    const amount = parseFloat(this.formData.amount) || 0;
    return (amount * this.selectedBarbeiro.commissionPercentage) / 100;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  onSubmit(): void {
    if (!this.formData.barbeiroId || !this.formData.amount || !this.formData.serviceDescription) {
      return;
    }

    this.submit.emit({
      barbeiroId: this.formData.barbeiroId,
      amount: parseFloat(this.formData.amount),
      serviceDescription: this.formData.serviceDescription,
      notes: this.formData.notes || undefined
    });

    // Reset form
    this.formData = {
      barbeiroId: this.selectedBarbeiroId || 0,
      amount: '',
      serviceDescription: '',
      notes: ''
    };
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

