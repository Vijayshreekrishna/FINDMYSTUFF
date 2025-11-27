"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CheckCircle, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
    const features = [
        {
            icon: Search,
            title: "Report Lost Items",
            description: "Quickly report lost items with photos and location details."
        },
        {
            icon: CheckCircle,
            title: "Find What's Lost",
            description: "Browse found items and reunite with your belongings."
        },
        {
            icon: MapPin,
            title: "Location-Based",
            description: "Smart filters to find items near you in the community."
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Hero Section */}
            <section className="container py-[var(--space-8)]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto text-center space-y-6"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Lost Something?
                        <br />
                        <span className="text-gradient">We'll Help You Find It</span>
                    </h1>
                    <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        The premium platform to connect lost items with their owners. Secure, fast, and community-driven.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Link href="/feed">
                            <Button size="lg" className="w-full sm:w-auto">
                                Get Started
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </Link>
                        <Link href="/report">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                Report an Item
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features */}
            <section className="container py-[var(--space-6)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full space-y-3 hover:border-[var(--accent)] transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                                    <feature.icon size={24} className="text-[var(--accent)]" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="container py-[var(--space-6)]">
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">1000+</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Items Found</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">500+</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Active Users</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-bold text-white">50+</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Cities</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
