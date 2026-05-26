import type { Coordinates } from '../types/weather';

export interface AirQualityData {
  aqi: number;
}

export async function fetchAirQuality(coords: Coordinates): Promise<AirQualityData> {
  const { latitude, longitude } = coords;
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${latitude}&longitude=${longitude}` +
    `&current=european_aqi`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Air quality fetch failed');

  const data = await res.json();
  return { aqi: Math.round(data.current.european_aqi) };
}
