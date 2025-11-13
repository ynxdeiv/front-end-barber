export type PaymentStatus = 'pending' | 'paid' | 'cancelled';

export interface Pagamento {
  id: string;
  barbeiroId: number;
  barbeiroName: string;
  appointmentId?: string; // Opcional: link com agendamento
  amount: number; // Valor total do serviço
  commission: number; // Valor da comissão do barbeiro
  serviceDescription: string; // Descrição do serviço prestado
  status: PaymentStatus;
  paymentDate?: string; // ISO date string - quando foi pago
  dueDate: string; // ISO date string - data de vencimento
  createdAt: string; // ISO date string
  notes?: string; // Observações adicionais
}

