"use client";

import { useState, useEffect } from "react";

export function usePWA() {
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode
        const checkStandalone = () => {
            const isStandaloneMode =
                window.matchMedia("(display-mode: standalone)").matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes("android-app://");

            setIsStandalone(isStandaloneMode);
        };

        checkStandalone();

        // Listen for changes in display mode
        const mediaQuery = window.matchMedia("(display-mode: standalone)");
        const handleChange = (e: MediaQueryListEvent) => {
            setIsStandalone(e.matches);
        };

        try {
            mediaQuery.addEventListener("change", handleChange);
        } catch (e) {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
        }

        // Capture install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            try {
                mediaQuery.removeEventListener("change", handleChange);
            } catch (e) {
                mediaQuery.removeListener(handleChange);
            }
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return { isStandalone, isInstallable, installApp };
}
