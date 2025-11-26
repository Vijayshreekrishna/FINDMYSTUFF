"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("./Map"), { ssr: false });

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    onAddressChange?: (address: string) => void;
}

export default function MapPicker({ onLocationSelect, onAddressChange }: MapPickerProps) {
    const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number; isCurrentLocation: boolean } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);
    const [fetchingAddress, setFetchingAddress] = useState(false);
    const [fetchedAddress, setFetchedAddress] = useState<string | null>(null);

    const handleSelect = (lat: number, lng: number) => {
        setSelectedPos({ lat, lng, isCurrentLocation: false });
        onLocationSelect(lat, lng);
        setError(null);
        setFetchedAddress(null);
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        setFetchingAddress(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                {
                    headers: {
                        'User-Agent': 'FindMyStuff-App/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch address');
            }

            const data = await response.json();
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            setFetchedAddress(address);

            // Call the callback to update parent form
            if (onAddressChange) {
                onAddressChange(address);
            }
        } catch (err) {
            console.error('Reverse geocoding error:', err);
            setFetchedAddress(null);
            // Fallback to coordinates
            if (onAddressChange) {
                onAddressChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            }
        } finally {
            setFetchingAddress(false);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLoading(true);
        setError(null);
        setFetchedAddress(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setSelectedPos({ lat, lng, isCurrentLocation: true });
                setMapCenter([lat, lng]);
                onLocationSelect(lat, lng);
                setLoading(false);

                // Fetch address after getting location
                await reverseGeocode(lat, lng);
            },
            (err) => {
                setLoading(false);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Location permission denied. Please enable location access.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information unavailable.");
                        break;
                    case err.TIMEOUT:
                        setError("Location request timed out.");
                        break;
                    default:
                        setError("An unknown error occurred.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return (
        <div className="space-y-3">
            {/* Use Current Location Button */}
            <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={loading}
                className="premium-button premium-button-ghost w-full flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <span className="animate-spin">⟳</span>
                        Detecting location...
                    </>
                ) : (
                    <>
                        📍 Use Current Location
                    </>
                )}
            </button>

            {/* Success Message */}
            {selectedPos?.isCurrentLocation && !error && (
                <div className="premium-card bg-[var(--success-dim)] border-[var(--success)] text-[var(--success)] text-sm">
                    <div className="flex items-center gap-2">
                        <span>✓</span>
                        <span>Current location detected</span>
                    </div>
                    {fetchingAddress && (
                        <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                            <span className="animate-spin">⟳</span>
                            <span>Fetching address...</span>
                        </div>
                    )}
                    {fetchedAddress && !fetchingAddress && (
                        <div className="mt-2 text-xs opacity-90">
                            📍 {fetchedAddress}
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="premium-card bg-[var(--danger-dim)] border-[var(--danger)] text-[var(--danger)] text-sm">
                    {error}
                </div>
            )}

            {/* Map */}
            <div className="h-64 w-full rounded-lg overflow-hidden border border-[var(--secondary)] relative">
                <Map
                    center={mapCenter}
                    zoom={selectedPos ? 15 : 13}
                    onLocationSelect={handleSelect}
                    markers={selectedPos ? [{
                        ...selectedPos,
                        title: selectedPos.isCurrentLocation ? "Your Current Location" : "Selected Location"
                    }] : []}
                />
                {!selectedPos && (
                    <div className="absolute top-2 left-2 bg-white/80 p-2 rounded text-xs z-[1000]">
                        Click on map to pin location
                    </div>
                )}
            </div>
        </div>
    );
}
