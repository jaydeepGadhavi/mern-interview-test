const weatherService = require('../src/services/weather.service');

const jsonResponse = (body, ok = true, status = 200) => ({ ok, status, json: async () => body });

describe('weather.service', () => {
  afterEach(() => {
    delete global.fetch;
  });

  it('geocodes the city then returns normalized current weather', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ results: [{ name: 'Mumbai', country: 'India', latitude: 19.07, longitude: 72.88 }] })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          current: {
            time: '2026-10-12T20:00',
            temperature_2m: 30.1,
            relative_humidity_2m: 70,
            wind_speed_10m: 12,
            weather_code: 2,
          },
          current_units: { temperature_2m: '°C', wind_speed_10m: 'km/h' },
        })
      );

    const result = await weatherService.getCurrentWeather('Mumbai');

    expect(result).toMatchObject({ city: 'Mumbai', temperature: 30.1, condition: 'Partly cloudy' });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('returns 404 when the city is unknown', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(jsonResponse({}));
    await expect(weatherService.getCurrentWeather('Nowhereville')).rejects.toMatchObject({ statusCode: 404 });
  });

  it('returns 502 when the provider answers with an error status', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce(jsonResponse({}, false, 500));
    await expect(weatherService.getCurrentWeather('Mumbai')).rejects.toMatchObject({ statusCode: 502 });
  });

  it('returns 502 when the network call fails', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('ECONNRESET'));
    await expect(weatherService.getCurrentWeather('Mumbai')).rejects.toMatchObject({ statusCode: 502 });
  });
});
