interface WmoInfo {
  label: string;
  icon: string;
}

export const wmoMap: Record<number, WmoInfo> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Icy fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy drizzle', icon: '🌦️' },
  61: { label: 'Light rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '🌨️' },
  75: { label: 'Heavy snow', icon: '🌨️' },
  77: { label: 'Snow grains', icon: '🌨️' },
  80: { label: 'Light showers', icon: '🌦️' },
  81: { label: 'Showers', icon: '🌦️' },
  82: { label: 'Heavy showers', icon: '🌦️' },
  85: { label: 'Snow showers', icon: '🌨️' },
  86: { label: 'Heavy snow showers', icon: '🌨️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Thunderstorm', icon: '⛈️' },
};

export function getWmoInfo(code: number): WmoInfo {
  return wmoMap[code] ?? { label: 'Unknown', icon: '🌡️' };
}

export interface WeatherTheme {
  gradient: string;
  overlayClass: string;
}

export function getWeatherTheme(code: number): WeatherTheme {
  if (code === 0 || code === 1)
    return {
      gradient: 'linear-gradient(to bottom right, #0369a1, #0ea5e9, #38bdf8)',
      overlayClass: 'weather-sunny',
    };
  if (code === 2 || code === 3)
    return {
      gradient: 'linear-gradient(to bottom right, #334155, #475569, #1e293b)',
      overlayClass: '',
    };
  if (code === 45 || code === 48)
    return {
      gradient: 'linear-gradient(to bottom right, #374151, #6b7280, #4b5563)',
      overlayClass: 'weather-fog',
    };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))
    return {
      gradient: 'linear-gradient(to bottom right, #0c1a2e, #1e3a5f, #1d4ed8)',
      overlayClass: 'weather-rain',
    };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return {
      gradient: 'linear-gradient(to bottom right, #1e3a5f, #2563eb, #60a5fa)',
      overlayClass: 'weather-snow',
    };
  if (code >= 95)
    return {
      gradient: 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #4c1d95)',
      overlayClass: 'weather-thunder',
    };
  return {
    gradient: 'linear-gradient(to bottom right, #0c4a6e, #1e40af, #312e81)',
    overlayClass: '',
  };
}
