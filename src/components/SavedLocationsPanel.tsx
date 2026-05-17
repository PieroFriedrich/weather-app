import type { SavedLocation, Coordinates } from '../types/weather';

interface Props {
  locations: SavedLocation[];
  activeCoords: Coordinates | null;
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

function LocationRow({
  loc,
  active,
  onSelect,
  onRemove,
}: {
  loc: SavedLocation;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded-2xl px-3 py-2 transition-colors ${
        active ? 'bg-white/25 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 text-left text-sm font-medium truncate focus:outline-none"
      >
        {loc.name}
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${loc.name}`}
        className="text-white/40 hover:text-white/80 transition-colors focus:outline-none shrink-0 text-xs leading-none"
      >
        ✕
      </button>
    </div>
  );
}

export function SavedLocationsPanel({
  locations,
  activeCoords,
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
      <aside className="hidden sm:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col gap-2 w-44 z-30">
        <p className="text-white/40 text-xs uppercase tracking-wider px-1 mb-1">Saved</p>
        {locations.map(loc => (
          <LocationRow
            key={loc.id}
            loc={loc}
            active={isActive(loc, activeCoords)}
            onSelect={() => onSelect(loc)}
            onRemove={() => onRemove(loc.id)}
          />
        ))}
      </aside>

      {/* Mobile: toggle button */}
      <button
        type="button"
        onClick={onMobileOpen}
        className="sm:hidden self-start flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white/80 text-sm font-medium rounded-full px-4 py-1.5 focus:outline-none"
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
            className="sm:hidden fixed inset-0 bg-black/40 z-40"
            onClick={onMobileClose}
          />
          <div className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-white/10 backdrop-blur-xl rounded-t-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
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
            {locations.map(loc => (
              <LocationRow
                key={loc.id}
                loc={loc}
                active={isActive(loc, activeCoords)}
                onSelect={() => { onSelect(loc); onMobileClose(); }}
                onRemove={() => onRemove(loc.id)}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
