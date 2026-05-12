import type { GeocodingResult } from '../types/weather';

interface GeoResponse {
  results?: GeocodingResult[];
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  if (!res.ok) return '';
  const data = await res.json();
  const place = data.address?.city ?? data.address?.town ?? data.address?.village ?? '';
  const state = data.address?.state ?? '';
  return state ? `${place}, ${state}` : place;
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
