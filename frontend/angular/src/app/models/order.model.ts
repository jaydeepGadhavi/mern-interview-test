import { Product } from './product.model';

export interface OrderItem {
  id?: string;
  name: string;
  price: number | null;
}

export interface Order {
  orderId: number;
  userId: number;
  productIds: string[];
  totalAmount: number;
  createdAt?: string;
  products?: OrderItem[] | Product[];
}

export interface CreateOrderPayload {
  productIds: string[];
}
