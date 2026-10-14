import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http, { getErrorMessage } from '../../api/http';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await http.get('/orders');
    return data.data; // array of orders from MySQL
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const placeOrder = createAsyncThunk('orders/create', async (productIds, { rejectWithValue }) => {
  try {
    const { data } = await http.post('/orders', { productIds });
    return data.data; // newly created order
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const cancelOrder = createAsyncThunk('orders/delete', async (orderId, { rejectWithValue }) => {
  try {
    await http.delete(`/orders/${orderId}`);
    return orderId;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((order) => order.orderId !== action.payload);
      });
  },
});

export default orderSlice.reducer;
