# Weather App

<table align="center">
  <tr>
    <td align="center">
      <img src="src/assets/daytime-screenshot.png" alt="Sunny theme — desktop" width="420" /><br/>
      <sub>Sunny theme — desktop</sub>
    </td>
    <td align="center">
      <img src="src/assets/desktop-screenshot.png" alt="Rainy theme — desktop" width="420" /><br/>
      <sub>Rainy theme — desktop</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="src/assets/mainpage-screenshot.png" alt="Overcast — mobile" width="420" /><br/>
      <sub>Overcast — mobile</sub>
    </td>
    <td align="center">
      <img src="src/assets/search-screenshot.png" alt="City search autocomplete" width="420" /><br/>
      <sub>City search autocomplete</sub>
    </td>
  </tr>
</table>

A clean, responsive weather app that shows current conditions and a 7-day forecast for any city in the world — or your current location automatically.

## Features

- **Auto-location** — detects your coordinates on load and fetches local weather instantly
- **City search** — debounced autocomplete surfaces matching cities as you type
- **Current conditions** — temperature, feels-like, humidity, wind speed, rain probability, and sunrise/sunset times
- **24-hour chart** — smooth hourly temperature curve with precipitation overlay
- **7-day forecast** — daily high/low with weather icons for the week ahead
- **°F / °C toggle** — switch units without re-fetching data
- **Dynamic backgrounds** — gradient and animation change per weather condition (sun, rain, snow, fog, thunderstorm, and more)
- **Saved locations** — bookmark cities and see their live weather at a glance; desktop sidebar or mobile drawer
- **Share** — copy a shareable URL that restores the exact city and unit on open

## Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Weather data | [Open-Meteo](https://open-meteo.com/) |
| City search | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) |
| Reverse geocoding | [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/) |

No API keys required — all data sources are free and open.

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).
