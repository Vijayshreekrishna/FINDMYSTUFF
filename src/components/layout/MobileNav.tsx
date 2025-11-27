"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, PlusCircle, User, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession, signIn, signOut } from "next-auth/react";

export function MobileNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    const navItems = [
        {
            name: "Feed",
            href: "/feed",
            icon: Home,
        },
        {
            name: "Report",
            href: "/report",
            icon: PlusCircle,
        },
        {
            name: "Profile",
            href: "/profile",
            icon: User,
        },
    ];

    const handleAuthClick = () => {
        if (session) {
            signOut({ callbackUrl: "/" });
        } else {
            signIn("google");
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="glass-elevated pb-safe pt-2 px-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between h-16">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.name}
                                onClick={() => router.push(item.href)}
                                className="relative flex flex-col items-center justify-center w-full h-full space-y-1"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute -top-2 w-12 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <item.icon
                                    size={24}
                                    className={cn(
                                        "transition-colors duration-200",
                                        isActive ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-[10px] font-medium transition-colors duration-200",
                                        isActive ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                                    )}
                                >
                                    {item.name}
                                </span>
                            </button>
                        );
                    })}

                    {/* Auth Button */}
                    <button
                        onClick={handleAuthClick}
                        className="relative flex flex-col items-center justify-center w-full h-full space-y-1"
                    >
                        {status === "loading" ? (
                            <div className="w-6 h-6 rounded-full bg-[var(--surface)] animate-pulse" />
                        ) : session ? (
                            <>
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt="User"
                                        className="w-6 h-6 rounded-full border-2 border-[var(--accent)]"
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center border-2 border-[var(--accent)]">
                                        <User className="w-3 h-3 text-[var(--accent)]" />
                                    </div>
                                )}
                                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                                    Sign Out
                                </span>
                            </>
                        ) : (
                            <>
                                <LogIn size={24} className="text-[var(--text-secondary)]" />
                                <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                                    Sign In
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
