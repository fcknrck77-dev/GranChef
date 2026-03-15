// Este archivo simula la base de datos privada del administrador
// En producción, esto vendría de variables de entorno o una DB segura.

export const ADMIN_PAYMENT_CONFIG = {
  bizum: {
    phone: "600000000", // Phone for reception
    merchantName: "APPGRANDCHEF"
  },
  transfer: {
    iban: "ES00 0000 0000 0000 0000 0000",
    bank: "GrandChef Bank Precision",
    holder: "Jesus Fernandez"
  }
};
