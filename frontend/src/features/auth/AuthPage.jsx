import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearAuthError, loginUser, registerUser } from './authSlice';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const dispatch = useDispatch();
  const { token, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [mode, dispatch]);

  if (token) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isLogin ? loginUser(form) : registerUser(form);
    const result = await dispatch(action);

    if (isLogin ? loginUser.fulfilled.match(result) : registerUser.fulfilled.match(result)) {
      toast.success(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
    } else {
      const errMsg = result.payload || 'Authentication failed. Please try again.';
      toast.error(errMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/40 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 items-center justify-center font-bold text-xl mb-3 shadow-sm">
            {isLogin ? '🔑' : '✨'}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isLogin ? 'Enter your credentials to manage products' : 'Get started by creating a new account'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-2.5">
            <span className="text-rose-500 mt-0.5 font-bold">⚠️</span>
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
              placeholder={isLogin ? 'Enter your username' : 'e.g. user123 or user@domain.com'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition-all text-sm placeholder:text-slate-400"
            />
            {!isLogin && (
              <p className="text-xs text-slate-500 mt-1">
                3–50 characters (letters, numbers, @, _, -, .)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={isLogin ? 1 : 8}
              placeholder={isLogin ? 'Enter your password' : 'e.g. User@1234'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 transition-all text-sm placeholder:text-slate-400"
            />
            {!isLogin && (
              <p className="text-xs text-slate-500 mt-1">
                At least 8 chars with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Please wait...</span>
              </>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-500">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Create one now
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
