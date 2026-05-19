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

  const allLows  = forecast.map(d => unit === 'C' ? toC(d.tempMin) : d.tempMin);
  const allHighs = forecast.map(d => unit === 'C' ? toC(d.tempMax) : d.tempMax);
  const weekMin  = Math.min(...allLows);
  const weekMax  = Math.max(...allHighs);
  const weekSpread = weekMax - weekMin || 1;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 min-[850px]:flex-1 flex flex-col justify-between">
      {forecast.map((day) => {
        const high = unit === 'C' ? toC(day.tempMax) : day.tempMax;
        const low  = unit === 'C' ? toC(day.tempMin) : day.tempMin;
        const barStart = (low - weekMin) / weekSpread;
        const barEnd   = (high - weekMin) / weekSpread;
        return (
          <div key={day.date} className="flex items-center gap-2 sm:gap-3">
            <span className="text-white/60 text-xs sm:text-sm w-10 sm:w-12">{dayLabel(day.date)}</span>
            <span className="text-base sm:text-xl leading-none">{getWmoInfo(day.weatherCode).icon}</span>
            <span className="text-white/50 text-xs sm:text-sm w-7 sm:w-9 text-right">{low}°</span>
            <div className="flex-1 relative h-1.5 sm:h-2 rounded-full bg-white/10">
              <div
                className="absolute top-0 h-full rounded-full"
                style={{
                  left: `${barStart * 100}%`,
                  width: `${(barEnd - barStart) * 100}%`,
                  background: 'linear-gradient(to right, #60a5fa, #fb923c)',
                }}
              />
            </div>
            <span className="text-white text-sm sm:text-base font-semibold w-7 sm:w-9">{high}°</span>
          </div>
        );
      })}
    </div>
  );
}
