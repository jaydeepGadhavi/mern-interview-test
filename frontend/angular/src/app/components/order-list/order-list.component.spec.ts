import { TestBed } from '@angular/core/testing';
import { OrderListComponent } from './order-list.component';
import { Order } from '../../models/order.model';

describe('OrderListComponent', () => {
  let component: OrderListComponent;

  const mockOrder: Order = {
    orderId: 101,
    userId: 1,
    productIds: ['prod-1'],
    totalAmount: 499,
    createdAt: new Date().toISOString()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
  });

  it('should create the order list component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cancelOrder on cancel action', () => {
    vi.spyOn(component.cancelOrder, 'emit');
    component.onCancel(101);
    expect(component.cancelOrder.emit).toHaveBeenCalledWith(101);
  });

  it('should map productIds to item fallback names', () => {
    const items = component.getOrderItems(mockOrder);
    expect(items.length).toBe(1);
    expect(items[0].name).toContain('Product #prod-1');
  });

  it('should manage orderToCancel state through modal interactions', () => {
    vi.spyOn(component.cancelOrder, 'emit');

    component.promptCancel(mockOrder);
    expect(component.orderToCancel()).toEqual(mockOrder);

    component.closeCancelModal();
    expect(component.orderToCancel()).toBeNull();

    component.promptCancel(mockOrder);
    component.confirmCancel();
    expect(component.cancelOrder.emit).toHaveBeenCalledWith(101);
    expect(component.orderToCancel()).toBeNull();
  });
});
