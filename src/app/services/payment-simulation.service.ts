import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import * as QRCode from 'qrcode';

export interface CreditCardData {
  number: string;
  name: string;
  expiry: string; // MM/AA
  cvv: string;
  installments: number;
  cpf?: string;
}

export interface PixPaymentData {
  amount: number;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  method: 'pix' | 'credit_card' | 'debit_card' | 'cash';
  transactionId?: string;
  qrCode?: string;
  pixCode?: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentSimulationService {
  private readonly PIX_TIMEOUT_MINUTES = 30;

  /**
   * Valida número de cartão usando algoritmo de Luhn
   */
  validateCreditCard(cardNumber: string): boolean {
    // Remove espaços e caracteres não numéricos
    const cleaned = cardNumber.replace(/\D/g, '');
    
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }

    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Valida data de expiração do cartão
   */
  validateExpiryDate(expiry: string): boolean {
    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    if (month < 1 || month > 12) return false;

    return true;
  }

  /**
   * Valida CVV
   */
  validateCVV(cvv: string): boolean {
    const cleaned = cvv.replace(/\D/g, '');
    return cleaned.length === 3 || cleaned.length === 4;
  }

  /**
   * Gera código PIX realista
   */
  generatePixCode(paymentId: string, amount: number): string {
    // Simulação de código PIX (formato EMV)
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `00020126580014BR.GOV.BCB.PIX0136${random}${timestamp}520400005303986540${amount.toFixed(2)}5802BR5925BARBER AGENDA LTDA6009SAO PAULO62070503***6304${this.generatePixChecksum(paymentId)}`;
  }

  /**
   * Gera QR Code em base64 usando biblioteca qrcode
   */
  async generatePixQrCode(pixCode: string): Promise<string> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(pixCode, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        width: 300,
        margin: 2
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      // Fallback para placeholder em caso de erro
      return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
    }
  }

  /**
   * Simula pagamento PIX
   */
  simulatePixPayment(data: PixPaymentData): Observable<PaymentResult> {
    const paymentId = `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const pixCode = this.generatePixCode(paymentId, data.amount);
    
    // Gerar QR Code de forma assíncrona
    return new Observable<PaymentResult>(observer => {
      this.generatePixQrCode(pixCode).then(qrCode => {
        observer.next({
          success: true,
          paymentId,
          method: 'pix' as const,
          qrCode,
          pixCode,
          message: 'QR Code PIX gerado. Aguardando pagamento...',
          timestamp: new Date().toISOString()
        });
        observer.complete();
      }).catch(error => {
        console.error('Erro ao gerar QR Code:', error);
        observer.next({
          success: false,
          paymentId,
          method: 'pix' as const,
          message: 'Erro ao gerar QR Code. Tente novamente.',
          timestamp: new Date().toISOString()
        });
        observer.complete();
      });
    }).pipe(delay(1500));
  }

  /**
   * Simula confirmação de pagamento PIX (webhook simulado)
   */
  simulatePixConfirmation(paymentId: string): Observable<PaymentResult> {
    // Simular confirmação após alguns segundos
    const delayTime = Math.random() * 5000 + 3000; // 3-8 segundos

    return of({
      success: true,
      paymentId,
      method: 'pix' as const,
      transactionId: `tx_${Date.now()}`,
      message: 'Pagamento PIX confirmado!',
      timestamp: new Date().toISOString()
    }).pipe(delay(delayTime));
  }

  /**
   * Simula pagamento com cartão de crédito
   */
  simulateCreditCardPayment(cardData: CreditCardData, amount: number): Observable<PaymentResult> {
    // Validações
    if (!this.validateCreditCard(cardData.number)) {
      return of({
        success: false,
        paymentId: '',
        method: 'credit_card' as const,
        message: 'Número de cartão inválido.',
        timestamp: new Date().toISOString()
      }).pipe(delay(1000));
    }

    if (!this.validateExpiryDate(cardData.expiry)) {
      return of({
        success: false,
        paymentId: '',
        method: 'credit_card' as const,
        message: 'Cartão expirado ou data inválida.',
        timestamp: new Date().toISOString()
      }).pipe(delay(1000));
    }

    if (!this.validateCVV(cardData.cvv)) {
      return of({
        success: false,
        paymentId: '',
        method: 'credit_card' as const,
        message: 'CVV inválido.',
        timestamp: new Date().toISOString()
      }).pipe(delay(1000));
    }

    // Simular processamento
    const paymentId = `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transactionId = `tx_${Date.now()}`;

    // Simular 5% de chance de falha (para teste)
    const success = Math.random() > 0.05;

    return of({
      success,
      paymentId,
      method: 'credit_card' as const,
      transactionId: success ? transactionId : undefined,
      message: success 
        ? `Pagamento aprovado! ${cardData.installments}x de R$ ${(amount / cardData.installments).toFixed(2)}`
        : 'Pagamento recusado. Verifique os dados do cartão.',
      timestamp: new Date().toISOString()
    }).pipe(delay(2000));
  }

  /**
   * Gera checksum para código PIX (simulado)
   */
  private generatePixChecksum(paymentId: string): string {
    // Algoritmo simplificado de checksum
    let hash = 0;
    for (let i = 0; i < paymentId.length; i++) {
      const char = paymentId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 4).toUpperCase();
  }

  /**
   * Formata número de cartão (máscara)
   */
  formatCardNumber(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  }

  /**
   * Formata data de expiração (MM/AA)
   */
  formatExpiryDate(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  }
}

