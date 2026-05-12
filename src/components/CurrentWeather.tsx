import type { CurrentWeather as WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface Props {
  data: WeatherData;
  cityName: string;
}

export function CurrentWeather({ data, cityName }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full max-w-sm text-white">
      <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-1">{cityName}</p>
      <div className="text-8xl font-thin mb-6">{data.temperature}°F</div>
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
