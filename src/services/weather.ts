import type { Coordinates, CurrentWeather, DailyForecast } from '../types/weather';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export async function fetchWeather(
  coords: Coordinates,
): Promise<{ current: CurrentWeather; forecast: DailyForecast[] }> {
  const { latitude, longitude } = coords;
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  const data: OpenMeteoResponse = await res.json();

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    precipitationProbability: data.daily.precipitation_probability_max[0] ?? 0,
  };

  const forecast: DailyForecast[] = data.daily.time.map((date, i) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
  }));

  return { current, forecast };
}
