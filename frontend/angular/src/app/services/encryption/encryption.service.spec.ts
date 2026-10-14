import { TestBed } from '@angular/core/testing';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncryptionService]
    });
    service = TestBed.inject(EncryptionService);
  });

  it('should encrypt and decrypt a plain string using CryptoJS', () => {
    const raw = 'my-jwt-secret-token-12345';
    const encrypted = service.encrypt(raw);

    expect(encrypted).toBeTruthy();
    expect(encrypted).not.toBe(raw);

    const decrypted = service.decrypt(encrypted);
    expect(decrypted).toBe(raw);
  });

  it('should return empty string for empty inputs', () => {
    expect(service.encrypt('')).toBe('');
    expect(service.decrypt('')).toBe('');
  });
});
