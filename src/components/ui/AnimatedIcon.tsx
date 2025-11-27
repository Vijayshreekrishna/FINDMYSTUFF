"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps extends HTMLMotionProps<"div"> {
    icon: LucideIcon;
    size?: number;
}

export function AnimatedIcon({ icon: Icon, size = 24, className, ...props }: AnimatedIconProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={cn("flex items-center justify-center", className)}
            {...props}
        >
            <Icon size={size} />
        </motion.div>
    );
}
