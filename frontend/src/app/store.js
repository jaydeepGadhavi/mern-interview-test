import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import orderReducer from '../features/orders/orderSlice';
import weatherReducer from '../features/weather/weatherSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    weather: weatherReducer,
  },
});
