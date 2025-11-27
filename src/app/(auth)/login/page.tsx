"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="p-8 md:p-10 space-y-8 backdrop-blur-xl bg-[var(--surface-elevated)]/80 border-[var(--border)] shadow-2xl">
                    <div className="text-center space-y-3">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-16 h-16 bg-[var(--surface)] rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-glow mb-6 border border-[var(--border)]"
                        >
                            🔍
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm">
                            Sign in to report lost items and help the community.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full h-14 text-base font-semibold shadow-glow group"
                            onClick={() => signIn("google", { callbackUrl: "/feed" })}
                        >
                            <span className="flex items-center gap-3">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </span>
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-[var(--text-dim)]">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
