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

export const MOCK_ORDERS: Order[] = [];

export const INITIAL_SETTINGS: AdminSettings = {
  supportEmail: 'soporte@grandchef.app',
  supportPhone: '+34 600 000 000',
  billingDescriptor: 'APPGRANDCHEF'
};
