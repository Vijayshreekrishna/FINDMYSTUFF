"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon missing in Leaflet with Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function LocationMarker({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
    const map = useMapEvents({
        click(e) {
            if (onLocationSelect) {
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
}

interface MapProps {
    center?: [number, number];
    zoom?: number;
    markers?: { lat: number; lng: number; title?: string }[];
    onLocationSelect?: (lat: number, lng: number) => void;
    interactive?: boolean;
}

export default function Map({ center = [51.505, -0.09], zoom = 13, markers = [], onLocationSelect, interactive = true }: MapProps) {
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={interactive} className="h-full w-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {onLocationSelect && <LocationMarker onLocationSelect={onLocationSelect} />}

            {markers.map((marker, idx) => (
                <Marker key={idx} position={[marker.lat, marker.lng]} icon={icon}>
                    {marker.title && <Popup>{marker.title}</Popup>}
                </Marker>
            ))}
        </MapContainer>
    );
}
