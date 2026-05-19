import { useWeather } from '../hooks/useWeather';
import { getWeatherTheme } from '../utils/wmo';
import type { SavedLocation } from '../types/weather';

interface Props {
  location: SavedLocation;
  isActive: boolean;
  unit: 'F' | 'C';
  onSelect: () => void;
  onRemove: () => void;
}

function toC(f: number) {
  return Math.round((f - 32) * 5 / 9);
}

export function SavedLocationCard({ location, isActive, unit, onSelect, onRemove }: Props) {
  const weather = useWeather(location.coords);
  const theme = getWeatherTheme(weather.data?.weatherCode ?? -1);

  const current = weather.data
    ? (unit === 'C' ? toC(weather.data.temperature) : weather.data.temperature)
    : null;
  const low = weather.forecast[0]
    ? (unit === 'C' ? toC(weather.forecast[0].tempMin) : weather.forecast[0].tempMin)
    : null;
  const high = weather.forecast[0]
    ? (unit === 'C' ? toC(weather.forecast[0].tempMax) : weather.forecast[0].tempMax)
    : null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all ring-2 ${
        isActive ? 'ring-white/80' : 'ring-white/20 hover:ring-white/50'
      }`}
      style={{ background: theme.gradient }}
      onClick={onSelect}
    >
      {theme.overlayClass && (
        <div className={`absolute inset-0 pointer-events-none ${theme.overlayClass}`} aria-hidden="true" />
      )}
      <div className="relative p-3">
        <div className="flex items-start justify-between gap-1">
          <p className="text-white text-xs font-medium leading-tight truncate">{location.name}</p>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onRemove(); }}
            className="text-white/40 hover:text-white/80 transition-colors shrink-0 text-xs leading-none focus:outline-none"
            aria-label={`Remove ${location.name}`}
          >
            ✕
          </button>
        </div>
        {weather.loading && (
          <p className="text-white/50 text-2xl font-light mt-1 animate-pulse">—</p>
        )}
        {current !== null && (
          <>
            <p className="text-white text-2xl font-light mt-1">{current}°</p>
            {low !== null && high !== null && (
              <p className="text-white/70 text-xs">{low}° / {high}°</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
