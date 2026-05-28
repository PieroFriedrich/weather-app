import { useState, useEffect } from 'react';
import type { Coordinates } from '../types/weather';

interface YearAgoState {
  avgTemp: number | null;
  loading: boolean;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function useYearAgoWeather(coords: Coordinates | null): YearAgoState {
  const [state, setState] = useState<YearAgoState>({ avgTemp: null, loading: false });

  useEffect(() => {
    if (!coords) return;

    const anchor = new Date();
    anchor.setFullYear(anchor.getFullYear() - 1);

    const start = new Date(anchor);
    start.setDate(start.getDate() - 3);
    const end = new Date(anchor);
    end.setDate(end.getDate() + 3);

    setState({ avgTemp: null, loading: true });

    fetch(
      `https://archive-api.open-meteo.com/v1/archive` +
      `?latitude=${coords.latitude}&longitude=${coords.longitude}` +
      `&start_date=${formatDate(start)}&end_date=${formatDate(end)}` +
      `&daily=temperature_2m_max&temperature_unit=fahrenheit&timezone=auto`,
    )
      .then(r => r.json())
      .then(json => {
        const temps: number[] = json?.daily?.temperature_2m_max ?? [];
        if (temps.length === 0) {
          setState({ avgTemp: null, loading: false });
          return;
        }
        const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
        setState({ avgTemp: Math.round(avg), loading: false });
      })
      .catch(() => setState({ avgTemp: null, loading: false }));
  }, [coords?.latitude, coords?.longitude]);

  return state;
}
