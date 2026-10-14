export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  price: number | string;
  description?: string;
}
