export function buildShareUrl(city: string, lat: number, lon: number, unit: 'F' | 'C'): string {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('city', city);
  url.searchParams.set('lat', lat.toFixed(4));
  url.searchParams.set('lon', lon.toFixed(4));
  url.searchParams.set('unit', unit);
  return url.toString();
}

export async function triggerShare(url: string, city: string): Promise<void> {
  if (navigator.share) {
    try { await navigator.share({ title: `Weather in ${city}`, url }); } catch { /* AbortError = user cancelled */ }
  } else {
    await navigator.clipboard.writeText(url);
  }
}
