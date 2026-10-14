import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Product, ProductFormData } from '../../models/product.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService = inject(ApiService);

  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.apiService.get<ApiResponse<Product[]>>('/products');
  }

  addProduct(productData: ProductFormData): Observable<ApiResponse<Product>> {
    return this.apiService.post<ApiResponse<Product>>('/products', productData);
  }

  updateProduct(id: string, productData: ProductFormData): Observable<ApiResponse<Product>> {
    return this.apiService.put<ApiResponse<Product>>(`/products/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.apiService.delete<any>(`/products/${id}`);
  }
}
