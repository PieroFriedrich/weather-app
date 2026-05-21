import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Coordinates } from '../types/weather';

const pinIcon = new L.DivIcon({
  html: `<svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24S24 21 24 12C24 5.37 18.63 0 12 0z" fill="white" opacity="0.9"/>
    <circle cx="12" cy="12" r="5" fill="rgba(0,0,0,0.25)"/>
  </svg>`,
  className: '',
  iconSize: [28, 42],
  iconAnchor: [14, 42],
});

function Recenter({ coords }: { coords: Coordinates }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coords.latitude, coords.longitude]);
  }, [coords.latitude, coords.longitude, map]);
  return null;
}

interface Props {
  coords: Coordinates;
}

export function CityMap({ coords }: Props) {
  return (
    <MapContainer
      center={[coords.latitude, coords.longitude]}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[coords.latitude, coords.longitude]} icon={pinIcon} />
      <Recenter coords={coords} />
    </MapContainer>
  );
}
