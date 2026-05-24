import type { ComponentType } from 'react';
import { getWmoInfo, getWeatherIconKey, type WeatherIconKey } from '../utils/wmo';
import {
  SunIcon,
  MainlyClearIcon,
  PartlyCloudyIcon,
  OvercastIcon,
  FogIcon,
  DrizzleIcon,
  RainIcon,
  SnowIcon,
  RainShowersIcon,
  SnowShowersIcon,
  ThunderstormIcon,
} from './WeatherIcons';

const iconMap: Record<WeatherIconKey, ComponentType> = {
  'clear':          SunIcon,
  'mainly-clear':   MainlyClearIcon,
  'partly-cloudy':  PartlyCloudyIcon,
  'overcast':       OvercastIcon,
  'fog':            FogIcon,
  'drizzle':        DrizzleIcon,
  'rain':           RainIcon,
  'snow':           SnowIcon,
  'rain-showers':   RainShowersIcon,
  'snow-showers':   SnowShowersIcon,
  'thunderstorm':   ThunderstormIcon,
};

interface Props {
  code: number;
  size?: 'sm' | 'lg';
  showLabel?: boolean;
}

export function WeatherIcon({ code, size = 'lg', showLabel = true }: Props) {
  const { label } = getWmoInfo(code);
  const Icon = iconMap[getWeatherIconKey(code)];
  const sizeClass = size === 'lg' ? 'w-16 h-16' : 'w-8 h-8';
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={sizeClass} aria-label={label} role="img">
        <Icon />
      </div>
      {showLabel && (
        <span className={`text-white/70 ${size === 'lg' ? 'text-base' : 'text-xs'}`}>
          {label}
        </span>
      )}
    </div>
  );
}
