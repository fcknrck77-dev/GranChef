export interface AdminSettings {
  supportEmail: string;
  supportPhone: string;
  billingDescriptor: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  plan: 'PRO' | 'PREMIUM';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  method: 'CARD';
  processor: 'STRIPE';
  date: string;
  reference: string;
  last4?: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    customerName: 'Auguste Escoffier',
    customerEmail: 'auguste@modern.com',
    plan: 'PREMIUM',
    status: 'COMPLETED',
    method: 'CARD',
    processor: 'STRIPE',
    last4: '4242',
    date: '2026-03-14',
    reference: 'APPGRANDCHEF-XJ82K1'
  },
  {
    id: '2',
    customerName: 'Ferran Adrià',
    customerEmail: 'ferran@elbulli.com',
    plan: 'PRO',
    status: 'PENDING',
    method: 'CARD',
    processor: 'STRIPE',
    last4: '1881',
    date: '2026-03-15',
    reference: 'APPGRANDCHEF-MZP93L'
  }
];

export const INITIAL_SETTINGS: AdminSettings = {
  supportEmail: 'soporte@grandchef.app',
  supportPhone: '+34 600 000 000',
  billingDescriptor: 'APPGRANDCHEF'
};
