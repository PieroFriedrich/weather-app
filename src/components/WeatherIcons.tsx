/**
 * Animated SVG weather icon components.
 * All icons share a 64×64 viewBox. Size is controlled by the parent wrapper div.
 * Animations are driven by CSS classes in index.css.
 */
import type { ReactElement } from 'react';

// ── Shared helpers ──────────────────────────────────────────────────────────

/** Sun disc + spinning ray ring, positioned at (cx, cy) */
function Sun({ cx, cy, r = 10, rayLen = 4 }: { cx: number; cy: number; r?: number; rayLen?: number }) {
  const rays: ReactElement[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 * Math.PI) / 180;
    const x1 = cx + Math.cos(angle) * (r + 3);
    const y1 = cy + Math.sin(angle) * (r + 3);
    const x2 = cx + Math.cos(angle) * (r + 3 + rayLen);
    const y2 = cy + Math.sin(angle) * (r + 3 + rayLen);
    rays.push(
      <line
        key={i}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#fbbf24" strokeWidth={2} strokeLinecap="round"
      />
    );
  }
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#fbbf24" />
      <g className="sun-rays">{rays}</g>
    </>
  );
}

/** Puffy cloud silhouette composed of 3 circles + a base rect */
function Cloud({ opacity = 0.9, animDelay }: { opacity?: number; animDelay?: string }) {
  const f = `rgba(255,255,255,${opacity})`;
  return (
    <g className="cloud-body" style={animDelay ? { animationDelay: animDelay } : undefined}>
      <circle cx={22} cy={34} r={9}  fill={f} />
      <circle cx={34} cy={30} r={11} fill={f} />
      <circle cx={44} cy={34} r={7}  fill={f} />
      <rect   x={13}  y={34}  width={38} height={10} rx={5} fill={f} />
    </g>
  );
}

/** Three short diagonal precipitation lines below the cloud */
function RainLines({ classes }: { classes: [string, string, string] }) {
  return (
    <>
      <line x1={20} y1={47} x2={17} y2={54} stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinecap="round" className={classes[0]} />
      <line x1={30} y1={47} x2={27} y2={54} stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinecap="round" className={classes[1]} />
      <line x1={40} y1={47} x2={37} y2={54} stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinecap="round" className={classes[2]} />
    </>
  );
}

/** Three thin diagonal drizzle lines below the cloud */
function DrizzleLines() {
  return (
    <>
      <line x1={20} y1={47} x2={18} y2={53} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round" className="drizzle-d1" />
      <line x1={30} y1={47} x2={28} y2={53} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round" className="drizzle-d2" />
      <line x1={40} y1={47} x2={38} y2={53} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round" className="drizzle-d3" />
    </>
  );
}

/** Three small asterisk snowflakes below the cloud */
function SnowFlakes() {
  function Flake({ cx, cy, cls }: { cx: number; cy: number; cls: string }) {
    const s = 4;
    return (
      <g className={cls}>
        <line x1={cx - s} y1={cy}     x2={cx + s} y2={cy}     stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={cx}     y1={cy - s} x2={cx}     y2={cy + s} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={cx - s * 0.7} y1={cy - s * 0.7} x2={cx + s * 0.7} y2={cy + s * 0.7} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={cx + s * 0.7} y1={cy - s * 0.7} x2={cx - s * 0.7} y2={cy + s * 0.7} stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} strokeLinecap="round" />
      </g>
    );
  }
  return (
    <>
      <Flake cx={20} cy={52} cls="icon-snow-f1" />
      <Flake cx={32} cy={52} cls="icon-snow-f2" />
      <Flake cx={44} cy={52} cls="icon-snow-f3" />
    </>
  );
}

// ── Icon components ─────────────────────────────────────────────────────────

const svgProps = {
  viewBox: '0 0 64 64',
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  width: '100%',
  height: '100%',
} as const;

