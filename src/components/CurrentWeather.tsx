import type { CurrentWeather as WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface Props {
  data: WeatherData;
  cityName: string;
  unit: 'F' | 'C';
  onToggleUnit: () => void;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}

export function CurrentWeather({ data, cityName, unit, onToggleUnit, isSaved, onSave, onUnsave }: Props) {
  const displayTemp = unit === 'F'
    ? data.temperature
    : Math.round((data.temperature - 32) * 5 / 9);

  const displayFeelsLike = unit === 'F'
    ? data.feelsLike
    : Math.round((data.feelsLike - 32) * 5 / 9);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full max-w-sm text-white">
      <div className="flex items-center justify-between mb-1">
        <p className="text-white/60 text-sm font-medium uppercase tracking-widest">{cityName}</p>
        <button
          type="button"
          onClick={isSaved ? onUnsave : onSave}
          aria-label={isSaved ? 'Remove from saved locations' : 'Save this location'}
          className="text-white/50 hover:text-white transition-colors focus:outline-none"
        >
          {isSaved ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-8xl font-thin">{displayTemp}°{unit}</div>
          <p className="text-white/50 text-sm mt-1">Feels like {displayFeelsLike}°{unit}</p>
        </div>
        <button
          type="button"
          onClick={onToggleUnit}
          className="mt-2 flex bg-white/10 rounded-xl overflow-hidden text-sm font-medium"
          aria-label="Toggle temperature unit"
        >
          <span className={`px-3 py-1.5 transition-colors ${unit === 'F' ? 'bg-white/20 text-white' : 'text-white/40'}`}>°F</span>
          <span className={`px-3 py-1.5 transition-colors ${unit === 'C' ? 'bg-white/20 text-white' : 'text-white/40'}`}>°C</span>
        </button>
      </div>

      <WeatherIcon code={data.weatherCode} />
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Humidity</p>
          <p className="text-2xl font-light">{data.humidity}%</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Wind</p>
          <p className="text-2xl font-light">{data.windSpeed} mph</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Rain</p>
          <p className="text-2xl font-light">{data.precipitationProbability}%</p>
        </div>
      </div>
    </div>
  );
}
