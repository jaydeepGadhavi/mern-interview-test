import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SpinnerService } from '../spinner/spinner.service';
import { CookieService } from '../cookie/cookie.service';
import { EncryptionService } from '../encryption/encryption.service';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let spinnerServiceMock: any;
  let cookieService: CookieService;
  let encryptionService: EncryptionService;

  beforeEach(() => {
    spinnerServiceMock = {
      show: vi.fn(),
      hide: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        CookieService,
        EncryptionService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SpinnerService, useValue: spinnerServiceMock }
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    cookieService = TestBed.inject(CookieService);
    encryptionService = TestBed.inject(EncryptionService);

    cookieService.delete('token');
  });

  afterEach(() => {
    httpMock.verify();
    cookieService.delete('token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include Content-Type in getHeader', () => {
    const headers = service.getHeader();
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.has('Authorization')).toBe(false);
  });

  it('should include Authorization Bearer header when decrypted token exists in cookie', () => {
    cookieService.set('token', 'sample-test-token-123');
    const headers = service.getHeader();
    expect(headers.get('Authorization')).toBe('Bearer sample-test-token-123');
  });

  it('should send POST request with headers and trigger spinner show/hide', () => {
    cookieService.set('token', 'my-auth-token');
    const testData = { name: 'Keyboard', price: 999 };

    service.post('/products', testData).subscribe((res: any) => {
      expect(res.success).toBe(true);
      expect(res.data.name).toBe('Keyboard');
    });

    expect(spinnerServiceMock.show).toHaveBeenCalled();

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-auth-token');
    expect(req.request.body).toEqual(testData);

    req.flush({ success: true, data: { id: 'p1', ...testData } });
    expect(spinnerServiceMock.hide).toHaveBeenCalled();
  });

  it('should send GET request with params and trigger spinner show/hide', () => {
    service.get('/weather', { city: 'London' }).subscribe((res: any) => {
      expect(res.city).toBe('London');
    });

    expect(spinnerServiceMock.show).toHaveBeenCalled();

    const req = httpMock.expectOne('/api/weather?city=London');
    expect(req.request.method).toBe('GET');
    req.flush({ city: 'London' });

    expect(spinnerServiceMock.hide).toHaveBeenCalled();
  });
});

