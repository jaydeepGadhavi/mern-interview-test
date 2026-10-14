import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrderService } from './order.service';
import { ApiService } from '../api/api.service';
import { Order } from '../../models/order.model';

describe('OrderService', () => {
  let service: OrderService;
  let apiServiceMock: any;

  const mockOrders: Order[] = [
    { orderId: 1, userId: 1, productIds: ['p1'], totalAmount: 499 }
  ];

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });

    service = TestBed.inject(OrderService);
  });

  it('should call apiService.get on getOrders', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: mockOrders }));

    service.getOrders().subscribe(res => {
      expect(res.data).toEqual(mockOrders);
    });

    expect(apiServiceMock.get).toHaveBeenCalledWith('/orders');
  });

  it('should call apiService.post on placeOrder', () => {
    apiServiceMock.post.mockReturnValue(of({ success: true, data: mockOrders[0] }));

    service.placeOrder(['p1']).subscribe();

    expect(apiServiceMock.post).toHaveBeenCalledWith('/orders', { productIds: ['p1'] });
  });

  it('should call apiService.delete on cancelOrder', () => {
    apiServiceMock.delete.mockReturnValue(of(null));

    service.cancelOrder(1).subscribe();

    expect(apiServiceMock.delete).toHaveBeenCalledWith('/orders/1');
  });
});
