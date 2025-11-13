export interface Barbeiro {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty?: string; // Ex: "Corte Clássico", "Barba", "Completo"
  active: boolean;
  commissionPercentage: number; // Porcentagem de comissão (ex: 50 = 50%)
  createdAt: string; // ISO date string
}

