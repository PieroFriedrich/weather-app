import { useState } from "react";
import type { CurrentWeather as WeatherData } from "../types/weather";
import { WeatherIcon } from "./WeatherIcon";

function toCardinal(deg: number): string {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function getAqiInfo(aqi: number): { label: string; colorClass: string } {
  if (aqi <= 20) return { label: "Good", colorClass: "text-emerald-300" };
  if (aqi <= 40) return { label: "Fair", colorClass: "text-lime-300" };
  if (aqi <= 60) return { label: "Moderate", colorClass: "text-yellow-300" };
  if (aqi <= 80) return { label: "Poor", colorClass: "text-orange-300" };
  if (aqi <= 100) return { label: "Very Poor", colorClass: "text-red-400" };
  return { label: "Extremely Poor", colorClass: "text-purple-400" };
}

interface Props {
  data: WeatherData;
  cityName: string;
  unit: "F" | "C";
  onToggleUnit: () => void;
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
  onShare: () => Promise<void>;
  aqi?: number | null;
  avgTemp?: number | null;
}

export function CurrentWeather({
  data,
  cityName,
  unit,
  onToggleUnit,
  isSaved,
  onSave,
  onUnsave,
  onShare,
  aqi,
  avgTemp,
}: Props) {
  const [shareConfirmed, setShareConfirmed] = useState(false);

  async function handleShare() {
    try {
      await onShare();
      setShareConfirmed(true);
      setTimeout(() => setShareConfirmed(false), 2000);
    } catch {
      /* clipboard write failed */
    }
  }

  const displayTemp =
    unit === "F"
      ? data.temperature
      : Math.round(((data.temperature - 32) * 5) / 9);

  const displayFeelsLike =
    unit === "F" ? data.feelsLike : Math.round(((data.feelsLike - 32) * 5) / 9);

  const deltaF = avgTemp != null ? data.temperature - avgTemp : null;
  const delta =
    deltaF != null
      ? unit === "C"
        ? Math.round(deltaF * (5 / 9))
        : Math.round(deltaF)
      : null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl w-full max-w-sm sm:max-w-none min-[850px]:w-1/2 min-[850px]:shrink-0 text-white">
      <div className="flex items-center justify-between mb-1">
        <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
          {cityName}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share this location"
            className="text-white/50 hover:text-white transition-colors focus:outline-none"
          >
            {shareConfirmed ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={isSaved ? onUnsave : onSave}
            aria-label={
              isSaved ? "Remove from saved locations" : "Save this location"
            }
            className="text-white/50 hover:text-white transition-colors focus:outline-none"
          >
            {isSaved ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-8xl font-thin">
            {displayTemp}°{unit}
          </div>
          <p className="text-white/50 text-sm mt-1">
            Feels like {displayFeelsLike}°{unit}
          </p>
          {delta !== null && Math.abs(delta) >= 1 && (
            <p className={`text-sm mt-0.5 ${delta > 0 ? "text-orange-300" : "text-blue-300"}`}>
              {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}°{unit} {delta > 0 ? "warmer" : "cooler"} than usual
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleUnit}
          className="mt-2 flex bg-white/10 rounded-xl overflow-hidden text-sm font-medium"
          aria-label="Toggle temperature unit"
        >
          <span
            className={`px-3 py-1.5 transition-colors ${unit === "F" ? "bg-white/20 text-white" : "text-white/40"}`}
          >
            °F
          </span>
          <span
            className={`px-3 py-1.5 transition-colors ${unit === "C" ? "bg-white/20 text-white" : "text-white/40"}`}
          >
            °C
          </span>
        </button>
      </div>

      <WeatherIcon code={data.weatherCode} />
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
            Humidity
          </p>
          <p className="text-2xl font-light">{data.humidity}%</p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
            Wind
          </p>
          <p className="text-2xl font-light">{data.windSpeed} mph</p>
          <div className="flex items-center gap-1 mt-1">
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-white/60 shrink-0"
              style={{ transform: `rotate(${data.windDirection}deg)` }}
              aria-hidden="true"
            >
              <path
                d="M12 2 L12 22 M12 2 L7 8 M12 2 L17 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="text-white/50 text-xs">{toCardinal(data.windDirection)}</span>
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
            Rain
          </p>
          <p className="text-2xl font-light">
            {data.precipitationProbability}%
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-4 col-span-3 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              🌅 Sunrise
            </p>
            <p className="text-xl font-light">{data.sunrise}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              🌇 Sunset
            </p>
            <p className="text-xl font-light">{data.sunset}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              Air Quality
            </p>
            {aqi != null ? (
              (() => {
                const { label, colorClass } = getAqiInfo(aqi);
                return (
                  <>
                    <p className={`text-xl font-light ${colorClass}`}>{aqi}</p>
                    <p className={`text-xs mt-0.5 ${colorClass}`}>{label}</p>
                  </>
                );
              })()
            ) : (
              <p className="text-xl font-light text-white/30">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
