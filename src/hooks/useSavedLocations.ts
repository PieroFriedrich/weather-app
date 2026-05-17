import { useState, useEffect } from 'react';
import type { SavedLocation, Coordinates } from '../types/weather';

const STORAGE_KEY = 'weather-saved-locations';

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as SavedLocation[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLocations));
  }, [savedLocations]);

  function add(location: SavedLocation) {
    setSavedLocations(prev => [...prev, location]);
  }

  function remove(id: string) {
    setSavedLocations(prev => prev.filter(loc => loc.id !== id));
  }

  function has(coords: Coordinates): boolean {
    return savedLocations.some(
      loc =>
        Math.abs(loc.coords.latitude - coords.latitude) < 0.01 &&
        Math.abs(loc.coords.longitude - coords.longitude) < 0.01,
    );
  }

  return { savedLocations, add, remove, has };
}
