// Configuración de pasarela (solo tarjeta vía Stripe)
export const ADMIN_PAYMENT_CONFIG = {
  card: {
    provider: 'Stripe',
    descriptor: 'APPGRANDCHEF',
    supportEmail: 'soporte@grandchef.app'
  }
};
