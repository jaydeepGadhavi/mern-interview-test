import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Order, CreateOrderPayload } from '../../models/order.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiService = inject(ApiService);

  getOrders(): Observable<ApiResponse<Order[]>> {
    return this.apiService.get<ApiResponse<Order[]>>('/orders');
  }

  placeOrder(productIds: string[]): Observable<ApiResponse<Order>> {
    const payload: CreateOrderPayload = { productIds };
    return this.apiService.post<ApiResponse<Order>>('/orders', payload);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.apiService.delete<any>(`/orders/${orderId}`);
  }
}
