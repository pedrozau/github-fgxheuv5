import { Plan } from './types';

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Grátis',
    price: 0,
    productLimit: 10,
    features: [
      'Até 10 produtos',
      'Dashboard básico',
      'Suporte por email',
    ],
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 2500,
    productLimit: 50,
    features: [
      'Até 50 produtos',
      'Dashboard avançado',
      'Suporte prioritário',
      'Relatórios básicos',
    ],
    isPopular: true,
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 5000,
    productLimit: 200,
    features: [
      'Até 200 produtos',
      'Dashboard completo',
      'Suporte 24/7',
      'Relatórios avançados',
      'Produtos em destaque',
      'API de integração',
    ],
  },
];