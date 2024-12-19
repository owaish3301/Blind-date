import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY; // Store in env

export const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};