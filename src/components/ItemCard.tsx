import React from "react";
import { Check, MapPin } from "lucide-react";

export const ItemCard = ({ data }: { data: any }) => {
    // Determine background style: use image if available, else usage a fallback gradient
    const bgStyle = data.images && data.images.length > 0
        ? { backgroundImage: `url(${data.images[0]})` }
        : { backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };

    return (
        <div
            className="group relative overflow-hidden rounded-[30px] shadow-lg transition-all hover:shadow-xl aspect-[16/10] w-full bg-cover bg-center"
            style={bgStyle}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-medium text-white/80 uppercase tracking-wider mb-1">User Id</p>
                        {/* Status Checkbox-like indicator */}
                    </div>
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                        <Check size={16} className="text-white" />
                    </div>
                </div>

                <div>
                    <p className="text-sm text-white/90 font-light mb-1 line-clamp-1">{data.description || "No description provided..."}</p>
                    <h3 className="text-xl font-bold leading-tight mb-2">{data.title}</h3>

                    {data.location?.address && (
                        <div className="flex items-center gap-1.5 text-xs text-white/70">
                            <MapPin size={12} />
                            <span className="truncate max-w-[150px]">{data.location.address}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
