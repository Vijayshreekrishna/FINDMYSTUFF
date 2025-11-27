"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/post-card";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import FilterBar from "@/components/FilterBar";
import { useDebounce } from "@/hooks/useDebounce";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus } from "lucide-react";

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Sticky Header Section */}
            <div className="sticky top-16 md:top-20 z-40 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] transition-all duration-300">
                <div className="container max-w-6xl py-4 md:py-6 px-4 md:px-6">
                    <div className="space-y-6">
                        {/* Top Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                    Discover Items
                                </h1>
                                {!loading && (
                                    <p className="text-xs font-medium text-[var(--accent)] mt-1 uppercase tracking-widest">
                                        {posts.length} items found
                                    </p>
                                )}
                            </div>
                            <Link href="/report">
                                <Button className="shadow-glow">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Report
                                </Button>
                            </Link>
                        </div>

                        {/* Search & Filters */}
                        <div className="space-y-4">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search lost items..."
                            />
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
            </div>

            {/* Main Content */}
            <div className="container max-w-6xl py-8 px-4 md:px-6">
                {/* Loading State */}
                {loading ? (
                    <div className="grid-responsive">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-[320px] w-full rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Posts Grid */}
                        {posts.length > 0 ? (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid-responsive"
                            >
                                {posts.map((post: any) => (
                                    <motion.div key={post._id} variants={item}>
                                        <PostCard post={post} onDelete={fetchPosts} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <div className="max-w-md mx-auto space-y-6">
                                    <div className="text-6xl opacity-20 grayscale">🔍</div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-white">
                                            No items found
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Try adjusting your search or filters to find what you're looking for.
                                        </p>
                                    </div>
                                    {(search || category || type !== "all") && (
                                        <Button
                                            variant="ghost"
                                            onClick={handleClearFilters}
                                        >
                                            Clear Filters
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
