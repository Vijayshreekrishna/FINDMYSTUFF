import React from "react";
import { MapPin, Calendar, Camera } from "lucide-react";

export const Filters = () => (
    <div className="flex flex-wrap items-center gap-2">
        <button className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 bg-white">
            <MapPin size={16} />Location
        </button>
        <button className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 bg-white">
            <Calendar size={16} />Date
        </button>
        <button className="inline-flex items-center gap-1 rounded-xl border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 bg-white">
            <Camera size={16} />With photo
        </button>
    </div>
);
