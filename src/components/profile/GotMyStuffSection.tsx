"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Calendar, MapPin, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { NewtonsCradle } from "@/components/ui/NewtonsCradle";

interface GotMyStuffItem {
    id: string;
    post: {
        _id: string;
        title: string;
        image: string | null;
        type: string;
        category: string;
        location: string;
        finder: string;
    };
    completedAt: string;
    claimedAt: string;
}

export default function GotMyStuffSection() {
    const [items, setItems] = useState<GotMyStuffItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGotMyStuff();
    }, []);

    const fetchGotMyStuff = async () => {
        try {
            const res = await fetch('/api/claims/gotmystuff');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Error fetching GotMyStuff:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <NewtonsCradle size={50} color="#84cc16" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-16 bg-white dark:bg-zinc-800 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700">
                <Sparkles className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">No items recovered yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Successfully claimed items will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="text-green-500" size={20} />
                    GotMyStuff ({items.length})
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 p-4 hover:shadow-md transition-all group"
                    >
                        <div className="flex gap-4">
                            {/* Image */}
                            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-zinc-700 rounded-xl overflow-hidden">
                                {item.post.image ? (
                                    <img
                                        src={item.post.image}
                                        alt={item.post.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="text-gray-400 dark:text-gray-500" size={32} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {item.post.title}
                                </h4>

                                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Package size={12} />
                                        <span className="capitalize">{item.post.type} • {item.post.category}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        <span className="truncate">{item.post.location}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>Completed {format(new Date(item.completedAt), 'MMM d, yyyy')}</span>
                                    </div>
                                </div>

                                <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                                    <Sparkles size={12} />
                                    Successfully Returned
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
