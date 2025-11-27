"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
}

export function PageContainer({
    children,
    className,
    fullWidth = false,
    ...props
}: PageContainerProps) {
    return (
        <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
                "min-h-screen w-full pb-24 pt-4 md:pb-8 md:pt-20", // Mobile bottom padding for nav
                !fullWidth && "container mx-auto px-4 md:px-6 max-w-2xl",
                className
            )}
            {...props}
        >
            {children}
        </motion.main>
    );
}