/** WMO 0 — Clear sky */
export function SunIcon() {
  return (
    <svg {...svgProps}>
      <Sun cx={32} cy={28} r={10} rayLen={5} />
    </svg>
  );
}

/** WMO 1 — Mainly clear */
export function MainlyClearIcon() {
  return (
    <svg {...svgProps}>
      <Sun cx={42} cy={20} r={7} rayLen={4} />
      <Cloud opacity={0.9} />
    </svg>
  );
}

/** WMO 2 — Partly cloudy */
export function PartlyCloudyIcon() {
  return (
    <svg {...svgProps}>
      <Sun cx={44} cy={18} r={9} rayLen={4} />
      <Cloud opacity={0.9} />
    </svg>
  );
}

/** WMO 3 — Overcast */
export function OvercastIcon() {
  return (
    <svg {...svgProps}>
      {/* back cloud, slightly muted, offset phase */}
      <g className="cloud-body" style={{ animationDelay: '0.8s' }}>
        <circle cx={18} cy={30} r={7}  fill="rgba(255,255,255,0.4)" />
        <circle cx={28} cy={26} r={9}  fill="rgba(255,255,255,0.4)" />
        <circle cx={38} cy={30} r={6}  fill="rgba(255,255,255,0.4)" />
        <rect   x={11}  y={30}  width={33} height={8} rx={4} fill="rgba(255,255,255,0.4)" />
      </g>
      {/* front cloud */}
      <Cloud opacity={0.9} />
    </svg>
  );
}

/** WMO 45, 48 — Fog / Icy fog */
export function FogIcon() {
  const lineProps = { strokeLinecap: 'round' as const, strokeWidth: 3 };
  return (
    <svg {...svgProps}>
      <line x1={10} y1={20} x2={54} y2={20} stroke="rgba(255,255,255,0.6)" {...lineProps} className="fog-s1" />
      <line x1={8}  y1={30} x2={56} y2={30} stroke="rgba(255,255,255,0.7)" {...lineProps} className="fog-s2" />
      <line x1={10} y1={40} x2={54} y2={40} stroke="rgba(255,255,255,0.5)" {...lineProps} className="fog-s1" />
    </svg>
  );
}

/** WMO 51–55 — Drizzle */
export function DrizzleIcon() {
  return (
    <svg {...svgProps}>
      <Cloud opacity={0.9} />
      <DrizzleLines />
    </svg>
  );
}

/** WMO 61–65 — Rain */
export function RainIcon() {
  return (
    <svg {...svgProps}>
      <Cloud opacity={0.85} />
      <RainLines classes={['rain-d1', 'rain-d2', 'rain-d3']} />
    </svg>
  );
}

/** WMO 71–77 — Snow */
export function SnowIcon() {
  return (
    <svg {...svgProps}>
      <Cloud opacity={0.85} />
      <SnowFlakes />
    </svg>
  );
}

/** WMO 80–82 — Rain showers */
export function RainShowersIcon() {
  return (
    <svg {...svgProps}>
      <Sun cx={44} cy={18} r={7} rayLen={4} />
      <Cloud opacity={0.85} />
      <RainLines classes={['rain-d1', 'rain-d2', 'rain-d3']} />
    </svg>
  );
}

/** WMO 85–86 — Snow showers */
export function SnowShowersIcon() {
  return (
    <svg {...svgProps}>
      <Sun cx={44} cy={18} r={7} rayLen={4} />
      <Cloud opacity={0.85} />
      <SnowFlakes />
    </svg>
  );
}

/** WMO 95–99 — Thunderstorm */
export function ThunderstormIcon() {
  return (
    <svg {...svgProps}>
      <Cloud opacity={0.75} />
      {/* Lightning bolt */}
      <path
        d="M 34 44 L 28 54 L 33 54 L 30 62 L 40 50 L 35 50 Z"
        fill="#fbbf24"
        className="bolt"
      />
      {/* Two flanking rain lines, static */}
      <line x1={20} y1={47} x2={17} y2={54} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={42} y1={47} x2={39} y2={54} stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}
