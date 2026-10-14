import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import http, { TOKEN_KEY, getErrorMessage } from '../../api/http';
import { getCookie, setCookie, deleteCookie } from '../../services/cookie';

const USER_KEY = 'user';

const readToken = () => {
  return getCookie(TOKEN_KEY);
};

const readUser = () => {
  try {
    const raw = getCookie(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const authRequest = (path) => async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await http.post(`/auth/${path}`, credentials);
    return data.data; // { user, token }
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
};

export const registerUser = createAsyncThunk('auth/register', authRequest('register'));
export const loginUser = createAsyncThunk('auth/login', authRequest('login'));

const initialState = {
  user: readUser(),
  token: readToken(),
  status: 'idle', // idle | loading | failed
  error: null,
};

const onPending = (state) => {
  state.status = 'loading';
  state.error = null;
};

const onFulfilled = (state, action) => {
  state.status = 'idle';
  state.user = action.payload.user;
  state.token = action.payload.token;
  setCookie(TOKEN_KEY, action.payload.token);
  setCookie(USER_KEY, JSON.stringify(action.payload.user));
};

const onRejected = (state, action) => {
  state.status = 'failed';
  state.error = action.payload || action.error.message;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      deleteCookie(TOKEN_KEY);
      deleteCookie(USER_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, onPending)
      .addCase(registerUser.fulfilled, onFulfilled)
      .addCase(registerUser.rejected, onRejected)
      .addCase(loginUser.pending, onPending)
      .addCase(loginUser.fulfilled, onFulfilled)
      .addCase(loginUser.rejected, onRejected);
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

