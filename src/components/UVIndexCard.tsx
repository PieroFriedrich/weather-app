interface UVLevel {
  max: number;
  label: string;
  tip: string;
  color: string;
}

const LEVELS: UVLevel[] = [
  { max: 2,        label: 'Low',       tip: 'No protection needed',          color: '#4ade80' },
  { max: 5,        label: 'Moderate',  tip: 'Wear sunscreen SPF 15+',        color: '#facc15' },
  { max: 7,        label: 'High',      tip: 'SPF 30+, seek shade at midday', color: '#fb923c' },
  { max: 10,       label: 'Very High', tip: 'SPF 50+, limit sun exposure',   color: '#f87171' },
  { max: Infinity, label: 'Extreme',   tip: 'Avoid sun between 10 am – 4 pm', color: '#c084fc' },
];

const BAR_GRADIENT =
  'linear-gradient(to right, #4ade80, #facc15, #fb923c, #f87171, #c084fc)';

function getLevel(uv: number): UVLevel {
  return LEVELS.find((l) => uv <= l.max) ?? LEVELS[LEVELS.length - 1];
}

export function UVIndexCard({ uvIndex }: { uvIndex: number }) {
  const level = getLevel(uvIndex);
  // Map 0–12 across the bar; clamp to [0, 100]
  const pct = Math.min(Math.max((uvIndex / 12) * 100, 0), 100);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl px-6 py-4 shadow-2xl text-white w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/50 text-xs uppercase tracking-widest">UV Index</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-light">{uvIndex}</span>
          <span className="text-sm font-medium" style={{ color: level.color }}>
            {level.label}
          </span>
        </div>
      </div>

      {/* Gradient bar with dot indicator */}
      <div className="relative h-2 rounded-full mb-3" style={{ background: BAR_GRADIENT }}>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md border-2 border-white/60 transition-all duration-500"
          style={{ left: `calc(${pct}% - 6px)` }}
        />
      </div>

      {/* Tick labels */}
      <div className="flex justify-between text-white/30 text-xs mb-3 px-0.5">
        <span>0</span>
        <span>3</span>
        <span>6</span>
        <span>8</span>
        <span>11+</span>
      </div>

      {/* Tip */}
      <p className="text-white/50 text-xs">{level.tip}</p>
    </div>
  );
}
