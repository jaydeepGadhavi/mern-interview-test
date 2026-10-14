import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from '../api/api.service';
import { CookieService } from '../cookie/cookie.service';
import { EncryptionService } from '../encryption/encryption.service';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceMock: any;
  let cookieService: CookieService;
  let encryptionService: EncryptionService;

  beforeEach(() => {
    apiServiceMock = {
      post: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        CookieService,
        EncryptionService,
        provideRouter([]),
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });

    service = TestBed.inject(AuthService);
    cookieService = TestBed.inject(CookieService);
    encryptionService = TestBed.inject(EncryptionService);

    cookieService.delete('token');
    cookieService.delete('user');
  });

  afterEach(() => {
    cookieService.delete('token');
    cookieService.delete('user');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isAuthenticated when token is absent', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should return true for isAuthenticated when token is in cookie', () => {
    service.saveAuth({
      token: 'sample-token',
      user: { id: 1, username: 'john' }
    });
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should save token and user in saveAuth with encryption', () => {
    service.saveAuth({
      token: 'jwt-token-123',
      user: { id: 1, username: 'john_doe' }
    });

    expect(service.getToken()).toBe('jwt-token-123');
    expect(service.getUser()?.username).toBe('john_doe');

    // Verify stored cookie in document.cookie is encrypted and not plaintext
    expect(document.cookie).not.toContain('jwt-token-123');
    expect(cookieService.get('token')).toBe('jwt-token-123');
    expect(service.getToken()).toBe('jwt-token-123');
  });

  it('should clear token and user on logout', () => {
    service.saveAuth({
      token: 'sample-token',
      user: { id: 1, username: 'john' }
    });

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.getUser()).toBeNull();
  });

  it('should call apiService.post on login', () => {
    const creds = { username: 'john', password: 'Password@123' };
    apiServiceMock.post.mockReturnValue(of({ success: true, data: { user: { id: 1, username: 'john' }, token: 'abc' } }));

    service.login(creds).subscribe();

    expect(apiServiceMock.post).toHaveBeenCalledWith('/auth/login', creds);
  });
});
