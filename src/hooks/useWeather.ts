import { useState, useEffect } from 'react';
import type { Coordinates, CurrentWeather, DailyForecast } from '../types/weather';
import { fetchWeather } from '../services/weather';

interface WeatherState {
  data: CurrentWeather | null;
  forecast: DailyForecast[];
  error: string | null;
  loading: boolean;
}

export function useWeather(coords: Coordinates | null): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    forecast: [],
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (!coords) return;
    setState({ data: null, forecast: [], error: null, loading: true });
    fetchWeather(coords)
      .then(({ current, forecast }) =>
        setState({ data: current, forecast, error: null, loading: false }),
      )
      .catch(() =>
        setState({ data: null, forecast: [], error: 'Could not load weather data', loading: false }),
      );
  }, [coords?.latitude, coords?.longitude]);

  return state;
}
