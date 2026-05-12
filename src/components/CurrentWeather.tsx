import type { CurrentWeather as WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface Props {
  data: WeatherData;
  cityName: string;
  unit: 'F' | 'C';
  onToggleUnit: () => void;
}

export function CurrentWeather({ data, cityName, unit, onToggleUnit }: Props) {
  const displayTemp = unit === 'F'
    ? data.temperature
    : Math.round((data.temperature - 32) * 5 / 9);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full max-w-sm text-white">
      <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-1">{cityName}</p>

      <div className="flex items-start justify-between mb-6">
        <div className="text-8xl font-thin">{displayTemp}°{unit}</div>
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
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Humidity</p>
          <p className="text-2xl font-light">{data.humidity}%</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Wind</p>
          <p className="text-2xl font-light">{data.windSpeed} mph</p>
        </div>
      </div>
    </div>
  );
}
