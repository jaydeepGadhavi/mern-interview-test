import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './encryption';

describe('Encryption Service', () => {
  it('should encrypt and decrypt a plaintext string correctly', () => {
    const text = 'my-secret-jwt-token-12345';
    const encrypted = encrypt(text);

    expect(encrypted).toBeTruthy();
    expect(encrypted).not.toBe(text);

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(text);
  });

  it('should return empty string when encrypting or decrypting empty/invalid input', () => {
    expect(encrypt('')).toBe('');
    expect(decrypt('')).toBe('');
    expect(decrypt('invalid-cipher-text')).toBe('');
  });
});
