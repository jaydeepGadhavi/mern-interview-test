import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProductService } from './product.service';
import { ApiService } from '../api/api.service';
import { Product } from '../../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let apiServiceMock: any;

  const mockProducts: Product[] = [
    { id: '1', name: 'Product A', price: 100, description: 'Desc A' },
    { id: '2', name: 'Product B', price: 200, description: 'Desc B' }
  ];

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });

    service = TestBed.inject(ProductService);
  });

  it('should call apiService.get for getProducts', () => {
    apiServiceMock.get.mockReturnValue(of({ success: true, data: mockProducts }));

    service.getProducts().subscribe(res => {
      expect(res.data).toEqual(mockProducts);
    });

    expect(apiServiceMock.get).toHaveBeenCalledWith('/products');
  });

  it('should call apiService.post for addProduct', () => {
    const newProduct: Product = { id: '3', name: 'Product C', price: 300, description: 'Desc C' };
    apiServiceMock.post.mockReturnValue(of({ success: true, data: newProduct }));

    service.addProduct({ name: 'Product C', price: 300, description: 'Desc C' }).subscribe();

    expect(apiServiceMock.post).toHaveBeenCalledWith('/products', {
      name: 'Product C',
      price: 300,
      description: 'Desc C'
    });
  });

  it('should call apiService.put for updateProduct', () => {
    const updatedProduct: Product = { id: '1', name: 'Product Updated', price: 150, description: 'Updated' };
    apiServiceMock.put.mockReturnValue(of({ success: true, data: updatedProduct }));

    service.updateProduct('1', { name: 'Product Updated', price: 150, description: 'Updated' }).subscribe();

    expect(apiServiceMock.put).toHaveBeenCalledWith('/products/1', {
      name: 'Product Updated',
      price: 150,
      description: 'Updated'
    });
  });

  it('should call apiService.delete for deleteProduct', () => {
    apiServiceMock.delete.mockReturnValue(of(null));

    service.deleteProduct('1').subscribe();

    expect(apiServiceMock.delete).toHaveBeenCalledWith('/products/1');
  });
});
