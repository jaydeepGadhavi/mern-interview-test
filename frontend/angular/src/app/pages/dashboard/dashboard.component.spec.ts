import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DashboardComponent } from './dashboard.component';
import { ProductService } from '../../services/product/product.service';
import { OrderService } from '../../services/order/order.service';
import { WeatherService } from '../../services/weather/weather.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let productServiceMock: any;
  let orderServiceMock: any;
  let weatherServiceMock: any;
  let toastrMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProducts: vi.fn().mockReturnValue(of({
        success: true,
        data: [{ id: '1', name: 'Product 1', price: 100 }]
      })),
      addProduct: vi.fn().mockReturnValue(of({ success: true, data: { id: '2', name: 'P2', price: 200 } })),
      updateProduct: vi.fn().mockReturnValue(of({ success: true, data: { id: '1', name: 'P1 Updated', price: 150 } })),
      deleteProduct: vi.fn().mockReturnValue(of({}))
    };

    orderServiceMock = {
      getOrders: vi.fn().mockReturnValue(of({
        success: true,
        data: [{ orderId: 1, userId: 1, productIds: ['1'], totalAmount: 100 }]
      })),
      placeOrder: vi.fn().mockReturnValue(of({
        success: true,
        data: { orderId: 2, userId: 1, productIds: ['2'], totalAmount: 200 }
      })),
      cancelOrder: vi.fn().mockReturnValue(of({}))
    };

    weatherServiceMock = {
      getWeather: vi.fn().mockReturnValue(of({ success: true, data: null }))
    };

    toastrMock = {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: WeatherService, useValue: weatherServiceMock },
        { provide: ToastrService, useValue: toastrMock }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and orders into signals on init', () => {
    component.ngOnInit();
    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(orderServiceMock.getOrders).toHaveBeenCalled();
    expect(component.products().length).toBe(1);
    expect(component.orders().length).toBe(1);
  });

  it('should calculate computed totalSpent correctly from orders signal', () => {
    component.orders.set([
      { orderId: 1, userId: 1, productIds: ['1'], totalAmount: 40 },
      { orderId: 2, userId: 1, productIds: ['2'], totalAmount: 60 }
    ]);
    expect(component.totalSpent()).toBe(100);
  });
});
