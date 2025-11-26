"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/post-card";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import FilterBar from "@/components/FilterBar";
import { useDebounce } from "@/hooks/useDebounce";

export default function FeedContent() {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("all");
    const [loading, setLoading] = useState(true);

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        fetchPosts();
    }, [debouncedSearch, category, type]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (type !== "all") params.append("type", type);
            if (category) params.append("category", category);
            if (debouncedSearch) params.append("search", debouncedSearch);

            const res = await fetch(`/api/posts?${params.toString()}`);
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setCategory("");
        setType("all");
    };

    return (
        <div className="min-h-screen">
            {/* Sticky Header Section - Minimal with breathing room */}
            <div className="sticky top-16 z-40 backdrop-blur-xl bg-[var(--background)]/80 border-b border-[var(--border)]">
                <div className="container max-w-6xl py-6 md:py-8">
                    <div className="space-y-6">
                        {/* Minimal Top Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    Discover Items
                                </h1>
                                {!loading && (
                                    <p className="text-sm text-[var(--text-dim)] mt-1">
                                        {posts.length} items available
                                    </p>
                                )}
                            </div>
                            <Link href="/report">
                                <button className="premium-button premium-button-primary text-sm">
                                    + New Report
                                </button>
                            </Link>
                        </div>

                        {/* Minimal Search */}
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Search items..."
                        />

                        {/* Minimal Filters */}
                        <FilterBar
                            category={category}
                            type={type}
                            onCategoryChange={setCategory}
                            onTypeChange={setType}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content - Centered with breathing room */}
            <div className="container max-w-6xl py-8 md:py-12">
                {/* Loading State */}
                {loading ? (
                    <div className="grid-responsive">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="skeleton h-96 rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Posts Grid */}
                        {posts.length > 0 ? (
                            <div className="grid-responsive animate-fade-in">
                                {posts.map((post: any) => (
                                    <PostCard key={post._id} post={post} onDelete={fetchPosts} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 animate-fade-in">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="text-5xl opacity-50">🔍</div>
                                    <h3 className="text-xl font-semibold text-white">
                                        No items found
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Try adjusting your filters
                                    </p>
                                    {(search || category || type !== "all") && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="premium-button premium-button-ghost text-sm mt-4"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
