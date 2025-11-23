"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map/Map"), { ssr: false });

interface PostMapProps {
    lat: number;
    lng: number;
    address?: string;
}

export default function PostMap({ lat, lng, address }: PostMapProps) {
    return (
        <div className="h-48 w-full rounded-lg overflow-hidden border border-[var(--secondary)]">
            <Map
                center={[lat, lng]}
                zoom={15}
                markers={[{ lat, lng, title: address }]}
                interactive={false}
            />
        </div>
    );
}
