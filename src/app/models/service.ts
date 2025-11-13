export type ServiceCategory = 'hair' | 'beard' | 'combo' | 'other';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // em minutos
  category: ServiceCategory;
  active: boolean;
  barbershopId?: number; // Para serviços específicos de uma barbearia
  imageUrl?: string; // URL da imagem do serviço (opcional)
}

