"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/");
            }
        } catch (error) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-blue-600 text-white">
            {/* Top Section (Blue) - Takes available space */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[15vh]">
                <div className="mb-4 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">💻</span>
                </div>
                {/* Illustration placeholder */}
                <div className="w-full max-w-[200px] h-32 opacity-20 bg-[url('https://cdn-icons-png.flaticon.com/512/7486/7486747.png')] bg-contain bg-center bg-no-repeat mb-4"></div>
            </div>

            {/* Bottom Section (White Sheet) - Takes content height */}
            <div className="w-full bg-white rounded-t-[40px] px-8 pt-12 pb-8 flex flex-col z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] text-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm mx-auto space-y-6"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-900">Log in</h1>
                        <p className="text-gray-400 text-sm mt-1">Welcome back to FindMyStuff</p>
                    </div>

                    <Card variant="default" className="p-6 space-y-6 border-none shadow-none bg-transparent">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-blue-500 ml-1 uppercase tracking-wide">Email</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        className="w-full h-14 pl-12 pr-4 bg-blue-50/50 rounded-2xl border-none outline-none text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-blue-500 ml-1 uppercase tracking-wide">Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Enter password"
                                        required
                                        className="w-full h-14 pl-12 pr-4 bg-blue-50/50 rounded-2xl border-none outline-none text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end -mt-2">
                                <button type="button" className="text-xs font-medium text-blue-500 hover:text-blue-700">Forgot Password?</button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Logging in..." : "Log In"}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-2">
                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                            <span className="text-gray-400 text-sm font-medium">OR</span>
                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full h-14 bg-white border-2 border-gray-100 hover:bg-gray-50 active:scale-95 text-gray-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 transition-colors" />
                            <svg className="w-6 h-6 z-10" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span className="z-10">Sign in with Google</span>
                        </button>
                    </Card>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400 font-medium">
                            Don't have an account? <Link href="/register" className="text-blue-500 font-bold cursor-pointer hover:underline">Sign Up</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
