import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';
import { EncryptionService } from '../encryption/encryption.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService, EncryptionService]
    });
    service = TestBed.inject(CookieService);
  });

  afterEach(() => {
    service.delete('test_key');
  });

  it('should set encrypted cookie, get decrypted value, and delete a cookie', () => {
    service.set('test_key', 'test_value');

    // document.cookie should NOT contain raw plaintext 'test_value'
    expect(document.cookie).not.toContain('test_value');

    // get() automatically decrypts it back to original value
    expect(service.get('test_key')).toBe('test_value');

    service.delete('test_key');
    expect(service.get('test_key')).toBeNull();
  });
});

