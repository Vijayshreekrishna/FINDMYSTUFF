"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/Wrappers";
import { Download } from "lucide-react";

export const Footer = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        // Check if already in standalone mode (PWA installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(!isStandalone);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowInstallButton(false);
        }
        setDeferredPrompt(null);
    };

    return (
        <footer className="border-t border-blue-700 bg-gradient-to-r from-amber-500/70 to-blue-600/70 py-8">
            <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-blue-100">© {new Date().getFullYear()} FindMyStuff</p>
                <div className="flex gap-4 text-sm text-blue-100 items-center">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <Link href="/feed" className="hover:text-white transition-colors">Feed</Link>
                    <Link href="/report" className="hover:text-white transition-colors">Report</Link>
                    <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
                    {showInstallButton && (
                        <button
                            onClick={handleInstallClick}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors border border-white/30"
                            title="Install App"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Install App</span>
                        </button>
                    )}
                </div>
            </Container>
        </footer>
    );
};
