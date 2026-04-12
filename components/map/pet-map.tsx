"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type PetPin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export function PetMap({ pins }: { pins: PetPin[] }) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  const center = pins.length ? ([pins[0].lat, pins[0].lng] as [number, number]) : ([39.9, 116.4] as [number, number]);

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-72 w-full rounded-md border">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((pin) => (
        <Marker key={pin.id} position={[pin.lat, pin.lng]}>
          <Popup>{pin.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
