"use client";

import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Download, Smartphone, Monitor } from "lucide-react";
import { motion } from "framer-motion";

import { BottomNav } from "@/components/BottomNav";

export default function PWAEnforcer({ children }: { children: React.ReactNode }) {
    const { isStandalone, isInstallable, installApp } = usePWA();

    // TEMPORARY: Allow desktop access (just wrapper for now)
    return (
        <>
            {children}
            <BottomNav />
        </>
    );
}
