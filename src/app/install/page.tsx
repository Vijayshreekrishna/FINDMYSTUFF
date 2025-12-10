"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone, Monitor, CheckCircle, Zap, Shield, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export default function InstallPage() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

    useEffect(() => {
        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else if (/android/.test(userAgent)) {
            setPlatform('android');
        } else {
            setPlatform('desktop');
        }

        // Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            // Set cookie to bypass middleware
            document.cookie = 'pwa-installed=true; path=/; max-age=31536000';
            window.location.href = '/';
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            document.cookie = 'pwa-installed=true; path=/; max-age=31536000';
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        }

        setDeferredPrompt(null);
    };

    const features = [
        { icon: Zap, title: "Lightning Fast", desc: "Instant loading and smooth performance" },
        { icon: Wifi, title: "Offline Access", desc: "Use the app even without internet" },
        { icon: Shield, title: "Secure & Private", desc: "Your data stays safe and encrypted" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl shadow-lg flex items-center justify-center"
                        >
                            <Smartphone className="w-12 h-12 text-blue-600" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                            Install FindMyStuff
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Get the best experience with our Progressive Web App. Fast, reliable, and works offline!
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                            >
                                <feature.icon className="w-10 h-10 text-white mb-4" />
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-white/70 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Install Button */}
                    {isInstallable ? (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={handleInstall}
                            className="w-full bg-white text-blue-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg"
                        >
                            <Download className="w-6 h-6" />
                            Install Now
                        </motion.button>
                    ) : (
                        <div className="space-y-6">
                            {/* Platform-specific instructions */}
                            {platform === 'ios' && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-xl font-bold text-white mb-4">Install on iOS</h3>
                                    <ol className="space-y-3 text-white/80">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">1</span>
                                            <span>Tap the Share button at the bottom of Safari</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">2</span>
                                            <span>Scroll down and tap "Add to Home Screen"</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">3</span>
                                            <span>Tap "Add" in the top right corner</span>
                                        </li>
                                    </ol>
                                </div>
                            )}

                            {platform === 'android' && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-xl font-bold text-white mb-4">Install on Android</h3>
                                    <ol className="space-y-3 text-white/80">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">1</span>
                                            <span>Tap the menu button (three dots) in Chrome</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">2</span>
                                            <span>Tap "Install app" or "Add to Home screen"</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">3</span>
                                            <span>Tap "Install" to confirm</span>
                                        </li>
                                    </ol>
                                </div>
                            )}

                            {platform === 'desktop' && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-xl font-bold text-white mb-4">Install on Desktop</h3>
                                    <ol className="space-y-3 text-white/80">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">1</span>
                                            <span>Look for the install icon in your browser's address bar</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">2</span>
                                            <span>Click "Install" when prompted</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">3</span>
                                            <span>The app will open in its own window</span>
                                        </li>
                                    </ol>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <p className="text-center text-white/60 text-sm mt-8">
                        Installing the app gives you the best experience with faster loading and offline access
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
