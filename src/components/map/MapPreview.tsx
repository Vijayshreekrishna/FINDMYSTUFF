"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, LatLngBounds } from "leaflet";
import { X, MapPin, Package } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapItem {
    _id: string;
    title: string;
    type: "lost" | "found";
    category: string;
    location: {
        lat: number;
        lng: number;
        address?: string;
    };
    images?: string[];
}

interface MapPreviewProps {
    items: MapItem[];
}

// Custom marker icons with better design
const createCustomIcon = (color: string, type: string) => {
    return divIcon({
        html: `
            <div class="custom-marker" style="background-color: ${color};">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    ${type === 'lost'
                ? '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>'
                : '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1 13v-6h2v6h-2zm0-8V5h2v2h-2z"/>'
            }
                </svg>
            </div>
        `,
        className: "custom-marker-wrapper",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
};

const lostIcon = createCustomIcon("#ef4444", "lost");
const foundIcon = createCustomIcon("#22c55e", "found");

// Custom cluster icon
const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    return divIcon({
        html: `<div class="cluster-icon">${count}</div>`,
        className: "custom-marker-cluster",
        iconSize: [40, 40]
    });
};

// Component to fit bounds to markers
function FitBounds({ items }: { items: MapItem[] }) {
    const map = useMap();

    useEffect(() => {
        if (items.length > 0) {
            const bounds = new LatLngBounds(
                items.map(item => [item.location.lat, item.location.lng] as [number, number])
            );
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
    }, [items, map]);

    return null;
}

export default function MapPreview({ items }: MapPreviewProps) {
    const [showFullMap, setShowFullMap] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

    // Filter items with valid locations
    const validItems = items.filter(item =>
        item.location?.lat &&
        item.location?.lng &&
        !isNaN(item.location.lat) &&
        !isNaN(item.location.lng)
    );

    if (validItems.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 shadow-sm text-center">
                <MapPin className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="text-gray-600 dark:text-gray-400">No items with location data available</p>
            </div>
        );
    }

    // Calculate center from all markers
    const center: [number, number] = validItems.length > 0
        ? [
            validItems.reduce((sum, item) => sum + item.location.lat, 0) / validItems.length,
            validItems.reduce((sum, item) => sum + item.location.lng, 0) / validItems.length
        ]
        : [0, 0];

    return (
        <>
            {/* Preview Map */}
            <div
                className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow group relative"
                onClick={() => setShowFullMap(true)}
                style={{ zIndex: 1 }}
            >
                <div className="relative h-[300px]">
                    <MapContainer
                        center={[0, 0]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                        scrollWheelZoom={false}
                        dragging={false}
                        zoomControl={false}
                        doubleClickZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <FitBounds items={validItems} />
                        <MarkerClusterGroup
                            chunkedLoading
                            iconCreateFunction={createClusterCustomIcon}
                        >
                            {validItems.map((item) => (
                                <Marker
                                    key={item._id}
                                    position={[item.location.lat, item.location.lng]}
                                    icon={item.type === "lost" ? lostIcon : foundIcon}
                                >
                                    <Popup>
                                        <div className="p-2">
                                            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                                            <p className="text-xs text-gray-600 capitalize">{item.type} • {item.category}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MarkerClusterGroup>
                    </MapContainer>

                    {/* Overlay hint */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-zinc-800 px-4 py-2 rounded-full shadow-lg">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Click to view full map</p>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="p-4 border-t border-gray-200 dark:border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-600 dark:text-gray-400">Lost Items</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-600 dark:text-gray-400">Found Items</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{validItems.length} items</p>
                </div>
            </div>

            {/* Full Map Modal */}
            {showFullMap && (
                <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Items Near You</h2>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFullMap(false);
                                }}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X size={20} className="text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Map */}
                        <div className="flex-1 relative">
                            <MapContainer
                                center={[0, 0]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                                scrollWheelZoom={true}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <FitBounds items={validItems} />
                                <MarkerClusterGroup
                                    chunkedLoading
                                    iconCreateFunction={createClusterCustomIcon}
                                >
                                    {validItems.map((item) => (
                                        <Marker
                                            key={item._id}
                                            position={[item.location.lat, item.location.lng]}
                                            icon={item.type === "lost" ? lostIcon : foundIcon}
                                            eventHandlers={{
                                                click: () => setSelectedItem(item)
                                            }}
                                        >
                                            <Popup>
                                                <div className="p-2 min-w-[200px]">
                                                    {item.images?.[0] && (
                                                        <img
                                                            src={item.images[0]}
                                                            alt={item.title}
                                                            className="w-full h-32 object-cover rounded-lg mb-2"
                                                        />
                                                    )}
                                                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                                                    <p className="text-xs text-gray-600 capitalize mb-2">{item.type} • {item.category}</p>
                                                    {item.location.address && (
                                                        <p className="text-xs text-gray-500">{item.location.address}</p>
                                                    )}
                                                    <a
                                                        href={`/feed/${item._id}`}
                                                        className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                                                    >
                                                        View Details →
                                                    </a>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MarkerClusterGroup>
                            </MapContainer>
                        </div>

                        {/* Legend */}
                        <div className="p-4 border-t border-gray-200 dark:border-zinc-700 flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Lost Items</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Found Items</span>
                            </div>
                            <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                                Total: {validItems.length} items
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-marker-cluster {
                    background: transparent;
                    border: none;
                }
                .cluster-icon {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border: 3px solid white;
                }
                .custom-marker-wrapper {
                    background: transparent;
                    border: none;
                }
                .custom-marker {
                    width: 36px;
                    height: 36px;
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
                    border: 2px solid white;
                }
                .custom-marker svg {
                    transform: rotate(45deg);
                }
            `}</style>
        </>
    );
}
