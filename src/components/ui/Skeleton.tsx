"use client";

import { cn } from "@/lib/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-shimmer rounded-md bg-[var(--surface)]", className)}
            {...props}
        />
    );
}

export { Skeleton };
