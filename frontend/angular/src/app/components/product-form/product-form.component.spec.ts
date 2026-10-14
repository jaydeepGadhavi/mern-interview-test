import { TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the product form component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit formSubmit on valid submit', () => {
    vi.spyOn(component.formSubmit, 'emit');

    component.name.set('Test Keyboard');
    component.price.set(1500);
    component.description.set('Mechanical keyboard');

    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      name: 'Test Keyboard',
      price: 1500,
      description: 'Mechanical keyboard'
    });
  });

  it('should populate signals when product input is set', () => {
    component.product = {
      id: 'prod-123',
      name: 'Gaming Mouse',
      price: 799,
      description: 'RGB optical mouse'
    };

    expect(component.name()).toBe('Gaming Mouse');
    expect(component.price()).toBe(799);
    expect(component.description()).toBe('RGB optical mouse');
  });
});
