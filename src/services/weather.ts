import type { Coordinates, CurrentWeather, DailyForecast, HourlyPoint } from '../types/weather';

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
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
): Promise<{ current: CurrentWeather; forecast: DailyForecast[]; hourly: HourlyPoint[] }> {
  const { latitude, longitude } = coords;
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&hourly=temperature_2m,precipitation_probability` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  const data: OpenMeteoResponse = await res.json();

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
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

  const currentHour = data.current.time.slice(0, 13) + ':00';
  const startIdx = data.hourly.time.indexOf(currentHour);
  const slice = startIdx >= 0 ? startIdx : 0;
  const hourly: HourlyPoint[] = data.hourly.time.slice(slice, slice + 24).map((time, i) => ({
    time,
    temperature: Math.round(data.hourly.temperature_2m[slice + i]),
    precipitationProbability: data.hourly.precipitation_probability[slice + i] ?? 0,
  }));

  return { current, forecast, hourly };
}
