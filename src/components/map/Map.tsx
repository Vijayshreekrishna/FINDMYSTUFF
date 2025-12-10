"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icon missing in Leaflet with Next.js
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom icon for current location (blue pulsing dot)
const currentLocationIcon = L.divIcon({
    className: 'current-location-marker',
    html: `
        <div style="position: relative;">
            <div style="
                width: 20px;
                height: 20px;
                background: #4285F4;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(66, 133, 244, 0.6);
                animation: pulse 2s infinite;
            "></div>
        </div>
        <style>
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 10px rgba(66, 133, 244, 0.6);
                }
                50% {
                    box-shadow: 0 0 20px rgba(66, 133, 244, 0.8);
                }
                100% {
                    box-shadow: 0 0 10px rgba(66, 133, 244, 0.6);
                }
            }
        </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
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
    markers?: { lat: number; lng: number; title?: string; isCurrentLocation?: boolean }[];
    onLocationSelect?: (lat: number, lng: number) => void;
    interactive?: boolean;
}

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMapEvents({});
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

export default function Map({ center = [51.505, -0.09], zoom = 13, markers = [], onLocationSelect, interactive = true }: MapProps) {
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={interactive} className="h-full w-full rounded-lg z-0">
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {onLocationSelect && <LocationMarker onLocationSelect={onLocationSelect} />}

            {markers.map((marker, idx) => (
                <React.Fragment key={idx}>
                    {marker.isCurrentLocation && (
                        <Circle
                            key={`circle-${idx}`}
                            center={[marker.lat, marker.lng]}
                            radius={50}
                            pathOptions={{
                                color: '#4285F4',
                                fillColor: '#4285F4',
                                fillOpacity: 0.1,
                                weight: 1,
                            }}
                        />
                    )}
                    <Marker
                        key={`marker-${idx}`}
                        position={[marker.lat, marker.lng]}
                        icon={marker.isCurrentLocation ? currentLocationIcon : defaultIcon}
                    >
                        {marker.title && <Popup>{marker.title}</Popup>}
                    </Marker>
                </React.Fragment>
            ))}
        </MapContainer>
    );
}
