import type { HourlyPoint } from '../types/weather';

const PAD_TOP = 22;
const PAD_BOTTOM = 28;
const PAD_H = 8;
const W = 600;
const H = 110;
const PLOT_W = W - PAD_H * 2;
const PLOT_H = H - PAD_TOP - PAD_BOTTOM;
const BOTTOM_Y = PAD_TOP + PLOT_H;

function formatHour(time: string) {
  const h = parseInt(time.slice(11, 13));
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  return h < 12 ? `${h}am` : `${h - 12}pm`;
}

export function PrecipChart({ hourly }: { hourly: HourlyPoint[] }) {
  if (hourly.length === 0) return null;

  const n = hourly.length;
  const xStep = PLOT_W / (n - 1);
  const toX = (i: number) => PAD_H + i * xStep;
  const barW = xStep * 0.65;

  const labelIdxs = Array.from({ length: n }, (_, i) => i).filter(i => i % 4 === 0);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl px-4 pt-4 pb-3 shadow-2xl w-full">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Precipitation chance</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" aria-hidden="true">
        <defs>
          <linearGradient id="pcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {hourly.map((h, i) => {
          const barH = h.precipitationProbability > 0
            ? Math.max((h.precipitationProbability / 100) * PLOT_H, 3)
            : 0;
          return barH > 0 ? (
            <rect
              key={i}
              x={toX(i) - barW / 2}
              y={BOTTOM_Y - barH}
              width={barW}
              height={barH}
              fill="url(#pcGrad)"
              rx={3}
            />
          ) : null;
        })}

        {labelIdxs.map(i => {
          const prob = hourly[i].precipitationProbability;
          const barH = (prob / 100) * PLOT_H;
          const labelY = Math.max(PAD_TOP + 12, BOTTOM_Y - barH - 6);
          return (
            <g key={i}>
              {prob >= 5 && (
                <text
                  x={toX(i)}
                  y={labelY}
                  textAnchor="middle"
                  fill="white"
                  fillOpacity={0.85}
                  fontSize={11}
                  fontWeight="500"
                >
                  {prob}%
                </text>
              )}
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
          );
        })}
      </svg>
    </div>
  );
}
