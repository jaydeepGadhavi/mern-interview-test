import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product/product.service';
import { OrderService } from '../../services/order/order.service';
import { Product, ProductFormData } from '../../models/product.model';
import { Order } from '../../models/order.model';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { WeatherCardComponent } from '../../components/weather-card/weather-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    ProductFormComponent,
    ProductListComponent,
    OrderListComponent,
    WeatherCardComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private toastr = inject(ToastrService);

  products = signal<Product[]>([]);
  orders = signal<Order[]>([]);
  editingProduct = signal<Product | null>(null);
  productError = signal<string | null>(null);

  totalSpent = computed(() =>
    this.orders().reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
  );

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts(): void {
    this.productError.set(null);
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.data || []);
      },
      error: (err) => {
        this.productError.set(err);
      }
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders.set(res.data || []);
      },
      error: (err) => {
        this.toastr.error(err || 'Failed to load orders');
      }
    });
  }

  handleProductSubmit(data: ProductFormData): void {
    const editing = this.editingProduct();
    if (editing) {
      this.productService.updateProduct(editing.id, data).subscribe({
        next: (res) => {
          this.products.update(list => list.map(p => p.id === editing.id ? res.data : p));
          this.editingProduct.set(null);
          this.toastr.success(`Product "${res.data.name}" updated successfully!`);
        },
        error: (err) => {
          this.productError.set(err);
          this.toastr.error(err || 'Failed to update product');
        }
      });
    } else {
      this.productService.addProduct(data).subscribe({
        next: (res) => {
          this.products.update(list => [res.data, ...list]);
          this.toastr.success(`Product "${res.data.name}" created successfully!`);
        },
        error: (err) => {
          this.productError.set(err);
          this.toastr.error(err || 'Failed to add product');
        }
      });
    }
  }

  handleDeleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(list => list.filter(p => p.id !== id));
        this.toastr.success('Product deleted successfully!');
      },
      error: (err) => {
        this.toastr.error(err || 'Failed to delete product');
      }
    });
  }

  handlePlaceOrder(product: Product): void {
    this.orderService.placeOrder([product.id]).subscribe({
      next: (res) => {
        this.orders.update(list => [res.data, ...list]);
        this.toastr.success(
          `Order #${res.data.orderId} created in MySQL! Total: ₹${Number(res.data.totalAmount).toFixed(2)}`
        );
      },
      error: (err) => {
        this.toastr.error(err || 'Failed to place order');
      }
    });
  }

  handleCancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.orders.update(list => list.filter(o => o.orderId !== orderId));
        this.toastr.success(`Order #${orderId} deleted from MySQL!`);
      },
      error: (err) => {
        this.toastr.error(err || 'Failed to cancel order');
      }
    });
  }
}
