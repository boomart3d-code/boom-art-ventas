export enum PaymentMethod {
  EFECTIVO = 'Efectivo',
  YAPE = 'Yape',
  PLIN = 'Plin'
}

export enum DeliveryMethod {
  RECOJO = 'Recojo',
  YANGO = 'Yango',
  INDRIVER = 'InDriver'
}

export interface Sale {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  buyerName: string;
  buyerPhone: string;
  product: string;
  cost: number;
  price: number;
  profit: number;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  notes?: string;
  timestamp: number; // For sorting
}

export interface User {
  email: string;
  name: string;
}

export interface SalesSummary {
  totalSales: number;
  totalCost: number;
  totalProfit: number;
  count: number;
}