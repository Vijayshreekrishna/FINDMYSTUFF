"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function PWAGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // PWA enforcement disabled - allowing browser usage
    // useEffect(() => {
    //     // Skip check for install page and auth pages
    //     if (pathname === '/install' || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    //         return;
    //     }

    //     // Check if running in standalone mode (PWA installed)
    //     const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    //         (window.navigator as any).standalone || // iOS
    //         document.referrer.includes('android-app://'); // Android

    //     // If not in PWA mode, redirect to install page
    //     if (!isStandalone) {
    //         router.push('/install');
    //     }
    // }, [pathname, router]);

    return <>{children}</>;
}
