import { useState } from "react";
import type { SavedLocation, Coordinates } from "../types/weather";
import { SavedLocationCard } from "./SavedLocationCard";

interface Props {
  locations: SavedLocation[];
  activeCoords: Coordinates | null;
  unit: "F" | "C";
  mobileOpen: boolean;
  onMobileOpen: () => void;
  onMobileClose: () => void;
  onSelect: (loc: SavedLocation) => void;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

function isActive(
  loc: SavedLocation,
  activeCoords: Coordinates | null,
): boolean {
  if (!activeCoords) return false;
  return (
    Math.abs(loc.coords.latitude - activeCoords.latitude) < 0.01 &&
    Math.abs(loc.coords.longitude - activeCoords.longitude) < 0.01
  );
}

function GripIcon() {
  return (
    <svg viewBox="0 0 10 16" fill="currentColor" className="w-2.5 h-4">
      <circle cx="2" cy="2" r="1.5" />
      <circle cx="8" cy="2" r="1.5" />
      <circle cx="2" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="2" cy="14" r="1.5" />
      <circle cx="8" cy="14" r="1.5" />
    </svg>
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
  onReorder,
}: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setOverIndex(index);
  }

  function handleDrop(toIndex: number) {
    if (dragIndex !== null && toIndex !== dragIndex) {
      onReorder(dragIndex, toIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
  }

  if (locations.length === 0) return null;

  return (
    <>
      {/* Desktop: in-flow left column */}
      <aside
        className="hidden min-[1400px]:flex flex-col gap-3 w-full sticky top-6"
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setOverIndex(null);
          }
        }}
      >
        <p className="text-white/40 text-xs uppercase tracking-wider px-1 mb-1">
          Saved
        </p>
        {locations.map((loc, i) => (
          <div
            key={loc.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={() => handleDrop(i)}
            onDragEnd={handleDragEnd}
            className={[
              "relative group cursor-grab active:cursor-grabbing transition-opacity duration-150",
              dragIndex === i ? "opacity-30" : "opacity-100",
            ].join(" ")}
          >
            {overIndex === i && dragIndex !== null && dragIndex !== i && (
              <div className="absolute -top-1.5 inset-x-2 h-0.5 bg-white/60 rounded-full z-10" />
            )}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/50 transition-colors pointer-events-none z-10">
              <GripIcon />
            </div>
            <SavedLocationCard
              location={loc}
              isActive={isActive(loc, activeCoords)}
              unit={unit}
              onSelect={() => onSelect(loc)}
              onRemove={() => onRemove(loc.id)}
            />
          </div>
        ))}
      </aside>

      {/* Mobile: toggle button */}
      <button
        type="button"
        onClick={onMobileOpen}
        className="min-[1400px]:hidden self-start flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors text-white/80 text-sm font-medium rounded-full px-4 py-1.5 focus:outline-none"
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
            className="min-[1400px]:hidden fixed inset-0 bg-black/40 z-40"
            onClick={onMobileClose}
          />
          <div className="min-[1400px]:hidden fixed bottom-0 inset-x-0 z-50 bg-white/10 backdrop-blur-xl rounded-t-3xl p-6 flex flex-col gap-4">
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
              {locations.map((loc) => (
                <SavedLocationCard
                  key={loc.id}
                  location={loc}
                  isActive={isActive(loc, activeCoords)}
                  unit={unit}
                  onSelect={() => {
                    onSelect(loc);
                    onMobileClose();
                  }}
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
