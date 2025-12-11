"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Segment {
    id: string;
    label: string;
    icon?: LucideIcon;
}

interface SegmentedControlProps {
    segments: Segment[];
    activeId: string;
    onChange: (id: string) => void;
    className?: string;
}

export default function SegmentedControl({ segments, activeId, onChange, className = "" }: SegmentedControlProps) {
    return (
        <div className={`inline-flex p-1 bg-[var(--surface)] rounded-[var(--radius-sm)] border border-[var(--border)] ${className}`}>
            {segments.map((segment) => {
                const isActive = activeId === segment.id;
                return (
                    <button
                        key={segment.id}
                        onClick={() => onChange(segment.id)}
                        className={`relative flex items-center justify-center gap-2 px-4 h-[var(--segment-height)] text-sm font-semibold transition-colors rounded-[var(--radius-sm)] ${isActive ? "text-white" : "text-[var(--text-secondary)] hover:text-green-300"
                            }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeSegment"
                                className="absolute inset-0 bg-[var(--accent)] rounded-[var(--radius-sm)]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            {segment.icon && <segment.icon size={16} />}
                            {segment.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
