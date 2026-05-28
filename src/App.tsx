import { useState, useEffect } from "react";
import type {
  Coordinates,
  GeocodingResult,
  SavedLocation,
} from "./types/weather";
import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import { useSavedLocations } from "./hooks/useSavedLocations";
import { CurrentWeather } from "./components/CurrentWeather";
import { ForecastStrip } from "./components/ForecastStrip";
import { HourlyChart } from "./components/HourlyChart";
import { PrecipChart } from "./components/PrecipChart";
import { SearchBar } from "./components/SearchBar";
import { SavedLocationsPanel } from "./components/SavedLocationsPanel";
import { CityMap } from "./components/CityMap";
import { UVIndexCard } from "./components/UVIndexCard";
import { reverseGeocode } from "./services/geocoding";
import { getWeatherTheme } from "./utils/wmo";
import { buildShareUrl, triggerShare } from "./utils/share";
import { useAirQuality } from "./hooks/useAirQuality";

export default function App() {
  const geo = useGeolocation();
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [cityName, setCityName] = useState("");
  const [geoCityName, setGeoCityName] = useState<string | undefined>(undefined);
  const [unit, setUnit] = useState<"F" | "C">("C");
  const { savedLocations, add, remove, has, reorder } = useSavedLocations();
  const [savedPanelOpen, setSavedPanelOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const lat = params.get("lat");
    const lon = params.get("lon");
    const u = params.get("unit");
    if (city && lat && lon) {
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);
      if (!isNaN(parsedLat) && !isNaN(parsedLon)) {
        setCityName(city);
        setCoords({ latitude: parsedLat, longitude: parsedLon });
        if (u === "F" || u === "C") setUnit(u);
        history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

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
  const airQuality = useAirQuality(activeCoords);
  const theme = getWeatherTheme(weather.data?.weatherCode ?? -1);
  const showForecast = geo.coords !== null || coords !== null;

  function handleSelect(result: GeocodingResult) {
    setCoords({ latitude: result.latitude, longitude: result.longitude });
    setCityName(
      result.admin1 ? `${result.name}, ${result.admin1}` : result.name,
    );
  }

  function handleSelectSaved(location: SavedLocation) {
    setCoords(location.coords);
    setCityName(location.name);
  }

  function handleSave() {
    if (!activeCoords) return;
    add({
      id: crypto.randomUUID(),
      name: activeCityName,
      coords: activeCoords,
    });
  }

  function handleUnsave() {
    if (!activeCoords) return;
    const found = savedLocations.find(
      (loc) =>
        Math.abs(loc.coords.latitude - activeCoords.latitude) < 0.01 &&
        Math.abs(loc.coords.longitude - activeCoords.longitude) < 0.01,
    );
    if (found) remove(found.id);
  }

  async function handleShare() {
    if (!activeCoords) return;
    const url = buildShareUrl(
      activeCityName,
      activeCoords.latitude,
      activeCoords.longitude,
      unit,
    );
    await triggerShare(url, activeCityName);
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 gap-6 overflow-hidden transition-all duration-1000 py-5"
      style={{ background: theme.gradient }}
    >
      {theme.overlayClass && (
        <div
          className={`absolute inset-0 pointer-events-none ${theme.overlayClass}`}
          aria-hidden="true"
        />
      )}
      <h1 className="text-3xl font-light text-white tracking-widest">
        Weather
      </h1>

      {/* Desktop: 3-column grid. Mobile: single column. */}
      <div className="w-full max-w-sm sm:w-full sm:max-w-4xl flex flex-col gap-6 desktop-3col">
        {/* Col 1: Saved Locations — wrapper ensures col-start-1 even when panel is empty */}
        <div className="min-[1400px]:col-start-1">
          <SavedLocationsPanel
            locations={savedLocations}
            activeCoords={activeCoords}
            unit={unit}
            mobileOpen={savedPanelOpen}
            onMobileOpen={() => setSavedPanelOpen(true)}
            onMobileClose={() => setSavedPanelOpen(false)}
            onSelect={handleSelectSaved}
            onRemove={remove}
            onReorder={reorder}
          />
        </div>

        {/* Col 2: Main content */}
        <div className="min-[1400px]:col-start-2 flex flex-col gap-6">
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
            <p className="text-white/50 text-sm animate-pulse">
              Loading weather…
            </p>
          )}

          {weather.error && (
            <p className="text-red-300 text-sm">{weather.error}</p>
          )}

          {weather.data && !weather.loading && cityReady && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col min-[850px]:flex-row items-stretch gap-4">
                <CurrentWeather
                  data={weather.data}
                  cityName={activeCityName}
                  unit={unit}
                  onToggleUnit={() => setUnit((u) => (u === "F" ? "C" : "F"))}
                  isSaved={activeCoords ? has(activeCoords) : false}
                  onSave={handleSave}
                  onUnsave={handleUnsave}
                  onShare={handleShare}
                  aqi={airQuality.aqi}
                />
                {showForecast && (
                  <ForecastStrip forecast={weather.forecast} unit={unit} />
                )}
              </div>
              {showForecast && weather.hourly.length > 0 && (
                <HourlyChart hourly={weather.hourly} unit={unit} />
              )}
              {showForecast && weather.hourly.length > 0 && (
                <PrecipChart hourly={weather.hourly} />
              )}
              {showForecast && weather.forecast.length > 0 && (
                <UVIndexCard uvIndex={weather.forecast[0].uvIndexMax} />
              )}
              {/* Map shown here on mobile only */}
              {activeCoords && (
                <div className="min-[1400px]:hidden relative z-0">
                  <CityMap coords={activeCoords} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Col 3: Map – desktop only */}
        {activeCoords && (
          <div
            className="min-[1400px]:col-start-3 hidden min-[1400px]:block sticky top-6 rounded-3xl overflow-hidden shadow-2xl"
            style={{ height: "calc(100vh - 3rem)" }}
          >
            <CityMap coords={activeCoords} className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  );
}
