import { Injectable } from '@angular/core';
import { Pagamento, PaymentStatus } from '../models/pagamento';
import { BarberService } from './barber.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly STORAGE_KEY = 'barber_payments';

  constructor(private barberService: BarberService) {
    // Inicializar storage se não existir
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  /**
   * Obtém todos os pagamentos
   */
  getAllPayments(): Pagamento[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Obtém pagamentos por barbeiro
   */
  getPaymentsByBarbeiro(barbeiroId: number): Pagamento[] {
    const allPayments = this.getAllPayments();
    return allPayments.filter(p => p.barbeiroId === barbeiroId);
  }

  /**
   * Obtém pagamentos por status
   */
  getPaymentsByStatus(status: PaymentStatus): Pagamento[] {
    const allPayments = this.getAllPayments();
    return allPayments.filter(p => p.status === status);
  }

  /**
   * Obtém pagamentos pendentes
   */
  getPendingPayments(): Pagamento[] {
    return this.getPaymentsByStatus('pending');
  }

  /**
   * Obtém pagamentos por período
   */
  getPaymentsByDateRange(startDate: Date, endDate: Date): Pagamento[] {
    const allPayments = this.getAllPayments();
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return allPayments.filter(payment => {
      const paymentDate = new Date(payment.createdAt).getTime();
      return paymentDate >= start && paymentDate <= end;
    });
  }

  /**
   * Cria um novo pagamento
   */
  createPayment(
    barbeiroId: number,
    amount: number,
    serviceDescription: string,
    appointmentId?: string,
    notes?: string
  ): Pagamento | null {
    const barbeiro = this.barberService.getBarbeiroById(barbeiroId);
    if (!barbeiro) {
      console.error('Barbeiro não encontrado:', barbeiroId);
      return null;
    }

    const commission = (amount * barbeiro.commissionPercentage) / 100;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Vencimento em 7 dias

    const payment: Pagamento = {
      id: this.generateId(),
      barbeiroId,
      barbeiroName: barbeiro.name,
      appointmentId,
      amount,
      commission,
      serviceDescription,
      status: 'pending',
      dueDate: dueDate.toISOString(),
      createdAt: new Date().toISOString(),
      notes
    };

    const allPayments = this.getAllPayments();
    allPayments.push(payment);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allPayments));

    return payment;
  }

  /**
   * Marca um pagamento como pago
   */
  markAsPaid(paymentId: string, paymentDate?: Date): boolean {
    const allPayments = this.getAllPayments();
    const index = allPayments.findIndex(p => p.id === paymentId);
    
    if (index === -1) {
      return false;
    }

    allPayments[index] = {
      ...allPayments[index],
      status: 'paid',
      paymentDate: (paymentDate || new Date()).toISOString()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allPayments));
    return true;
  }

  /**
   * Cancela um pagamento
   */
  cancelPayment(paymentId: string): boolean {
    const allPayments = this.getAllPayments();
    const index = allPayments.findIndex(p => p.id === paymentId);
    
    if (index === -1) {
      return false;
    }

    allPayments[index] = {
      ...allPayments[index],
      status: 'cancelled'
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allPayments));
    return true;
  }

  /**
   * Atualiza um pagamento
   */
  updatePayment(paymentId: string, updates: Partial<Pagamento>): boolean {
    const allPayments = this.getAllPayments();
    const index = allPayments.findIndex(p => p.id === paymentId);
    
    if (index === -1) {
      return false;
    }

    allPayments[index] = { ...allPayments[index], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allPayments));
    return true;
  }

  /**
   * Remove um pagamento
   */
  deletePayment(paymentId: string): boolean {
    const allPayments = this.getAllPayments();
    const filtered = allPayments.filter(p => p.id !== paymentId);
    
    if (filtered.length === allPayments.length) {
      return false; // Não encontrado
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  /**
   * Calcula total de pagamentos pendentes
   */
  getTotalPendingAmount(): number {
    const pending = this.getPendingPayments();
    return pending.reduce((total, p) => total + p.commission, 0);
  }

  /**
   * Calcula total de pagamentos por barbeiro
   */
  getTotalByBarbeiro(barbeiroId: number): { total: number; pending: number; paid: number } {
    const payments = this.getPaymentsByBarbeiro(barbeiroId);
    return {
      total: payments.reduce((sum, p) => sum + p.commission, 0),
      pending: payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.commission, 0),
      paid: payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.commission, 0)
    };
  }

  /**
   * Processa pagamento para um agendamento existente
   */
  processAppointmentPayment(
    appointmentId: string,
    appointmentServiceName: string,
    appointmentServicePrice: number,
    paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'cash',
    barbeiroId?: number
  ): { success: boolean; paymentId?: string; message: string } {
    // Criar pagamento associado ao agendamento
    const payment = this.createPayment(
      barbeiroId || 1, // Usar barbeiro padrão se não especificado
      appointmentServicePrice,
      `Pagamento: ${appointmentServiceName}`,
      appointmentId
    );

    if (!payment) {
      return {
        success: false,
        message: 'Erro ao processar pagamento.'
      };
    }

    // Marcar como pago imediatamente (simulação)
    this.markAsPaid(payment.id);

    return {
      success: true,
      paymentId: payment.id,
      message: 'Pagamento processado com sucesso!'
    };
  }

  /**
   * Gera um ID único para o pagamento
   */
  private generateId(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

