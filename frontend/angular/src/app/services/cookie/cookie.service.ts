import { Injectable, inject } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private encryptionService = inject(EncryptionService);

  get(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + encodeURIComponent(name) + '=([^;]*)'));
    if (!match) return null;
    const raw = decodeURIComponent(match[2]);
    const decrypted = this.encryptionService.decrypt(raw);
    return decrypted || null;
  }

  set(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return;
    const encrypted = this.encryptionService.encrypt(value);
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(encrypted)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
  }

  delete(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/`;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`;
  }
}

