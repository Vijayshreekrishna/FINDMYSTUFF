"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export const BottomNav = () => {
    const { isStandalone } = usePWA();
    const pathname = usePathname();

    // Only show in standalone PWA mode
    if (!isStandalone) return null;

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Search", href: "/feed" },
        { icon: PlusCircle, label: "Report", href: "/report" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
            <div className="flex items-center justify-around rounded-full bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl p-2 px-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${isActive
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <item.icon size={24} className={isActive ? "fill-current" : ""} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
