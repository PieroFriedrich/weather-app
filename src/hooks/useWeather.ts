import { useState, useEffect } from 'react';
import type { Coordinates, CurrentWeather, DailyForecast, HourlyPoint } from '../types/weather';
import { fetchWeather } from '../services/weather';

interface WeatherState {
  data: CurrentWeather | null;
  forecast: DailyForecast[];
  hourly: HourlyPoint[];
  error: string | null;
  loading: boolean;
}

export function useWeather(coords: Coordinates | null): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    forecast: [],
    hourly: [],
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (!coords) return;
    setState({ data: null, forecast: [], hourly: [], error: null, loading: true });
    fetchWeather(coords)
      .then(({ current, forecast, hourly }) =>
        setState({ data: current, forecast, hourly, error: null, loading: false }),
      )
      .catch(() =>
        setState({ data: null, forecast: [], hourly: [], error: 'Could not load weather data', loading: false }),
      );
  }, [coords?.latitude, coords?.longitude]);

  return state;
}
