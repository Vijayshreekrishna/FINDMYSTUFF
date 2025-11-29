"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "elevated" | "glass";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const baseStyles = "rounded-[var(--radius-lg)] border border-[var(--border)] p-[var(--space-2)] transition-all";

        const variants = {
            default: "bg-[var(--surface)]",
            elevated: "bg-[var(--surface)] shadow-xl",
            glass: "bg-[var(--surface)]/60 backdrop-blur-lg"
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
