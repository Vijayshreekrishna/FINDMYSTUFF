"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, LogOut, User, PlusCircle, Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = [
        { name: "Feed", href: "/feed", icon: Search },
        { name: "Report", href: "/report", icon: PlusCircle },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-white font-bold text-lg shadow-glow group-hover:scale-105 transition-transform">
                        F
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-[var(--accent)] transition-colors">
                        FindMyStuff
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
                        >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Section */}
                <div className="hidden md:flex items-center gap-4">
                    {status === "loading" ? (
                        <div className="h-8 w-8 rounded-full bg-[var(--surface-elevated)] animate-pulse" />
                    ) : session ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--surface-elevated)] transition-colors border border-transparent hover:border-[var(--border)]"
                            >
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        width={32}
                                        height={32}
                                        className="rounded-full ring-2 ring-[var(--surface)]"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--text-secondary)]">
                                        <User className="w-4 h-4" />
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-premium overflow-hidden animate-scale-in origin-top-right">
                                    <div className="p-4 border-b border-[var(--border)]">
                                        <p className="font-medium text-white truncate">
                                            {session.user?.name}
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)] truncate">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                    <div className="p-1">
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-dim)] rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="premium-button premium-button-primary text-sm py-2 px-4 shadow-glow"
                        >
                            Sign In
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-[var(--text-secondary)] hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] animate-fade-in">
                    <div className="p-4 space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-white transition-colors"
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t border-[var(--border)] pt-4 mt-4">
                            {status === "loading" ? (
                                <div className="h-10 w-full rounded-lg bg-[var(--surface-elevated)] animate-pulse" />
                            ) : session ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-3">
                                        {session.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt={session.user.name || "User"}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center">
                                                <User className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">
                                                {session.user?.name}
                                            </p>
                                            <p className="text-xs text-[var(--text-secondary)] truncate">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-[var(--danger-dim)] text-[var(--danger)] font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn("google")}
                                    className="w-full premium-button premium-button-primary"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
