"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "elevated" | "glass";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const baseStyles = "rounded-2xl border border-gray-200 p-4 transition-all";

        const variants = {
            default: "bg-white",
            elevated: "bg-white shadow-lg",
            glass: "bg-white/60 backdrop-blur-lg"
        };

        return (
            <motion.div
                ref={ref}
                className={cn(baseStyles, variants[variant], className)}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";
