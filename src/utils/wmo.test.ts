import { describe, it, expect } from 'vitest';
import { getWmoInfo, getWeatherIconKey, getWeatherTheme } from './wmo';

describe('getWmoInfo', () => {
  it('returns correct label and icon for a known code', () => {
    expect(getWmoInfo(0)).toEqual({ label: 'Clear sky', icon: '☀️' });
    expect(getWmoInfo(3)).toEqual({ label: 'Overcast', icon: '☁️' });
    expect(getWmoInfo(95)).toEqual({ label: 'Thunderstorm', icon: '⛈️' });
  });

  it('returns Unknown fallback for an unrecognised code', () => {
    expect(getWmoInfo(999)).toEqual({ label: 'Unknown', icon: '🌡️' });
    expect(getWmoInfo(-1)).toEqual({ label: 'Unknown', icon: '🌡️' });
  });
});

describe('getWeatherIconKey', () => {
  it('maps code 0 to clear', () => expect(getWeatherIconKey(0)).toBe('clear'));
  it('maps code 1 to mainly-clear', () => expect(getWeatherIconKey(1)).toBe('mainly-clear'));
  it('maps code 2 to partly-cloudy', () => expect(getWeatherIconKey(2)).toBe('partly-cloudy'));
  it('maps code 3 to overcast', () => expect(getWeatherIconKey(3)).toBe('overcast'));
  it('maps fog codes to fog', () => {
    expect(getWeatherIconKey(45)).toBe('fog');
    expect(getWeatherIconKey(48)).toBe('fog');
  });
  it('maps drizzle codes (51–55) to drizzle', () => {
    expect(getWeatherIconKey(51)).toBe('drizzle');
    expect(getWeatherIconKey(55)).toBe('drizzle');
  });
  it('maps rain codes (61–65) to rain', () => {
    expect(getWeatherIconKey(61)).toBe('rain');
    expect(getWeatherIconKey(65)).toBe('rain');
  });
  it('maps snow codes (71–77) to snow', () => {
    expect(getWeatherIconKey(71)).toBe('snow');
    expect(getWeatherIconKey(77)).toBe('snow');
  });
  it('maps shower codes (80–82) to rain-showers', () => {
    expect(getWeatherIconKey(80)).toBe('rain-showers');
    expect(getWeatherIconKey(82)).toBe('rain-showers');
  });
  it('maps snow shower codes (85–86) to snow-showers', () => {
    expect(getWeatherIconKey(85)).toBe('snow-showers');
    expect(getWeatherIconKey(86)).toBe('snow-showers');
  });
  it('maps thunderstorm codes (95+) to thunderstorm', () => {
    expect(getWeatherIconKey(95)).toBe('thunderstorm');
    expect(getWeatherIconKey(99)).toBe('thunderstorm');
  });
});

describe('getWeatherTheme', () => {
  it('returns a sunny blue theme for clear codes', () => {
    const theme = getWeatherTheme(0);
    expect(theme.gradient).toContain('#0ea5e9');
    expect(theme.overlayClass).toBe('weather-sunny');
  });

  it('returns a dark grey theme for overcast', () => {
    const theme = getWeatherTheme(3);
    expect(theme.gradient).toContain('#334155');
    expect(theme.overlayClass).toBe('');
  });

  it('returns a rain theme for drizzle codes', () => {
    const theme = getWeatherTheme(51);
    expect(theme.overlayClass).toBe('weather-rain');
  });

  it('returns a snow theme for snow codes', () => {
    const theme = getWeatherTheme(73);
    expect(theme.overlayClass).toBe('weather-snow');
  });

  it('returns a thunderstorm theme for codes >= 95', () => {
    const theme = getWeatherTheme(95);
    expect(theme.overlayClass).toBe('weather-thunder');
  });

  it('returns a default theme for unknown codes', () => {
    const theme = getWeatherTheme(-1);
    expect(theme.gradient).toBeTruthy();
  });
});
