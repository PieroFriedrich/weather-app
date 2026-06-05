import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

function defineGeolocation(value: unknown) {
  Object.defineProperty(navigator, 'geolocation', { value, configurable: true, writable: true });
}

beforeEach(() => vi.restoreAllMocks());

describe('useGeolocation', () => {
  it('starts with loading: true and no coords or error', () => {
    defineGeolocation({ getCurrentPosition: vi.fn() });

    const { result } = renderHook(() => useGeolocation());
    expect(result.current.loading).toBe(true);
    expect(result.current.coords).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets coords on successful geolocation', async () => {
    defineGeolocation({
      getCurrentPosition: (success: PositionCallback) => {
        success({ coords: { latitude: 51.5, longitude: -0.12 } } as GeolocationPosition);
      },
    });

    const { result } = renderHook(() => useGeolocation());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.coords).toEqual({ latitude: 51.5, longitude: -0.12 });
    expect(result.current.error).toBeNull();
  });

  it('sets an error when geolocation is not supported', async () => {
    defineGeolocation(undefined);

    const { result } = renderHook(() => useGeolocation());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Geolocation not supported');
    expect(result.current.coords).toBeNull();
  });

  it('sets an error on permission denied', async () => {
    defineGeolocation({
      getCurrentPosition: (_: PositionCallback, error: PositionErrorCallback) => {
        error({ code: 1, message: 'denied' } as GeolocationPositionError);
      },
    });

    const { result } = renderHook(() => useGeolocation());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Location access denied');
    expect(result.current.coords).toBeNull();
  });
});
