"use client";

import React, { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const SearchBar = ({ compact = false }: { compact?: boolean }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [query, setQuery] = useState(searchParams.get("q") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        // Reset page to 0 when searching
        params.delete("skip");

        if (query.trim()) {
            params.set("q", query);
        } else {
            params.delete("q");
        }

        // Use current path if it's /feed, otherwise default to /feed
        const targetPath = pathname === "/feed" ? "/feed" : "/feed";
        router.push(`${targetPath}?${params.toString()}`);
    };

    return (
        <div className={`group flex items-center gap-3 rounded-full bg-white shadow-sm border border-gray-100 px-5 transition-all focus-within:shadow-md focus-within:border-blue-200 ${compact ? "py-2" : "py-3"}`}>
            <SearchIcon size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <form onSubmit={handleSearch} className="flex-1">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Item..."
                    className="w-full bg-transparent text-base outline-none text-gray-800 placeholder:text-gray-400 font-medium"
                />
            </form>
            {!compact && (
                <button onClick={handleSearch} className="hidden sm:block text-xs font-bold text-blue-600 uppercase tracking-wide hover:text-blue-700">
                    Search
                </button>
            )}
        </div>
    );
};
