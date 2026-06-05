import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSavedLocations } from './useSavedLocations';

const STORAGE_KEY = 'weather-saved-locations';

const london = {
  id: '1',
  name: 'London',
  coords: { latitude: 51.5074, longitude: -0.1278 },
};
const paris = {
  id: '2',
  name: 'Paris',
  coords: { latitude: 48.8566, longitude: 2.3522 },
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useSavedLocations', () => {
  it('starts empty when localStorage has nothing', () => {
    const { result } = renderHook(() => useSavedLocations());
    expect(result.current.savedLocations).toEqual([]);
  });

  it('loads existing locations from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([london]));
    const { result } = renderHook(() => useSavedLocations());
    expect(result.current.savedLocations).toEqual([london]);
  });

  it('recovers gracefully from corrupt localStorage data', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json');
    const { result } = renderHook(() => useSavedLocations());
    expect(result.current.savedLocations).toEqual([]);
  });

  it('add() appends a location and persists to localStorage', () => {
    const { result } = renderHook(() => useSavedLocations());
    act(() => result.current.add(london));
    expect(result.current.savedLocations).toHaveLength(1);
    expect(result.current.savedLocations[0]).toEqual(london);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual([london]);
  });

  it('remove() deletes a location by id', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([london, paris]));
    const { result } = renderHook(() => useSavedLocations());
    act(() => result.current.remove('1'));
    expect(result.current.savedLocations).toEqual([paris]);
  });

  it('has() returns true for coords within 0.01° tolerance', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([london]));
    const { result } = renderHook(() => useSavedLocations());
    expect(result.current.has({ latitude: 51.5080, longitude: -0.1270 })).toBe(true);
  });

  it('has() returns false for coords outside 0.01° tolerance', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([london]));
    const { result } = renderHook(() => useSavedLocations());
    expect(result.current.has({ latitude: 48.8566, longitude: 2.3522 })).toBe(false);
  });

  it('reorder() moves an item from one index to another', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([london, paris]));
    const { result } = renderHook(() => useSavedLocations());
    act(() => result.current.reorder(0, 1));
    expect(result.current.savedLocations[0]).toEqual(paris);
    expect(result.current.savedLocations[1]).toEqual(london);
  });
});
