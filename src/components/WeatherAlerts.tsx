import { useState } from 'react';
import type { CurrentWeather, DailyForecast, HourlyPoint } from '../types/weather';

interface Props {
  current: CurrentWeather;
  forecast: DailyForecast[];
  hourly: HourlyPoint[];
  unit: 'F' | 'C';
}

interface Alert {
  id: string;
  icon: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

function fToC(f: number) {
  return Math.round((f - 32) * (5 / 9));
}

function mphToKmh(mph: number) {
  return Math.round(mph * 1.60934);
}

function formatHour(isoTime: string): string {
  const hour = parseInt(isoTime.slice(11, 13), 10);
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function buildAlerts(
  current: CurrentWeather,
  forecast: DailyForecast[],
  hourly: HourlyPoint[],
  unit: 'F' | 'C',
): Alert[] {
  const alerts: Alert[] = [];
  const today = forecast[0];
  const isC = unit === 'C';

  // Rain soon (next 6 hours, skip the current hour at index 0)
  const rainHour = hourly.slice(1, 7).find((h) => h.precipitationProbability >= 60);
  if (rainHour) {
    alerts.push({
      id: 'rain',
      icon: '🌧',
      message: `${rainHour.precipitationProbability}% chance of rain at ${formatHour(rainHour.time)} — grab an umbrella`,
      severity: 'warning',
    });
  }

  // Thunderstorm now
  if (current.weatherCode >= 95 && current.weatherCode <= 99) {
    alerts.push({
      id: 'thunderstorm',
      icon: '⛈',
      message: 'Thunderstorm in progress — stay indoors',
      severity: 'critical',
    });
  }

  // Fog
  if (current.weatherCode === 45 || current.weatherCode === 48) {
    alerts.push({
      id: 'fog',
      icon: '🌫',
      message: 'Dense fog — drive with caution',
      severity: 'warning',
    });
  }

  // Snow today
  if (today && today.weatherCode >= 71 && today.weatherCode <= 77) {
    alerts.push({
      id: 'snow',
      icon: '❄️',
      message: 'Snow expected today — dress warmly',
      severity: 'warning',
    });
  }

  // Extreme UV
  if (today && today.uvIndexMax > 8) {
    alerts.push({
      id: 'uv',
      icon: '☀️',
      message: `UV is extreme today (${today.uvIndexMax}) — apply SPF 50+`,
      severity: 'info',
    });
  }

  // High winds
  if (current.windSpeed > 25) {
    const speed = isC
      ? `${mphToKmh(current.windSpeed)} km/h`
      : `${current.windSpeed} mph`;
    alerts.push({
      id: 'wind',
      icon: '💨',
      message: `Strong winds (${speed}) — secure loose items`,
      severity: 'info',
    });
  }

  // Extreme heat
  if (today && today.tempMax > 95) {
    const temp = isC ? `${fToC(today.tempMax)}°C` : `${today.tempMax}°F`;
    alerts.push({
      id: 'heat',
      icon: '🌡',
      message: `Extreme heat today (${temp}) — stay hydrated`,
      severity: 'critical',
    });
  }

  // Freezing overnight
  if (today && today.tempMin < 32) {
    const temp = isC ? `${fToC(today.tempMin)}°C` : `${today.tempMin}°F`;
    alerts.push({
      id: 'freeze',
      icon: '🧊',
      message: `Freezing temps tonight (${temp}) — watch for ice`,
      severity: 'warning',
    });
  }

  return alerts;
}

const SEVERITY_STYLES: Record<Alert['severity'], string> = {
  info: 'border-sky-400/40 bg-sky-400/10',
  warning: 'border-amber-400/40 bg-amber-400/10',
  critical: 'border-red-400/40 bg-red-400/10',
};

export function WeatherAlerts({ current, forecast, hourly, unit }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const alerts = buildAlerts(current, forecast, hourly, unit).filter(
    (a) => !dismissed.has(a.id),
  );

  if (alerts.length === 0) return null;

  function dismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]));
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border text-white text-sm ${SEVERITY_STYLES[alert.severity]}`}
        >
          <span aria-hidden="true">{alert.icon}</span>
          <span>{alert.message}</span>
          <button
            onClick={() => dismiss(alert.id)}
            className="ml-1 text-white/40 hover:text-white/80 transition-colors text-lg leading-none"
            aria-label={`Dismiss alert: ${alert.message}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
