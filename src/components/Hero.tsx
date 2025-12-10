"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/Wrappers";
import { SearchBar } from "@/components/SearchBar";

const brand = {
    primary: "text-amber-500",
};

const Stat = ({ number, label }: { number: string; label: string }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-2xl font-bold text-gray-900">{number}</div>
        <div className="text-xs text-gray-500">{label}</div>
    </div>
);

export const Hero = () => (
    <Section>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl"
                >
                    Lost something? <span className={brand.primary}>Find it fast.</span>
                </motion.h1>
                <p className="mt-3 text-lg text-gray-600">
                    A community-driven lost & found with smart matching and location tagging.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/report" className="rounded-2xl bg-blue-600 px-4 py-2.5 text-white shadow hover:bg-blue-700 transition-colors">
                        Report Lost Item
                    </Link>
                    <Link href="/report?type=found" className="rounded-2xl border border-gray-300 px-4 py-2.5 text-gray-800 hover:bg-gray-50 transition-colors">
                        Report Found Item
                    </Link>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 text-center sm:max-w-md">
                    <Stat number="10k+" label="Items posted" />
                    <Stat number="78%" label="Match rate" />
                    <Stat number="24h" label="Median recovery" />
                </div>
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Quick Search</h3>
                <SearchBar compact />
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                        { name: "Electronics", category: "electronics" },
                        { name: "Bags", category: "bags" },
                        { name: "Documents", category: "documents" }
                    ].map((item) => (
                        <Link
                            key={item.category}
                            href={`/feed?category=${item.category}`}
                            className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-center"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </aside>
        </div>
    </Section>
);
