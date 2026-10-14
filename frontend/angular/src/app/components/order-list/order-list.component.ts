import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Order, OrderItem } from '../../models/order.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent {
  @Input() orders: Order[] = [];
  @Input() products: Product[] = [];
  @Output() cancelOrder = new EventEmitter<number>();

  orderToCancel = signal<Order | null>(null);

  getOrderItems(order: Order): OrderItem[] {
    if (order.products && Array.isArray(order.products) && order.products.length > 0) {
      return order.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price ?? null
      }));
    }

    if (Array.isArray(order.productIds)) {
      const productMap = new Map((this.products || []).map(p => [p.id, p]));
      return order.productIds.map(id => {
        const found = productMap.get(id);
        return found
          ? { id, name: found.name, price: found.price }
          : { id, name: `Product #${id.slice(-6)}`, price: null };
      });
    }

    return [];
  }

  promptCancel(order: Order): void {
    this.orderToCancel.set(order);
  }

  confirmCancel(): void {
    const order = this.orderToCancel();
    if (order) {
      this.cancelOrder.emit(order.orderId);
      this.orderToCancel.set(null);
    }
  }

  closeCancelModal(): void {
    this.orderToCancel.set(null);
  }

  onCancel(orderId: number): void {
    this.cancelOrder.emit(orderId);
  }
}
