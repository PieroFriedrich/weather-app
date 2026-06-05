import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWeather } from './weather';

const COORDS = { latitude: 51.5, longitude: -0.12 };

function makeResponse(overrides: Partial<Parameters<typeof buildMeteoResponse>[0]> = {}) {
  return buildMeteoResponse({ ...defaults, ...overrides });
}

const defaults = {
  currentTime: '2024-06-04T14:00',
  temperature: 72.6,
  feelsLike: 70.1,
  humidity: 55,
  windSpeed: 12.4,
  windDir: 180.7,
  weatherCode: 1,
  sunrise: '2024-06-04T05:30',
  sunset: '2024-06-04T21:15',
  precipMax: 20,
};

function buildMeteoResponse(d: typeof defaults) {
  return {
    current: {
      time: d.currentTime,
      temperature_2m: d.temperature,
      apparent_temperature: d.feelsLike,
      relative_humidity_2m: d.humidity,
      wind_speed_10m: d.windSpeed,
      wind_direction_10m: d.windDir,
      weather_code: d.weatherCode,
    },
    hourly: {
      time: Array.from({ length: 168 }, (_, i) => {
        const h = String(Math.floor(i / 7) % 24).padStart(2, '0');
        return `2024-06-04T${h}:00`;
      }),
      temperature_2m: Array(168).fill(70),
      precipitation_probability: Array(168).fill(10),
    },
    daily: {
      time: ['2024-06-04', '2024-06-05', '2024-06-06'],
      weather_code: [1, 2, 3],
      temperature_2m_max: [75.6, 72.1, 68.9],
      temperature_2m_min: [60.3, 58.7, 55.2],
      precipitation_probability_max: [d.precipMax, 30, 50],
      sunrise: [d.sunrise, '2024-06-05T05:31', '2024-06-06T05:32'],
      sunset: [d.sunset, '2024-06-05T21:14', '2024-06-06T21:13'],
      uv_index_max: [6.4, 5.2, 4.8],
    },
  };
}

function mockFetch(data: unknown, ok = true) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    json: () => Promise.resolve(data),
  } as Response);
}

beforeEach(() => vi.restoreAllMocks());

describe('fetchWeather', () => {
  it('throws on non-ok HTTP response', async () => {
    mockFetch({}, false);
    await expect(fetchWeather(COORDS)).rejects.toThrow('Weather fetch failed');
  });

  it('rounds temperature, feelsLike, and windSpeed', async () => {
    mockFetch(makeResponse());
    const { current } = await fetchWeather(COORDS);
    expect(current.temperature).toBe(73);
    expect(current.feelsLike).toBe(70);
    expect(current.windSpeed).toBe(12);
  });

  it('formats sunrise as 12-hour time (AM)', async () => {
    mockFetch(makeResponse({ sunrise: '2024-06-04T05:30' }));
    const { current } = await fetchWeather(COORDS);
    expect(current.sunrise).toBe('5:30 AM');
  });

  it('formats sunset as 12-hour time (PM)', async () => {
    mockFetch(makeResponse({ sunset: '2024-06-04T21:15' }));
    const { current } = await fetchWeather(COORDS);
    expect(current.sunset).toBe('9:15 PM');
  });

  it('formats noon correctly (12:00 PM)', async () => {
    mockFetch(makeResponse({ sunrise: '2024-06-04T12:00' }));
    const { current } = await fetchWeather(COORDS);
    expect(current.sunrise).toBe('12:00 PM');
  });

  it('formats midnight correctly (12:00 AM)', async () => {
    mockFetch(makeResponse({ sunrise: '2024-06-04T00:00' }));
    const { current } = await fetchWeather(COORDS);
    expect(current.sunrise).toBe('12:00 AM');
  });

  it('returns precipitationProbability from daily max', async () => {
    mockFetch(makeResponse({ precipMax: 40 }));
    const { current } = await fetchWeather(COORDS);
    expect(current.precipitationProbability).toBe(40);
  });

  it('returns a forecast array matching daily data length', async () => {
    mockFetch(makeResponse());
    const { forecast } = await fetchWeather(COORDS);
    expect(forecast).toHaveLength(3);
    expect(forecast[0].tempMax).toBe(76);
    expect(forecast[0].tempMin).toBe(60);
    expect(forecast[0].uvIndexMax).toBe(6);
  });

  it('slices hourly data starting at current hour', async () => {
    mockFetch(makeResponse({ currentTime: '2024-06-04T14:00' }));
    const { hourly } = await fetchWeather(COORDS);
    expect(hourly).toHaveLength(24);
    expect(hourly[0].time).toContain('T14:00');
  });
});
