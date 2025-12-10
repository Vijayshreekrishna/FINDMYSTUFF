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
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-blue-400 bg-blue-500/20 text-blue-50 hover:bg-blue-500/30 transition-colors border-thin"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

export default function Navbar() {
    const [scrolled, setScrolled] = React.useState(false);
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

    return (
        <header
            className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
                ? "border-b border-blue-600/20 bg-gradient-to-r from-blue-600/70 to-amber-500/70 backdrop-blur-md shadow-sm"
                : "border-b border-transparent bg-gradient-to-r from-blue-600/70 to-amber-500/70"
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
                    <button className="hidden rounded-xl border border-blue-400 bg-blue-500/20 px-3 py-1.5 text-sm text-blue-50 hover:bg-blue-500/30 sm:inline-flex items-center gap-1 transition-colors border-thin"><Bell size={16} />Alerts</button>

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
                                className="rounded-xl border border-blue-400 bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-50 hover:bg-blue-500/30 transition-colors border-thin"
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
