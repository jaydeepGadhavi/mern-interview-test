import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  @Input() products: Product[] = [];
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<string>();
  @Output() order = new EventEmitter<Product>();

  productToDelete = signal<Product | null>(null);

  onEdit(product: Product): void {
    this.edit.emit(product);
  }

  promptDelete(product: Product): void {
    this.productToDelete.set(product);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (product) {
      this.delete.emit(product.id);
      this.productToDelete.set(null);
    }
  }

  closeDeleteModal(): void {
    this.productToDelete.set(null);
  }

  onDelete(id: string): void {
    this.delete.emit(id);
  }

  onOrder(product: Product): void {
    this.order.emit(product);
  }
}
