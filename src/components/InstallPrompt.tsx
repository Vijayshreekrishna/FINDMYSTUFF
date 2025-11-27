"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Download, X } from "lucide-react";

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
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-20 md:bottom-4 right-4 left-4 md:left-auto z-50 max-w-sm md:ml-auto"
                >
                    <Card variant="glass" className="p-6 shadow-premium border-[var(--accent)]/20 backdrop-blur-xl relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent pointer-events-none" />

                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--surface)]/50 hover:bg-[var(--surface)] flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4 text-[var(--text-secondary)]" />
                        </button>

                        <div className="flex items-start gap-4 relative">
                            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center text-2xl border border-[var(--accent)]/30">
                                📱
                            </div>
                            <div className="flex-1 pr-6">
                                <h3 className="font-bold text-white mb-1 text-lg">Install FindMyStuff</h3>
                                <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
                                    Install our app for quick access and offline support
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleInstall}
                                        size="sm"
                                        className="shadow-glow"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Install
                                    </Button>
                                    <Button
                                        onClick={handleDismiss}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Not Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
