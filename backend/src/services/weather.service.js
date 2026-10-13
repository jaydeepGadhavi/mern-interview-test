const ApiError = require('../utils/ApiError');

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 8000;

// Subset of WMO weather codes returned by Open-Meteo.
const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Heavy rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm with hail',
};

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw ApiError.badGateway(`Weather provider responded with ${response.status}`);
    return await response.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'AbortError') throw ApiError.badGateway('Weather provider timed out');
    throw ApiError.badGateway('Could not reach weather provider');
  } finally {
    clearTimeout(timer);
  }
}

async function getCurrentWeather(city) {
  const geo = await fetchJson(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1`);
  const place = geo.results && geo.results[0];
  if (!place) throw ApiError.notFound(`City "${city}" not found`);

  const forecastUrl =
    `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code';
  const forecast = await fetchJson(forecastUrl);
  const current = forecast.current;
  if (!current) throw ApiError.badGateway('Unexpected response from weather provider');

  return {
    city: place.name,
    country: place.country,
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    condition: WEATHER_CODES[current.weather_code] || 'Unknown',
    units: {
      temperature: forecast.current_units?.temperature_2m || '°C',
      windSpeed: forecast.current_units?.wind_speed_10m || 'km/h',
    },
    observedAt: current.time,
  };
}

module.exports = { getCurrentWeather };
