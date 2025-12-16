"use client";

import { usePWA } from "@/hooks/usePWA";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

export default function PWAEnforcer({ children }: { children: React.ReactNode }) {
    const { isStandalone } = usePWA();
    const pathname = usePathname();

    // Allow install page and auth pages without PWA check
    const isExemptPage = pathname === '/install' ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register');

    // If not in standalone mode and not on exempt page, PWAGuard will handle redirect
    // This component just adds the BottomNav for PWA users
    return (
        <>
            {children}
            {isStandalone && <BottomNav />}
        </>
    );
}
