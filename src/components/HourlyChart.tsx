import type { HourlyPoint } from '../types/weather';

interface Props {
  hourly: HourlyPoint[];
  unit: 'F' | 'C';
}

const PAD_TOP = 22;
const PAD_BOTTOM = 28;
const PAD_H = 8;
const W = 600;
const H = 110;
const PLOT_W = W - PAD_H * 2;
const PLOT_H = H - PAD_TOP - PAD_BOTTOM;
const BOTTOM_Y = PAD_TOP + PLOT_H;

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
  }
  return d.join(' ');
}

function formatHour(time: string) {
  const h = parseInt(time.slice(11, 13));
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

export function HourlyChart({ hourly, unit }: Props) {
  if (hourly.length === 0) return null;

  const temps = hourly.map(h =>
    unit === 'F' ? h.temperature : Math.round((h.temperature - 32) * 5 / 9),
  );

  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const spread = Math.max(maxTemp - minTemp, 4);
  const yPad = spread * 0.15;

  const n = hourly.length;
  const xStep = PLOT_W / (n - 1);
  const toX = (i: number) => PAD_H + i * xStep;
  const toY = (t: number) =>
    PAD_TOP + PLOT_H - ((t - (minTemp - yPad)) / (spread + yPad * 2)) * PLOT_H;

  const pts = temps.map((t, i) => ({ x: toX(i), y: toY(t) }));
  const line = smoothPath(pts);
  const area = `${line} L ${pts[n - 1].x.toFixed(1)} ${BOTTOM_Y} L ${pts[0].x.toFixed(1)} ${BOTTOM_Y} Z`;

  // label every 4 hours, always include first
  const labelIdxs = Array.from({ length: n }, (_, i) => i).filter(i => i % 4 === 0);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl px-4 pt-4 pb-3 shadow-2xl w-full">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Next 24 hours</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-hidden="true">
        <defs>
          <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* precipitation probability bars */}
        {hourly.map((h, i) => {
          const barH = (h.precipitationProbability / 100) * (PLOT_H * 0.45);
          return (
            <rect
              key={i}
              x={toX(i) - xStep * 0.35}
              y={BOTTOM_Y - barH}
              width={xStep * 0.7}
              height={barH}
              fill="white"
              fillOpacity={0.12}
              rx={2}
            />
          );
        })}

        {/* area fill under temperature line */}
        <path d={area} fill="url(#hcGrad)" />

        {/* temperature line */}
        <path
          d={line}
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeOpacity={0.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* dots + labels at key hours */}
        {labelIdxs.map(i => (
          <g key={i}>
            <circle cx={pts[i].x} cy={pts[i].y} r={3} fill="white" fillOpacity={0.9} />
            <text
              x={toX(i)}
              y={pts[i].y - 7}
              textAnchor="middle"
              fill="white"
              fillOpacity={0.85}
              fontSize={11}
              fontWeight="500"
            >
              {temps[i]}°
            </text>
            <text
              x={toX(i)}
              y={BOTTOM_Y + 16}
              textAnchor="middle"
              fill="white"
              fillOpacity={0.45}
              fontSize={11}
            >
              {formatHour(hourly[i].time)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
