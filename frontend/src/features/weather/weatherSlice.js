import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http, { getErrorMessage } from '../../api/http';

export const fetchWeather = createAsyncThunk('weather/fetch', async (city, { rejectWithValue }) => {
  try {
    const { data } = await http.get('/weather', { params: city ? { city } : {} });
    return data.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default weatherSlice.reducer;
