"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/Wrappers";
import dynamic from "next/dynamic";

// Dynamically import MapPreview to avoid SSR issues with Leaflet
const MapPreview = dynamic(() => import("@/components/map/MapPreview"), {
    ssr: false,
    loading: () => (
        <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 shadow-sm">
            <div className="h-[400px] bg-gray-100 dark:bg-zinc-700 rounded-xl animate-pulse" />
        </div>
    )
});

const brand = {
    primary: "text-amber-500",
};

const Stat = ({ number, label }: { number: string; label: string }) => (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{number}</div>
        <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">{label}</div>
    </div>
);

interface HeroProps {
    mapItems?: any[];
}

export const Hero = ({ mapItems = [] }: HeroProps) => (
    <Section>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
                >
                    Lost something? <span className={brand.primary}>Find it fast.</span>
                </motion.h1>
                <p className="mt-3 text-lg text-gray-700 dark:text-gray-200 font-medium">
                    A community-driven lost & found with smart matching and location tagging.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/report" className="rounded-2xl bg-blue-600 px-4 py-2.5 text-white shadow hover:bg-blue-700 transition-colors">
                        Report Lost Item
                    </Link>
                    <Link href="/report?type=found" className="rounded-2xl border border-gray-300 dark:border-zinc-600 px-4 py-2.5 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        Report Found Item
                    </Link>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 text-center sm:max-w-md">
                    <Stat number="10k+" label="Items posted" />
                    <Stat number="78%" label="Match rate" />
                    <Stat number="24h" label="Median recovery" />
                </div>
            </div>

            {/* Map Preview */}
            <MapPreview items={mapItems} />
        </div>
    </Section>
);
