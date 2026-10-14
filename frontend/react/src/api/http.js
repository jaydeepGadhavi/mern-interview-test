import axios from 'axios';
import { getCookie } from '../services/cookie';

export const TOKEN_KEY = 'token';

const http = axios.create({ baseURL: '/api' });

// Attach the decrypted JWT to every request when the user is logged in.
http.interceptors.request.use((config) => {
  const token = getCookie(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn any axios error into a plain message string for the Redux slices.
export const getErrorMessage = (error) =>
  error.response?.data?.details?.join(', ') ||
  error.response?.data?.message ||
  error.message ||
  'Something went wrong';

export default http;

