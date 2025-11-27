"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: "default" | "glass" | "elevated";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const variants = {
            default: "bg-[var(--surface)] border-[var(--border)]",
            glass: "bg-black/40 backdrop-blur-xl border-white/10",
            elevated: "bg-[var(--surface-elevated)] border-[var(--border-hover)] shadow-xl",
        };

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "rounded-2xl border p-6 transition-all duration-300 hover:shadow-glow hover:border-[var(--accent-dim)]",
                    variants[variant],
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
Card.displayName = "Card";

export { Card };
