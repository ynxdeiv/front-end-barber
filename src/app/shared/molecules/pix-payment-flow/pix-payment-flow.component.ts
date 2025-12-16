import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentSimulationService, PixPaymentData } from '../../../services/payment-simulation.service';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { CardComponent } from '../../atoms/card/card.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-pix-payment-flow',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, CardComponent],
  templateUrl: './pix-payment-flow.component.html',
  styleUrl: './pix-payment-flow.component.css'
})
export class PixPaymentFlowComponent implements OnInit, OnDestroy {
  @Input() amount: number = 0;
  @Input() description: string = '';
  @Output() paymentConfirmed = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  qrCode = signal<string>('');
  pixCode = signal<string>('');
  paymentId = signal<string>('');
  timeRemaining = signal<number>(30 * 60); // 30 minutos em segundos
  isCopied = signal(false);
  isProcessing = signal(false);

  private timerSubscription?: Subscription;
  private confirmationSubscription?: Subscription;

  constructor(private paymentService: PaymentSimulationService) {}

  ngOnInit(): void {
    this.initiatePixPayment();
    this.startTimer();
    this.startConfirmationCheck();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.confirmationSubscription?.unsubscribe();
  }

  private initiatePixPayment(): void {
    const paymentData: PixPaymentData = {
      amount: this.amount,
      description: this.description
    };

    this.paymentService.simulatePixPayment(paymentData).subscribe(result => {
      if (result.success) {
        this.qrCode.set(result.qrCode || '');
        this.pixCode.set(result.pixCode || '');
        this.paymentId.set(result.paymentId);
      }
    });
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      const remaining = this.timeRemaining();
      if (remaining > 0) {
        this.timeRemaining.set(remaining - 1);
      } else {
        // Tempo esgotado
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  private startConfirmationCheck(): void {
    // Simular verificação periódica de confirmação
    this.confirmationSubscription = interval(3000).subscribe(() => {
      if (this.paymentId() && !this.isProcessing()) {
        // Simular confirmação aleatória após alguns segundos
        if (Math.random() > 0.7) {
          this.checkPaymentStatus();
        }
      }
    });
  }

  private checkPaymentStatus(): void {
    if (!this.paymentId() || this.isProcessing()) return;

    this.isProcessing.set(true);
    this.paymentService.simulatePixConfirmation(this.paymentId()).subscribe(result => {
      if (result.success) {
        this.paymentConfirmed.emit(result.paymentId);
      }
      this.isProcessing.set(false);
    });
  }

  copyPixCode(): void {
    const code = this.pixCode();
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        this.isCopied.set(true);
        setTimeout(() => this.isCopied.set(false), 2000);
      });
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getTimePercentage(): number {
    const total = 30 * 60; // 30 minutos
    return (this.timeRemaining() / total) * 100;
  }
}

