import type { DailyForecast } from '../types/weather';
import { getWmoInfo } from '../utils/wmo';

interface Props {
  forecast: DailyForecast[];
  unit: 'F' | 'C';
}

function toC(f: number) {
  return Math.round((f - 32) * 5 / 9);
}

function dayLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const today = new Date(Date.now());
  if (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  ) {
    return 'Today';
  }
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function ForecastStrip({ forecast, unit }: Props) {
  if (!forecast.length) return null;

  return (
    <div className="w-full max-w-sm flex gap-2 overflow-x-auto pb-1">
      {forecast.map((day) => {
        const high = unit === 'C' ? toC(day.tempMax) : day.tempMax;
        const low  = unit === 'C' ? toC(day.tempMin) : day.tempMin;
        return (
          <div
            key={day.date}
            className="flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center gap-1 min-w-[60px]"
          >
            <span className="text-white/60 text-xs">{dayLabel(day.date)}</span>
            <span className="text-lg leading-none">{getWmoInfo(day.weatherCode).icon}</span>
            <span className="text-white text-sm font-semibold">{high}°</span>
            <span className="text-white/50 text-xs">{low}°</span>
          </div>
        );
      })}
    </div>
  );
}
