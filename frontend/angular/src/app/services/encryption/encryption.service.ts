import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly secretKey = 'mern-mean-secret-key-2026';

  encrypt(value: string): string {
    if (!value) return '';
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(cipherText: string): string {
    if (!cipherText) return '';
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }
}
