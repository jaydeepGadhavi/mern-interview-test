import axios from 'axios';

export const TOKEN_KEY = 'token';

const http = axios.create({ baseURL: '/api' });

// Attach the JWT to every request when the user is logged in.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
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
