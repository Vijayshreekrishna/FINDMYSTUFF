"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: "primary" | "ghost" | "danger" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-glow",
            ghost: "bg-transparent text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]",
            danger: "bg-[var(--danger)] text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
            outline: "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        };

        const sizes = {
            sm: "h-9 px-3 text-xs",
            md: "h-11 px-6 text-sm",
            lg: "h-14 px-8 text-base",
            icon: "h-10 w-10 p-2",
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </div>
                ) : null}
                <span className={cn("flex items-center gap-2", isLoading && "invisible")}>
                    {children}
                </span>
            </motion.button>
        );
    }
);
Button.displayName = "Button";

export { Button };
