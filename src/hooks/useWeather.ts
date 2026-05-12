import { useState, useEffect } from 'react';
import type { Coordinates, CurrentWeather } from '../types/weather';
import { fetchWeather } from '../services/weather';

interface WeatherState {
  data: CurrentWeather | null;
  error: string | null;
  loading: boolean;
}

export function useWeather(coords: Coordinates | null): WeatherState {
  const [state, setState] = useState<WeatherState>({
    data: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (!coords) return;
    setState({ data: null, error: null, loading: true });
    fetchWeather(coords)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch(() => setState({ data: null, error: 'Could not load weather data', loading: false }));
  }, [coords?.latitude, coords?.longitude]);

  return state;
}
