import { useState, useEffect } from "react";
import type { Coordinates, GeocodingResult } from "./types/weather";
import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import { CurrentWeather } from "./components/CurrentWeather";
import { ForecastStrip } from "./components/ForecastStrip";
import { SearchBar } from "./components/SearchBar";
import { reverseGeocode } from "./services/geocoding";
import { getWeatherTheme } from "./utils/wmo";

export default function App() {
  const geo = useGeolocation();
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [cityName, setCityName] = useState("");
  const [geoCityName, setGeoCityName] = useState<string | undefined>(undefined);
  const [unit, setUnit] = useState<"F" | "C">("C");

  useEffect(() => {
    if (!geo.coords || coords) return;
    reverseGeocode(geo.coords.latitude, geo.coords.longitude)
      .then(setGeoCityName)
      .catch(() => setGeoCityName(""));
  }, [geo.coords, coords]);

  const activeCoords = coords ?? geo.coords;
  const activeCityName = coords ? cityName : (geoCityName ?? "");
  const cityReady = coords !== null || geoCityName !== undefined;
  const weather = useWeather(activeCoords);
  const theme = getWeatherTheme(weather.data?.weatherCode ?? -1);
  const showForecast = geo.coords !== null || coords !== null;

  function handleSelect(result: GeocodingResult) {
    setCoords({ latitude: result.latitude, longitude: result.longitude });
    setCityName(
      result.admin1 ? `${result.name}, ${result.admin1}` : result.name,
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 gap-6 overflow-hidden transition-all duration-1000"
      style={{ background: theme.gradient }}
    >
      {theme.overlayClass && (
        <div className={`absolute inset-0 pointer-events-none ${theme.overlayClass}`} aria-hidden="true" />
      )}
      <h1 className="text-3xl font-light text-white tracking-widest">
        Weather
      </h1>

      <SearchBar onSelect={handleSelect} />

      {geo.loading && !coords && (
        <p className="text-white/50 text-sm animate-pulse">
          Detecting your location…
        </p>
      )}

      {geo.error && !coords && !weather.data && !weather.loading && (
        <p className="text-white/50 text-sm">
          {geo.error} — search for a city above
        </p>
      )}

      {(weather.loading || (weather.data && !cityReady)) && (
        <p className="text-white/50 text-sm animate-pulse">Loading weather…</p>
      )}

      {weather.error && <p className="text-red-300 text-sm">{weather.error}</p>}

      {weather.data && !weather.loading && cityReady && (
        <div className="flex items-start gap-4">
          <CurrentWeather
            data={weather.data}
            cityName={activeCityName}
            unit={unit}
            onToggleUnit={() => setUnit((u) => (u === "F" ? "C" : "F"))}
          />
          {showForecast && <ForecastStrip forecast={weather.forecast} unit={unit} />}
        </div>
      )}
    </div>
  );
}
