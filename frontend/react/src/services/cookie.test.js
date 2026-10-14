import { describe, it, expect, beforeEach } from 'vitest';
import { getCookie, setCookie, deleteCookie } from './cookie';

describe('Cookie Service', () => {
  beforeEach(() => {
    deleteCookie('test_cookie');
  });

  it('should set encrypted cookie value and retrieve decrypted value', () => {
    setCookie('test_cookie', 'test_value');

    // document.cookie should NOT contain raw plaintext
    expect(document.cookie).not.toContain('test_value');

    // getCookie retrieves and decrypts it automatically
    expect(getCookie('test_cookie')).toBe('test_value');
  });

  it('should delete a cookie', () => {
    setCookie('test_cookie', 'test_value');
    expect(getCookie('test_cookie')).toBe('test_value');

    deleteCookie('test_cookie');
    expect(getCookie('test_cookie')).toBeNull();
  });

  it('should return null for non-existing cookie', () => {
    expect(getCookie('non_existent')).toBeNull();
  });
});
