import type { SavedLocation, Coordinates } from '../types/weather';

interface Props {
  locations: SavedLocation[];
  activeCoords: Coordinates | null;
  onSelect: (location: SavedLocation) => void;
  onRemove: (id: string) => void;
}

function isActive(loc: SavedLocation, activeCoords: Coordinates | null): boolean {
  if (!activeCoords) return false;
  return (
    Math.abs(loc.coords.latitude - activeCoords.latitude) < 0.01 &&
    Math.abs(loc.coords.longitude - activeCoords.longitude) < 0.01
  );
}

export function SavedLocationsBar({ locations, activeCoords, onSelect, onRemove }: Props) {
  if (locations.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {locations.map(loc => (
        <div
          key={loc.id}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
            isActive(loc, activeCoords)
              ? 'bg-white/30 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
        >
          <button
            type="button"
            onClick={() => onSelect(loc)}
            className="focus:outline-none"
          >
            {loc.name}
          </button>
          <button
            type="button"
            onClick={() => onRemove(loc.id)}
            className="text-white/40 hover:text-white/80 focus:outline-none transition-colors leading-none"
            aria-label={`Remove ${loc.name}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
