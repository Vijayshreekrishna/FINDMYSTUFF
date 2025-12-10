"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Smartphone, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function InstallPage() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
    const instructionsRef = useRef<HTMLDivElement>(null);

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

        // Check if in standalone mode (PWA installed and running)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isStandalone) {
            // PWA is installed and running - set cookie and allow access
            document.cookie = 'pwa-installed=true; path=/; max-age=31536000';
            window.location.href = '/';
        } else {
            // Not in standalone mode - clear cookie to force install page
            document.cookie = 'pwa-installed=; path=/; max-age=0';
        }

        // Listen for install prompt
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            // If no prompt available, scroll to instructions
            instructionsRef.current?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

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
        { icon: Download, title: "Lightning Fast", desc: "Instant loading and smooth performance" },
        { icon: Smartphone, title: "Secure & Private", desc: "Your data stays safe and encrypted" },
    ];

    const getInstructions = () => {
        if (platform === 'ios') {
            return [
                { step: 1, text: "Tap the Share button", icon: "📤", detail: "Look for the share icon at the bottom of Safari" },
                { step: 2, text: "Scroll and find 'Add to Home Screen'", icon: "📱", detail: "Scroll down in the share menu" },
                { step: 3, text: "Tap 'Add' to confirm", icon: "✅", detail: "Tap 'Add' in the top right corner" },
            ];
        } else if (platform === 'android') {
            return [
                { step: 1, text: "Tap the menu (⋮)", icon: "⋮", detail: "Look for three dots in Chrome" },
                { step: 2, text: "Select 'Install app'", icon: "📲", detail: "Or 'Add to Home screen'" },
                { step: 3, text: "Tap 'Install'", icon: "✅", detail: "Confirm the installation" },
            ];
        } else {
            return [
                { step: 1, text: "Find install icon", icon: "⬇️", detail: "Look in your browser's address bar" },
                { step: 2, text: "Click 'Install'", icon: "💻", detail: "When the prompt appears" },
                { step: 3, text: "Launch the app", icon: "🚀", detail: "App opens in its own window" },
            ];
        }
    };

    const instructions = getInstructions();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-500 flex items-center justify-center p-4 overflow-auto">
            <div className="max-w-5xl w-full py-8">
                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="w-20 h-20 mx-auto mb-6 bg-white rounded-3xl shadow-lg flex items-center justify-center"
                        >
                            <Smartphone className="w-10 h-10 text-green-600" />
                        </motion.div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
                            Install FindMyStuff
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            Get the best experience with our app!
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 flex items-center gap-4"
                            >
                                <feature.icon className="w-8 h-8 text-white flex-shrink-0" />
                                <div>
                                    <h3 className="text-base font-bold text-white mb-1">{feature.title}</h3>
                                    <p className="text-white/70 text-sm">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Install Button - Always Visible */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleInstall}
                        className="w-full bg-white text-green-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg mb-6"
                    >
                        <Download className="w-6 h-6" />
                        {isInstallable ? 'Install Now' : 'See Installation Steps'}
                        {!isInstallable && <ArrowDown className="w-5 h-5 animate-bounce" />}
                    </motion.button>

                    {/* Installation Steps Flow */}
                    <div ref={instructionsRef} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">
                            {platform === 'ios' ? '📱 iOS Installation' : platform === 'android' ? '🤖 Android Installation' : '💻 Desktop Installation'}
                        </h3>

                        <div className="space-y-4">
                            {instructions.map((instruction, index) => (
                                <motion.div
                                    key={instruction.step}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="relative"
                                >
                                    {/* Connector Line */}
                                    {index < instructions.length - 1 && (
                                        <div className="absolute left-6 top-14 w-0.5 h-8 bg-white/30" />
                                    )}

                                    <div className="flex items-start gap-4">
                                        {/* Step Number Circle */}
                                        <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40">
                                            <span className="text-2xl">{instruction.icon}</span>
                                        </div>

                                        {/* Step Content */}
                                        <div className="flex-1 pt-1">
                                            <h4 className="text-white font-bold text-lg mb-1">
                                                {instruction.text}
                                            </h4>
                                            <p className="text-white/70 text-sm">
                                                {instruction.detail}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-white/70 text-sm mt-8">
                        🚀 Once installed, you'll enjoy faster loading and offline access
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
