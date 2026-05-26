import { useState, useEffect } from 'react';
import type { Coordinates } from '../types/weather';
import { fetchAirQuality } from '../services/airQuality';

interface AirQualityState {
  aqi: number | null;
  loading: boolean;
  error: string | null;
}

export function useAirQuality(coords: Coordinates | null): AirQualityState {
  const [state, setState] = useState<AirQualityState>({
    aqi: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!coords) return;
    setState({ aqi: null, loading: true, error: null });
    fetchAirQuality(coords)
      .then(({ aqi }) => setState({ aqi, loading: false, error: null }))
      .catch(() => setState({ aqi: null, loading: false, error: 'Could not load air quality' }));
  }, [coords?.latitude, coords?.longitude]);

  return state;
}
