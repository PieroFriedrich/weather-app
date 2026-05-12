import { getWmoInfo } from '../utils/wmo';

interface Props {
  code: number;
  size?: 'sm' | 'lg';
}

export function WeatherIcon({ code, size = 'lg' }: Props) {
  const { label, icon } = getWmoInfo(code);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={size === 'lg' ? 'text-7xl' : 'text-3xl'}>{icon}</span>
      <span className={`text-white/70 ${size === 'lg' ? 'text-base' : 'text-xs'}`}>{label}</span>
    </div>
  );
}
