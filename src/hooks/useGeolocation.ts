import { useState, useEffect } from 'react';
import type { Coordinates } from '../types/weather';

interface GeolocationState {
  coords: Coordinates | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ coords: null, error: 'Geolocation not supported', loading: false });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      () => {
        setState({ coords: null, error: 'Location access denied', loading: false });
      }
    );
  }, []);

  return state;
}
