import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http, { getErrorMessage } from '../../api/http';

const thunk = (type, request) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await request(arg);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  });

export const fetchProducts = thunk('products/fetchAll', async () => (await http.get('/products')).data.data);
export const addProduct = thunk('products/add', async (product) => (await http.post('/products', product)).data.data);
export const editProduct = thunk(
  'products/edit',
  async ({ id, ...changes }) => (await http.put(`/products/${id}`, changes)).data.data
);
export const removeProduct = thunk('products/remove', async (id) => {
  await http.delete(`/products/${id}`);
  return id;
});

const initialState = {
  items: [],
  status: 'idle', // idle | loading | failed
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith('products/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
