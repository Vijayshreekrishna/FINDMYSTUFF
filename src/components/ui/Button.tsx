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
        const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
            secondary: "bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600",
            ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100",
            danger: "bg-red-500 text-white hover:bg-red-600"
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-11 px-5 text-sm",
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
