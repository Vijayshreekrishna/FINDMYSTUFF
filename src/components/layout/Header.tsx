"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Search, PlusCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Lock scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [isMobileMenuOpen]);

    const navLinks = [
        { href: "/", label: "Home", icon: Home },
        { href: "/feed", label: "Discover", icon: Search },
        { href: "/report", label: "Report", icon: PlusCircle },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 h-[var(--navbar-height)] bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="container h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[#b280ff] flex items-center justify-center text-white font-bold text-sm">
                            F
                        </div>
                        <span className="font-bold text-base text-white hidden sm:block">FindMyStuff</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${pathname === link.href ? "text-white" : "text-[var(--text-secondary)] hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-[var(--text-secondary)]">{session.user?.name?.split(" ")[0]}</span>
                                {session.user?.image && (
                                    <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full border border-[var(--border)]" />
                                )}
                                <button onClick={() => signOut()} className="text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Button size="sm" onClick={() => signIn("google")}>Sign In</Button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[70%] max-w-[280px] bg-[var(--surface)] border-l border-[var(--border)] z-50 md:hidden flex flex-col"
                        >
                            {/* Close Button */}
                            <div className="flex justify-end p-4 border-b border-[var(--border)]">
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex flex-col p-4 gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === link.href
                                                ? "bg-[var(--accent)] text-white"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--background)] hover:text-white"
                                            }`}
                                    >
                                        <link.icon size={20} />
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Auth Section */}
                            <div className="mt-auto p-4 border-t border-[var(--border)]">
                                {session ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            {session.user?.image && (
                                                <img src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full border border-[var(--border)]" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                                                <p className="text-xs text-[var(--text-secondary)] truncate">{session.user?.email}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="w-full justify-start text-[var(--danger)]" onClick={() => signOut()}>
                                            <LogOut size={18} className="mr-2" />
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <Button className="w-full" onClick={() => signIn("google")}>Sign In</Button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
