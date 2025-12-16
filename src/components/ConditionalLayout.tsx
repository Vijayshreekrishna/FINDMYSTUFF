"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Aurora from "@/components/ui/Aurora";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isInstallPage = pathname === "/install";

    if (isInstallPage) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Aurora Background - Fixed position behind all content */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <Aurora
                    amplitude={1.0}
                    blend={0.5}
                    speed={0.3}
                />
            </div>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}

