"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export const BottomNav = () => {
    const { isStandalone } = usePWA();
    const pathname = usePathname();
    const [isOverlappingFooter, setIsOverlappingFooter] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    // All hooks must be called before any conditional returns
    useEffect(() => {
        // Only run the effect if in standalone mode
        if (!isStandalone) return;

        const footer = document.querySelector('footer');
        const navElement = navRef.current;

        if (!footer || !navElement) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Check if the footer is intersecting with the viewport
                // and if the nav element is overlapping with it
                if (entry.isIntersecting) {
                    const footerRect = footer.getBoundingClientRect();
                    const navRect = navElement.getBoundingClientRect();

                    // Check if nav bottom overlaps with footer top
                    const isOverlapping = navRect.bottom > footerRect.top;
                    setIsOverlappingFooter(isOverlapping);
                } else {
                    setIsOverlappingFooter(false);
                }
            },
            {
                threshold: [0, 0.1, 0.5, 1],
                rootMargin: '0px'
            }
        );

        observer.observe(footer);

        // Also add scroll listener for more precise detection
        const handleScroll = () => {
            if (!footer || !navElement) return;

            const footerRect = footer.getBoundingClientRect();
            const navRect = navElement.getBoundingClientRect();

            const isOverlapping = navRect.bottom > footerRect.top;
            setIsOverlappingFooter(isOverlapping);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isStandalone]);

    // Only show in standalone PWA mode - conditional return AFTER all hooks
    if (!isStandalone) return null;

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Search", href: "/feed" },
        { icon: PlusCircle, label: "Report", href: "/report" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    return (
        <div
            ref={navRef}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md transition-opacity duration-300"
            style={{ opacity: isOverlappingFooter ? 0.4 : 1 }}
        >
            <div className="flex items-center justify-around rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-lg border border-gray-200 dark:border-zinc-700 shadow-xl p-2 px-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const shouldOutline = isOverlappingFooter;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${isActive
                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                        >
                            <item.icon
                                size={24}
                                className={!shouldOutline && isActive ? "fill-current" : ""}
                                strokeWidth={shouldOutline ? 1.5 : 2}
                                fill={shouldOutline ? "none" : undefined}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
