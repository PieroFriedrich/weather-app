import type { GeocodingResult } from '../types/weather';

interface GeoResponse {
  results?: GeocodingResult[];
}

export async function searchCity(name: string): Promise<GeocodingResult[]> {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(name)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding fetch failed');
  const data: GeoResponse = await res.json();
  return data.results ?? [];
}
