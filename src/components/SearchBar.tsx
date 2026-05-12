import { useState, useRef, useEffect } from 'react';
import type { GeocodingResult } from '../types/weather';
import { searchCity } from '../services/geocoding';

interface Props {
  onSelect: (result: GeocodingResult) => void;
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchCity(query);
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  function handleSelect(result: GeocodingResult) {
    onSelect(result);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 gap-2 border border-white/20">
        <span className="text-white/50 text-sm">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="bg-transparent text-white placeholder-white/40 outline-none w-full text-sm"
        />
        {loading && <span className="text-white/40 text-xs animate-pulse">searching</span>}
      </div>
      {open && (
        <ul className="absolute top-full mt-2 w-full bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/10">
          {results.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors text-sm"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-white/50 ml-1 text-xs">
                  {r.admin1 ? `${r.admin1}, ` : ''}{r.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
