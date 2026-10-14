import CryptoJS from 'crypto-js';

const SECRET_KEY = 'mern-mean-secret-key-2026';

export const encrypt = (value) => {
  if (!value) return '';
  return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
};

export const decrypt = (cipherText) => {
  if (!cipherText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
};

export default {
  encrypt,
  decrypt
};
