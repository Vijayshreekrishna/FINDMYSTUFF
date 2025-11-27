"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, User as UserIcon, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
    const { data: session, status } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-[var(--background)]/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                    : "bg-[var(--background)]/70 backdrop-blur-xl"
                }`}
        >
            {/* Gradient border effect */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

            <div className="w-full px-6 lg:px-12 h-20 flex items-center justify-between">
                {/* Logo with glow effect */}
                <Link
                    href="/"
                    className="relative group flex items-center gap-2"
                >
                    <div className="absolute -inset-2 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                    <Sparkles className="w-6 h-6 text-[var(--accent)] relative z-10" />
                    <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-[var(--accent)] bg-clip-text text-transparent relative z-10">
                        FindMyStuff
                    </span>
                </Link>

                {/* Right side: Discover + Auth */}
                <div className="flex items-center gap-8">
                    {/* Discover Link with hover effect */}
                    <Link
                        href="/feed"
                        className="relative group text-sm font-semibold text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                        <span className="relative z-10">Discover</span>
                        <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[var(--accent)] to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>

                    {/* Auth Section */}
                    {status === "loading" ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-purple-600/20 animate-pulse" />
                    ) : session ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--surface)]/50 hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 group"
                            >
                                {session.user?.image ? (
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity" />
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="w-8 h-8 rounded-full border-2 border-[var(--accent)] relative z-10"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)]/30 to-purple-600/30 flex items-center justify-center border-2 border-[var(--accent)]">
                                        <UserIcon className="w-4 h-4 text-[var(--accent)]" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-white hidden sm:block">
                                    {session.user?.name?.split(' ')[0]}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowDropdown(false)}
                                        />

                                        {/* Dropdown */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-3 w-64 bg-[var(--surface)]/95 backdrop-blur-xl rounded-2xl border border-[var(--border)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                                        >
                                            {/* User Info */}
                                            <div className="p-4 border-b border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/5 to-purple-600/5">
                                                <p className="text-sm font-semibold text-white">{session.user?.name}</p>
                                                <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{session.user?.email}</p>
                                            </div>

                                            {/* Sign Out Button */}
                                            <button
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    signOut({ callbackUrl: "/" });
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
                                            >
                                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                <span>Sign Out</span>
                                            </button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="relative px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10">Sign In</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.header>
    );
}
