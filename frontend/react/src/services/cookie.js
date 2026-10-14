import { encrypt, decrypt } from './encryption';

export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + encodeURIComponent(name) + '=([^;]*)'));
  if (!match) return null;
  const raw = decodeURIComponent(match[2]);
  const decrypted = decrypt(raw);
  return decrypted || null;
};

export const setCookie = (name, value, days = 7) => {
  if (typeof document === 'undefined') return;
  const encrypted = encrypt(value);
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(encrypted)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/; SameSite=Lax`;
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/`;
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`;
};

export default {
  get: getCookie,
  set: setCookie,
  delete: deleteCookie
};

