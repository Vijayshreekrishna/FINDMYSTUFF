"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="relative space-y-1">
                {label && (
                    <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <input
                        type={type}
                        className={cn(
                            "flex h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-dim)] focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_4px_var(--accent-dim)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                            error && "border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:shadow-[0_0_0_4px_var(--danger-dim)]",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 opacity-0 group-hover:opacity-10 -z-10 blur-xl transition-opacity duration-500" />
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-[var(--danger)] ml-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
