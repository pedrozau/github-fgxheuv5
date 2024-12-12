export interface Plan {
  id: string;
  name: string;
  price: number;
  productLimit: number;
  features: string[];
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  store_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer';
  last4?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
}