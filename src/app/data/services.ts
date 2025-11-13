import { Service } from '../models/service';

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'svc_1',
    name: 'Corte Social',
    description: 'Corte moderno e estiloso com técnicas profissionais',
    price: 35.00,
    duration: 30,
    category: 'hair',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'
  },
  {
    id: 'svc_2',
    name: 'Barba',
    description: 'Aparar, modelar e finalizar sua barba com estilo',
    price: 25.00,
    duration: 20,
    category: 'beard',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
  },
  {
    id: 'svc_3',
    name: 'Combo',
    description: 'Pacote completo: corte e barba com desconto especial',
    price: 50.00,
    duration: 45,
    category: 'combo',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400'
  },
  {
    id: 'svc_4',
    name: 'Sobrancelha',
    description: 'Design e modelagem de sobrancelhas',
    price: 15.00,
    duration: 15,
    category: 'other',
    active: true,
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400'
  }
];

