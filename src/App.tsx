import { useState } from 'react';
import type { Coordinates, GeocodingResult } from './types/weather';
import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { CurrentWeather } from './components/CurrentWeather';
import { SearchBar } from './components/SearchBar';

export default function App() {
  const geo = useGeolocation();
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [cityName, setCityName] = useState('');

  const activeCoords = coords ?? geo.coords;
  const activeCityName = coords ? cityName : 'Your location';
  const weather = useWeather(activeCoords);

  function handleSelect(result: GeocodingResult) {
    setCoords({ latitude: result.latitude, longitude: result.longitude });
    setCityName(result.admin1 ? `${result.name}, ${result.admin1}` : result.name);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center px-4 gap-6">
      <h1 className="text-3xl font-light text-white tracking-widest">Weather</h1>

      <SearchBar onSelect={handleSelect} />

      {geo.loading && !coords && (
        <p className="text-white/50 text-sm animate-pulse">Detecting your location…</p>
      )}

      {geo.error && !coords && !weather.data && !weather.loading && (
        <p className="text-white/50 text-sm">{geo.error} — search for a city above</p>
      )}

      {weather.loading && (
        <p className="text-white/50 text-sm animate-pulse">Loading weather…</p>
      )}

      {weather.error && (
        <p className="text-red-300 text-sm">{weather.error}</p>
      )}

      {weather.data && !weather.loading && (
        <CurrentWeather data={weather.data} cityName={activeCityName} />
      )}
    </div>
  );
}
