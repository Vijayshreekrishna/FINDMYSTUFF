"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "@/components/post-card";
import { useDebounce } from "@/hooks/useDebounce";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, Search as SearchIcon, ChevronDown, Layers, Search, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { Input } from "@/components/ui/Input";

export default function FeedContent() {
    const [posts, setPosts] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("all");
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const observerTarget = useRef(null);

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        // Reset to first page when filters change
        setPage(0);
        setPosts([]);
        setHasMore(true);
        fetchPosts(0, true);
    }, [debouncedSearch, category, type]);

    useEffect(() => {
        // Set up Intersection Observer for infinite scroll
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, loadingMore, page]);

    const fetchPosts = async (pageNum: number, isInitial = false) => {
        if (isInitial) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const params = new URLSearchParams();
            if (type !== "all") params.append("type", type);
            if (category) params.append("category", category);
            if (debouncedSearch) params.append("search", debouncedSearch);
            params.append("skip", (pageNum * 12).toString());
            params.append("limit", "12");

            const res = await fetch(`/api/posts?${params.toString()}`);
            const data = await res.json();

            console.log("API Response:", data);

            // Handle the new response structure
            const postsData = data.posts || [];

            if (isInitial) {
                setPosts(postsData);
            } else {
                // Filter out duplicates by checking if post._id already exists
                setPosts(prev => {
                    const existingIds = new Set(prev.map((p: any) => p._id));
                    const newPosts = postsData.filter((p: any) => !existingIds.has(p._id));
                    return [...prev, ...newPosts];
                });
            }
            setHasMore(data.hasMore || false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = useCallback(() => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, false);
    }, [page, type, category, debouncedSearch]);

    const typeSegments = [
        { id: "all", label: "All", icon: Layers },
        { id: "lost", label: "Lost", icon: Search },
        { id: "found", label: "Found", icon: CheckCircle }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <div className="container py-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Discover Items</h1>
                        {!loading && <p className="text-sm text-[var(--accent)] mt-1">{posts.length} items loaded</p>}
                    </div>
                    <Link href="/report">
                        <Button><Plus size={18} className="mr-2" />New Report</Button>
                    </Link>
                </div>

                {/* Filters - Centered */}
                <div className="flex justify-center">
                    <SegmentedControl segments={typeSegments} activeId={type} onChange={setType} />
                </div>

                {/* Search & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    <Input icon={SearchIcon} placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex h-[var(--input-height)] w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-input)] px-4 text-sm text-white focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Pets">Pets</option>
                            <option value="Documents">Documents</option>
                            <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container pb-8">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <Skeleton key={i} className="h-80 w-full rounded-[var(--radius-lg)]" />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {posts.map((post: any) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Infinite Scroll Trigger & Loading Indicator */}
                        <div ref={observerTarget} className="flex justify-center py-8">
                            {loadingMore && (
                                <div className="flex items-center gap-2 text-[var(--accent)]">
                                    <Loader2 size={20} className="animate-spin" />
                                    <span className="text-sm">Loading more...</span>
                                </div>
                            )}
                            {!hasMore && posts.length > 0 && (
                                <p className="text-sm text-[var(--text-secondary)]">No more items to load</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-6xl mb-4 opacity-20">🔍</p>
                        <h3 className="text-lg font-bold text-white mb-2">No items found</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Try adjusting your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
