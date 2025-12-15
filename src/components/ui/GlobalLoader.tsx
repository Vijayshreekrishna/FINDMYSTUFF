"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NewtonsCradle } from "./NewtonsCradle";

export const GlobalLoader = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Show loader when route changes
        setLoading(true);

        // Hide loader after a short delay (simulating page load)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (!loading) return null;

    return (
        <>
            {/* Top Loading Bar */}
            <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-loading-bar" />
            </div>

            {/* Center Loading Overlay (for longer loads) */}
            <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm pointer-events-none">
                <div className="flex flex-col items-center gap-4">
                    <NewtonsCradle size={60} color="#84cc16" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading...</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading-bar {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                .animate-loading-bar {
                    animation: loading-bar 1s ease-in-out infinite;
                }
            `}</style>
        </>
    );
};

// Simpler top bar only version
export const TopLoadingBar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setLoading(true);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 200);

        // Complete after page loads
        const completeTimer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 200);
        }, 500);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(completeTimer);
        };
    }, [pathname, searchParams]);

    if (!loading && progress === 0) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};
