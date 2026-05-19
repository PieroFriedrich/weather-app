import type { SavedLocation, Coordinates } from '../types/weather';
import { SavedLocationCard } from './SavedLocationCard';

interface Props {
  locations: SavedLocation[];
  activeCoords: Coordinates | null;
  unit: 'F' | 'C';
  mobileOpen: boolean;
  onMobileOpen: () => void;
  onMobileClose: () => void;
  onSelect: (loc: SavedLocation) => void;
  onRemove: (id: string) => void;
}

function isActive(loc: SavedLocation, activeCoords: Coordinates | null): boolean {
  if (!activeCoords) return false;
  return (
    Math.abs(loc.coords.latitude - activeCoords.latitude) < 0.01 &&
    Math.abs(loc.coords.longitude - activeCoords.longitude) < 0.01
  );
}

export function SavedLocationsPanel({
  locations,
  activeCoords,
  unit,
  mobileOpen,
  onMobileOpen,
  onMobileClose,
  onSelect,
  onRemove,
}: Props) {
  if (locations.length === 0) return null;

  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <aside className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col gap-3 w-52 z-30">
        <p className="text-white/40 text-xs uppercase tracking-wider px-1 mb-1">Saved</p>
        {locations.map(loc => (
          <SavedLocationCard
            key={loc.id}
            location={loc}
            isActive={isActive(loc, activeCoords)}
            unit={unit}
            onSelect={() => onSelect(loc)}
            onRemove={() => onRemove(loc.id)}
          />
        ))}
      </aside>

      {/* Mobile: toggle button */}
      <button
        type="button"
        onClick={onMobileOpen}
        className="lg:hidden self-start flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white/80 text-sm font-medium rounded-full px-4 py-1.5 focus:outline-none"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" />
        </svg>
        Saved ({locations.length})
      </button>

      {/* Mobile: bottom drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={onMobileClose}
          />
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/10 backdrop-blur-xl rounded-t-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-medium">Saved Locations</p>
              <button
                type="button"
                onClick={onMobileClose}
                className="text-white/50 hover:text-white transition-colors focus:outline-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {locations.map(loc => (
                <SavedLocationCard
                  key={loc.id}
                  location={loc}
                  isActive={isActive(loc, activeCoords)}
                  unit={unit}
                  onSelect={() => { onSelect(loc); onMobileClose(); }}
                  onRemove={() => onRemove(loc.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
