"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon: Icon, ...props }, ref) => {
        return (
            <div className="space-y-1 w-full">
                {label && (
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                            <Icon size={18} />
                        </div>
                    )}
                    <input
                        type={type}
                        className={cn(
                            "flex h-[var(--input-height)] w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-input)] px-4 text-sm text-white placeholder:text-[var(--text-secondary)]/50 focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                            Icon && "pl-11",
                            error && "border-[var(--danger)]",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-[var(--danger)] font-medium">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
