export interface AdminSettings {
  bizumPhone: string;
  iban: string;
  bankName: string;
  accountHolder: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  clientPhone?: string; // Teléfono del cliente para Bizum
  clientIban?: string;  // IBAN del cliente para Transferencia
  plan: 'PRO' | 'PREMIUM';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  method: 'BIZUM' | 'TRANSFER';
  date: string;
  reference: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    customerName: 'Auguste Escoffier',
    customerEmail: 'auguste@modern.com',
    clientIban: 'ES91 1234 5678 9012 3456 7890',
    plan: 'PREMIUM',
    status: 'COMPLETED',
    method: 'TRANSFER',
    date: '2026-03-14',
    reference: 'APPGRANDCHEF-XJ82K1'
  },
  {
    id: '2',
    customerName: 'Ferran Adrià',
    customerEmail: 'ferran@elbulli.com',
    clientPhone: '+34 611 222 333',
    plan: 'PRO',
    status: 'PENDING',
    method: 'BIZUM',
    date: '2026-03-15',
    reference: 'APPGRANDCHEF-MZP93L'
  }
];

export const INITIAL_SETTINGS: AdminSettings = {
  bizumPhone: '+34 600 000 000',
  iban: 'ES00 0000 0000 0000 0000 0000',
  bankName: 'Banco Gastronómico',
  accountHolder: 'GrandChef Lab SL'
};
