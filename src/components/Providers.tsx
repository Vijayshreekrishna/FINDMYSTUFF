"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { TopLoadingBar } from "@/components/ui/GlobalLoader";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <Suspense fallback={null}>
                    <TopLoadingBar />
                </Suspense>
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}
