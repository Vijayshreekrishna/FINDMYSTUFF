"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search as SearchIcon, PlusCircle, CheckCircle2, UserCircle, Bell, LogIn, LayoutList } from "lucide-react";
import { Container } from "@/components/Wrappers";

import { useSession, signOut } from "next-auth/react";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />; // Placeholder to prevent layout shift
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-blue-400 dark:border-zinc-600 bg-blue-500/20 dark:bg-zinc-700/50 text-blue-50 dark:text-gray-200 hover:bg-blue-500/30 dark:hover:bg-zinc-600/50 transition-colors border-thin"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

export default function Navbar() {
    const [scrolled, setScrolled] = React.useState(false);
    const [notificationCount, setNotificationCount] = React.useState(0);
    const [alertsEnabled, setAlertsEnabled] = React.useState(true); // Default to true
    const pathname = usePathname();
    const { data: session } = useSession();

    const navLinkClass = (path: string) =>
        `flex items-center gap-1 text-sm font-medium transition-colors ${pathname === path ? "text-white" : "text-blue-100 hover:text-white"}`;

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Load alerts preference and fetch notification count
    React.useEffect(() => {
        // Load alerts preference from localStorage (default to true)
        const savedPreference = localStorage.getItem('alertsEnabled');
        setAlertsEnabled(savedPreference === null ? true : savedPreference === 'true');

        if (session?.user) {
            fetchNotificationCount();
            // Poll every 30 seconds for updates
            const interval = setInterval(fetchNotificationCount, 30000);
            return () => clearInterval(interval);
        }
    }, [session]);

    // Listen for storage changes (when toggle is changed in profile page)
    React.useEffect(() => {
        const handleStorageChange = () => {
            const savedPreference = localStorage.getItem('alertsEnabled');
            setAlertsEnabled(savedPreference === null ? true : savedPreference === 'true');
        };
        window.addEventListener('storage', handleStorageChange);
        // Also listen for custom event for same-tab updates
        window.addEventListener('alertsToggled', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('alertsToggled', handleStorageChange);
        };
    }, []);

    // Clear notifications when visiting claims page
    React.useEffect(() => {
        if (pathname === '/profile/claims') {
            setNotificationCount(0);
        }
    }, [pathname]);

    const fetchNotificationCount = async () => {
        try {
            const res = await fetch('/api/notifications/count');
            const data = await res.json();
            setNotificationCount(data.count || 0);
        } catch (error) {
            console.error('Failed to fetch notification count:', error);
        }
    };

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
                ? "border-b border-blue-600/20 dark:border-zinc-700 bg-gradient-to-r from-blue-600/70 to-amber-500/70 dark:from-zinc-800 dark:to-zinc-900 backdrop-blur-md shadow-sm"
                : "border-b border-transparent bg-gradient-to-r from-blue-600/70 to-amber-500/70 dark:from-zinc-800 dark:to-zinc-900"
                }`}
        >
            <Container className="flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-blue-600">🔎</span>
                    <span className="text-lg font-semibold text-white">FindMyStuff</span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    <Link href="/" className={navLinkClass("/")}><Home size={18} />Home</Link>
                    <Link href="/feed" className={navLinkClass("/feed")}><LayoutList size={18} />Feed</Link>
                    <Link href="/report" className={navLinkClass("/report")}><PlusCircle size={18} />Report</Link>
                    {/* <Link href="/matches" className={navLinkClass("/matches")}><CheckCircle2 size={18} />Matches</Link> */}
                    <Link href="/profile" className={navLinkClass("/profile")}><UserCircle size={18} />Profile</Link>
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Link
                        href="/profile/claims"
                        className="hidden rounded-xl border border-blue-400 dark:border-zinc-600 bg-blue-500/20 dark:bg-zinc-700/50 px-3 py-1.5 text-sm text-blue-50 dark:text-gray-200 hover:bg-blue-500/30 dark:hover:bg-zinc-600/50 sm:inline-flex items-center gap-1 transition-colors border-thin relative"
                    >
                        <Bell size={16} />
                        Alerts
                        {alertsEnabled && notificationCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                        )}
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-sm font-medium text-white">{session.user?.name?.split(" ")[0]}</div>
                            {session.user?.image ? (
                                <img src={session.user.image} alt="Profile" className="h-8 w-8 rounded-full border-2 border-white/20" />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">{session.user?.name?.[0]}</div>
                            )}
                            <button
                                onClick={() => signOut()}
                                className="rounded-xl border border-blue-400 dark:border-zinc-600 bg-blue-500/20 dark:bg-zinc-700/50 px-3 py-1.5 text-sm font-medium text-blue-50 dark:text-gray-200 hover:bg-blue-500/30 dark:hover:bg-zinc-600/50 transition-colors border-thin"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 inline-flex items-center gap-1 transition-colors shadow-sm">
                            <LogIn size={16} />Sign in
                        </Link>
                    )}
                </div>
            </Container>
        </header>
    );
};
