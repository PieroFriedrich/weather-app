export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  precipitationProbability: number;
  feelsLike: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  precipitationProbability: number;
}

export interface SavedLocation {
  id: string;
  name: string;
  coords: Coordinates;
}
