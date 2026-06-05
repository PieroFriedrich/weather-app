import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reverseGeocode, searchCity } from './geocoding';

function mockFetch(data: unknown, ok = true) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    json: () => Promise.resolve(data),
  } as Response);
}

beforeEach(() => vi.restoreAllMocks());

describe('reverseGeocode', () => {
  it('returns "city, state" when both are present', async () => {
    mockFetch({ address: { city: 'London', state: 'England' } });
    expect(await reverseGeocode(51.5, -0.12)).toBe('London, England');
  });

  it('falls back to town when city is missing', async () => {
    mockFetch({ address: { town: 'Greenwich', state: 'England' } });
    expect(await reverseGeocode(51.48, 0.0)).toBe('Greenwich, England');
  });

  it('falls back to village when city and town are missing', async () => {
    mockFetch({ address: { village: 'Eyam', state: 'Derbyshire' } });
    expect(await reverseGeocode(53.28, -1.67)).toBe('Eyam, Derbyshire');
  });

  it('omits state when absent', async () => {
    mockFetch({ address: { city: 'Monaco' } });
    expect(await reverseGeocode(43.73, 7.42)).toBe('Monaco');
  });

  it('returns empty string on non-ok response', async () => {
    mockFetch({}, false);
    expect(await reverseGeocode(0, 0)).toBe('');
  });

  it('returns empty string on fetch error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'));
    expect(await reverseGeocode(0, 0)).toBe('');
  });
});

describe('searchCity', () => {
  it('returns parsed GeocodingResult array', async () => {
    const results = [
      { id: 1, name: 'London', latitude: 51.5, longitude: -0.12, country: 'GB', admin1: 'England' },
    ];
    mockFetch({ results });
    const data = await searchCity('London');
    expect(data).toEqual(results);
  });

  it('returns empty array when results field is missing', async () => {
    mockFetch({});
    expect(await searchCity('nowhere')).toEqual([]);
  });

  it('throws on non-ok response', async () => {
    mockFetch({}, false);
    await expect(searchCity('x')).rejects.toThrow('Geocoding fetch failed');
  });

  it('URL-encodes the search name', async () => {
    const spy = mockFetch({ results: [] });
    await searchCity('New York');
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('New%20York'));
  });
});
