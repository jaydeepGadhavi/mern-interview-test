import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Product, ProductFormData } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
  private _product: Product | null = null;

  @Input() set product(val: Product | null) {
    this._product = val;
    if (val) {
      this.name.set(val.name);
      this.price.set(val.price);
      this.description.set(val.description || '');
    } else {
      this.resetForm();
    }
  }

  get product(): Product | null {
    return this._product;
  }

  @Output() formSubmit = new EventEmitter<ProductFormData>();
  @Output() formCancel = new EventEmitter<void>();

  name = signal<string>('');
  price = signal<number | string>('');
  description = signal<string>('');

  onSubmit(): void {
    const n = this.name().trim();
    const p = this.price();
    if (!n || p === '' || p === null) return;

    this.formSubmit.emit({
      name: n,
      price: Number(p),
      description: this.description().trim()
    });

    if (!this.product) {
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.formCancel.emit();
  }

  private resetForm(): void {
    this.name.set('');
    this.price.set('');
    this.description.set('');
  }
}
