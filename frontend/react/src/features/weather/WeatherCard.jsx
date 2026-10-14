import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchWeather } from './weatherSlice';

export default function WeatherCard() {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.weather);
  const [city, setCity] = useState('');

  useEffect(() => {
    dispatch(fetchWeather());
  }, [dispatch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    const result = await dispatch(fetchWeather(city.trim()));
    if (fetchWeather.fulfilled.match(result)) {
      toast.success(`Weather loaded for ${result.payload.city}!`);
    } else {
      toast.error(result.payload || `Could not find weather for "${city.trim()}"`);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌤️</span>
          <h3 className="font-bold text-slate-900 text-base">Live Weather</h3>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
          Open-Meteo
        </span>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          placeholder="Search city (e.g. London)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-sm disabled:opacity-60 transition-all cursor-pointer"
        >
          {status === 'loading' ? '...' : 'Go'}
        </button>
      </form>

      {status === 'loading' && (
        <div className="py-6 text-center text-slate-400">
          <div className="inline-block animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full mb-1"></div>
          <p className="text-xs">Fetching live weather...</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs mb-2">
          {error}
        </div>
      )}

      {data && status !== 'loading' && (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {data.temperature}
              </span>
              <span className="text-lg font-bold text-slate-500 ml-1">
                {data.units.temperature}
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {data.condition}
            </span>
          </div>

          <div className="text-sm font-semibold text-slate-800">
            📍 {data.city}, {data.country}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Humidity</span>
              <span className="font-semibold text-slate-800 text-sm">{data.humidity}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Wind Speed</span>
              <span className="font-semibold text-slate-800 text-sm">
                {data.windSpeed} {data.units.windSpeed}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
