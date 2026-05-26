interface Props {
  temps: number[];
  unit: 'F' | 'C';
}

function toF(c: number) {
  return c * 9 / 5 + 32;
}

function smoothPath(pts: { x: number; y: number }[]): string {
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

const W = 60;
const H = 24;
const PAD_X = 2;
const PAD_Y = 3;

export function Sparkline({ temps, unit }: Props) {
  if (temps.length < 2) return null;

  const values = unit === 'F' ? temps.map(toF) : temps;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const spread = Math.max(maxV - minV, 1);

  const n = values.length;
  const xStep = (W - PAD_X * 2) / (n - 1);
  const toX = (i: number) => PAD_X + i * xStep;
  const toY = (v: number) => PAD_Y + (H - PAD_Y * 2) - ((v - minV) / spread) * (H - PAD_Y * 2);

  const pts = values.map((v, i) => ({ x: toX(i), y: toY(v) }));
  const line = smoothPath(pts);
  const area = `${line} L ${pts[n - 1].x.toFixed(1)} ${H} L ${pts[0].x.toFixed(1)} ${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-6 mt-2"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`spGrad-${temps[0]}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spGrad-${temps[0]})`} />
      <path
        d={line}
        fill="none"
        stroke="white"
        strokeWidth={1.5}
        strokeOpacity={0.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
