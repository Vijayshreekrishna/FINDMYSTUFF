"use client";

import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Download, Smartphone, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function PWAEnforcer({ children }: { children: React.ReactNode }) {
    const { isStandalone, isInstallable, installApp } = usePWA();

    // If running in standalone mode (PWA), render the app
    if (isStandalone) {
        return <>{children}</>;
    }

    // Otherwise, show the install prompt screen
    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <Card variant="glass" className="p-8 text-center space-y-6 border-[var(--accent)]/20 shadow-premium">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#b280ff] flex items-center justify-center shadow-glow">
                        <Smartphone className="w-10 h-10 text-white" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-white">App Installation Required</h1>
                        <p className="text-[var(--text-secondary)]">
                            FindMyStuff is designed to be used as an installed application for the best experience.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        {isInstallable ? (
                            <Button
                                onClick={installApp}
                                size="lg"
                                className="w-full shadow-glow animate-pulse-slow"
                            >
                                <Download className="mr-2 h-5 w-5" />
                                Install App
                            </Button>
                        ) : (
                            <div className="p-4 rounded-lg bg-[var(--surface)]/50 border border-[var(--border)] text-left text-sm space-y-2">
                                <p className="font-medium text-white flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-[var(--accent)]" />
                                    How to install:
                                </p>
                                <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1 pl-1">
                                    <li>Click the share/menu button in your browser</li>
                                    <li>Select "Add to Home Screen" or "Install App"</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-[var(--text-secondary)]/50 pt-4">
                        Please install the app to continue accessing FindMyStuff.
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
