import { useState, useEffect } from 'react';
import type { Coordinates } from '../types/weather';

interface HistoricalState {
  temps: number[] | null;
  loading: boolean;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function useHistoricalWeather(coords: Coordinates | null): HistoricalState {
  const [state, setState] = useState<HistoricalState>({ temps: null, loading: false });

  useEffect(() => {
    if (!coords) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(yesterday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const endDate = formatDate(yesterday);
    const startDate = formatDate(sevenDaysAgo);

    setState({ temps: null, loading: true });

    fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${coords.latitude}&longitude=${coords.longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max&timezone=auto`,
    )
      .then(r => r.json())
      .then(json => {
        const temps: number[] = json?.daily?.temperature_2m_max ?? [];
        setState({ temps: temps.length > 0 ? temps : null, loading: false });
      })
      .catch(() => setState({ temps: null, loading: false }));
  }, [coords?.latitude, coords?.longitude]);

  return state;
}
