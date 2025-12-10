"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed");
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
                    <span className="text-4xl">📝</span>
                </div>
            </div>

            {/* Bottom Section (White Sheet) - Takes content height */}
            <div className="w-full bg-white rounded-t-[40px] px-8 pt-12 pb-8 flex flex-col z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] text-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm mx-auto space-y-6"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-blue-900">Sign Up</h1>
                        <p className="text-gray-400 text-sm mt-1">Create your FindMyStuff account</p>
                    </div>

                    <Card variant="default" className="p-6 space-y-6 border-none shadow-none bg-transparent">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-blue-500 ml-1 uppercase tracking-wide">Full Name</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
                                        <UserIcon size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        required
                                        className="w-full h-14 pl-12 pr-4 bg-blue-50/50 rounded-2xl border-none outline-none text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                        placeholder="Create a password"
                                        required
                                        className="w-full h-14 pl-12 pr-4 bg-blue-50/50 rounded-2xl border-none outline-none text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 className="animate-spin" />}
                                Sign Up
                            </button>
                        </form>
                    </Card>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400 font-medium">
                            Already have an account? <Link href="/login" className="text-blue-500 font-bold cursor-pointer">Log In</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
