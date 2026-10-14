import { TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { Product } from '../../models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;

  const mockProduct: Product = {
    id: 'prod-001',
    name: 'Wireless Headphones',
    price: 2499,
    description: 'Noise cancelling over-ear headphones'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create the product list component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit order event with product on onOrder', () => {
    vi.spyOn(component.order, 'emit');
    component.onOrder(mockProduct);
    expect(component.order.emit).toHaveBeenCalledWith(mockProduct);
  });

  it('should emit edit event on onEdit', () => {
    vi.spyOn(component.edit, 'emit');
    component.onEdit(mockProduct);
    expect(component.edit.emit).toHaveBeenCalledWith(mockProduct);
  });

  it('should emit delete event with id on onDelete', () => {
    vi.spyOn(component.delete, 'emit');
    component.onDelete('prod-001');
    expect(component.delete.emit).toHaveBeenCalledWith('prod-001');
  });

  it('should manage productToDelete state through modal interactions', () => {
    vi.spyOn(component.delete, 'emit');

    component.promptDelete(mockProduct);
    expect(component.productToDelete()).toEqual(mockProduct);

    component.closeDeleteModal();
    expect(component.productToDelete()).toBeNull();

    component.promptDelete(mockProduct);
    component.confirmDelete();
    expect(component.delete.emit).toHaveBeenCalledWith('prod-001');
    expect(component.productToDelete()).toBeNull();
  });
});
