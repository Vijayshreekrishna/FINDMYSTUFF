"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-dismissed', 'true');
    };

    if (!showPrompt || localStorage.getItem('pwa-dismissed')) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-in-right">
            <div className="glass-elevated rounded-2xl p-6 shadow-premium">
                <div className="flex items-start gap-4">
                    <div className="text-3xl">📱</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">Install FindMyStuff</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                            Install our app for quick access and offline support
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstall}
                                className="premium-button premium-button-primary px-4 py-2 text-sm"
                            >
                                Install
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="premium-button premium-button-ghost px-4 py-2 text-sm"
                            >
                                Not Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
