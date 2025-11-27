"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-[var(--radius-md)]";

        const variants = {
            primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[0_4px_16px_rgba(164,92,255,0.2)]",
            secondary: "bg-[var(--surface)] text-white border border-[var(--border)] hover:border-[var(--accent)]",
            ghost: "bg-transparent text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface)]",
            danger: "bg-[var(--danger)] text-white hover:bg-red-600"
        };

        const sizes = {
            sm: "h-10 px-4 text-sm",
            md: "h-[var(--button-height)] px-6 text-sm",
            lg: "h-14 px-8 text-base"
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
