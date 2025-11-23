"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import Map to avoid SSR issues
const Map = dynamic(() => import("./Map"), { ssr: false });

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
    const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);

    const handleSelect = (lat: number, lng: number) => {
        setSelectedPos({ lat, lng });
        onLocationSelect(lat, lng);
    };

    return (
        <div className="h-64 w-full rounded-lg overflow-hidden border border-[var(--secondary)] relative">
            <Map
                onLocationSelect={handleSelect}
                markers={selectedPos ? [{ ...selectedPos, title: "Selected Location" }] : []}
            />
            {!selectedPos && (
                <div className="absolute top-2 left-2 bg-white/80 p-2 rounded text-xs z-[1000]">
                    Click on map to pin location
                </div>
            )}
        </div>
    );
}
