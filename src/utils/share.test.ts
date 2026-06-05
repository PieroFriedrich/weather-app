import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildShareUrl, triggerShare } from './share';

function defineNavigatorProp(prop: string, value: unknown) {
  Object.defineProperty(navigator, prop, { value, configurable: true, writable: true });
}

beforeEach(() => vi.restoreAllMocks());
afterEach(() => {
  // Reset navigator props to undefined so tests stay isolated
  defineNavigatorProp('share', undefined);
});

describe('buildShareUrl', () => {
  it('includes city, lat, lon, and unit as query params', () => {
    const url = buildShareUrl('London', 51.5074, -0.1278, 'C');
    const parsed = new URL(url);
    expect(parsed.searchParams.get('city')).toBe('London');
    expect(parsed.searchParams.get('lat')).toBe('51.5074');
    expect(parsed.searchParams.get('lon')).toBe('-0.1278');
    expect(parsed.searchParams.get('unit')).toBe('C');
  });

  it('rounds coordinates to 4 decimal places', () => {
    const url = buildShareUrl('NYC', 40.712776, -74.005974, 'F');
    const parsed = new URL(url);
    expect(parsed.searchParams.get('lat')).toBe('40.7128');
    expect(parsed.searchParams.get('lon')).toBe('-74.0060');
  });

  it('URL-encodes city names with spaces', () => {
    const url = buildShareUrl('New York', 40.7128, -74.006, 'F');
    expect(url).toContain('New+York');
  });
});

describe('triggerShare', () => {
  it('calls navigator.share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    defineNavigatorProp('share', shareMock);

    await triggerShare('https://example.com', 'London');

    expect(shareMock).toHaveBeenCalledWith({
      title: 'Weather in London',
      url: 'https://example.com',
    });
  });

  it('falls back to clipboard.writeText when navigator.share is unavailable', async () => {
    defineNavigatorProp('share', undefined);
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    defineNavigatorProp('clipboard', { writeText: writeTextMock });

    await triggerShare('https://example.com', 'London');

    expect(writeTextMock).toHaveBeenCalledWith('https://example.com');
  });

  it('does not throw when the user cancels the share sheet (AbortError)', async () => {
    const shareMock = vi.fn().mockRejectedValue(new DOMException('AbortError', 'AbortError'));
    defineNavigatorProp('share', shareMock);

    await expect(triggerShare('https://example.com', 'London')).resolves.toBeUndefined();
  });
});
